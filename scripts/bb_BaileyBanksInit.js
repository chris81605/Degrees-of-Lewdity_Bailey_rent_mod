// 1. 初始化貝利存款與保險箱
function bb_initializeMoney() {
    // 若已初始化過，直接跳過
    if (typeof V.Baileys_money !== "undefined") {
        console.log("[BRM][bb_initializeMoney] 已初始化，跳過");
        return;
    }

    console.log("[BRM][bb_initializeMoney] 開始初始化 Bailey 金錢資料");

    // 初始可用存款
    V.Baileys_money = 0;

    // 隨機種子：決定初始累計次數（15~45）
    const seed = Math.floor(Math.random() * (45 - 15 + 1)) + 15;
    console.log(`[BRM][bb_initializeMoney] seed = ${seed}`);

    // 累加初始資產：每筆 50k~100k
    for (let i = 0; i < seed; i++) {
        const add = Math.floor(Math.random() * (100000 - 50000 + 1)) + 50000;
        V.Baileys_money += add;
    }
    console.log(`[BRM][bb_initializeMoney] 初始累積可用存款 (before safe) = ${V.Baileys_money}`);

    // 初始化保險箱（總額 10%~30%）
    const safeRatio = Math.random() * (0.3 - 0.1) + 0.1;
    V.Baileys_safe_money = Math.round(V.Baileys_money * safeRatio);
    V.Baileys_money -= V.Baileys_safe_money;

    console.log(`[BRM][bb_initializeMoney] safeRatio = ${safeRatio.toFixed(3)}`);
    console.log(`[BRM][bb_initializeMoney] 保險箱 = ${V.Baileys_safe_money}, 可用 = ${V.Baileys_money}`);

    // 初始化歷史紀錄
    if (!Array.isArray(V.Baileys_logs)) V.Baileys_logs = [];
    V.Baileys_logs.push(
        `第 ${Time.days} 天初始化：可用 ${V.Baileys_money}，保險箱 ${V.Baileys_safe_money}，總額 ${V.Baileys_money + V.Baileys_safe_money}`
    );

    console.log("[BRM][bb_initializeMoney] 已寫入初始化紀錄");

    // 初始化上次觸發天數（避免 update 初始時誤觸）
    /*V.last_increase_day = Time.days;
    console.log(`[BRM][bb_initializeMoney] 設定 last_increase_day = ${Time.days}`);
    */
    bb_updateMoney();
    
}



// 2. 初始化懷疑值
function bb_initializeSuspicion() {
    if (typeof V.suspicion !== "undefined") {
        console.log("[BRM][bb_initializeSuspicion] 已初始化，跳過");
        return;
    }

    console.log("[BRM][bb_initializeSuspicion] 初始化 suspicion = 0");
    V.suspicion = 0;
}

// 3. 每七天更新存款
function bb_updateMoney() {
    // 若每日執行，僅每 7 天觸發一次
    if (V.bb_dayCounter === "undefined") {
        V.bb_dayCounter = 1;
        bb_initializeMoney();
        bb_initializeSuspicion();
        console.log(`[BRM][bb_updateMoney] DayCounter = ${V.bb_dayCounter}，已完成初始化。`);
    }else{
        V.bb_dayCounter += 1;
        console.log(`[BRM][bb_updateMoney] DayCounter = ${V.bb_dayCounter}`);
    }

    if (V.bb_dayCounter < 7) {
        console.log("[BRM][bb_updateMoney] : 未達 7 天，不觸發每週更新");
        return;
    }

    console.log("[BRM][bb_updateMoney] :已達條件，計數器歸零 → 觸發每週更新");
    V.bb_dayCounter = 0;

    const weeksPassed = 1;

    let totalIncrease = 0;
    let totalSafe = 0;
    let totalDecrease = 0;

    let base_rent = V.base_rent || 10000;
    if (typeof V.current_stage !== "number") V.current_stage = 1;

    const rentTable = [10000, 30000, 50000, 70000, 100000, 150000, 200000];
    base_rent = Math.floor(rentTable[Math.clamp(V.current_stage, 1, 6)] * (V.rentmod || 1));

    if (V.robinpaid === 1) {
        console.log("[BRM][bb_updateMoney] Robin 已付款 → 租金 *2");
        base_rent *= 2;
    }

    const adjustedRent = Math.min(V.rentmoney || 0, base_rent);
    console.log(`[BRM][bb_updateMoney] base_rent=${base_rent}, adjustedRent=${adjustedRent}`);

    const randomMultiplier = Math.floor(Math.random() * 13) + 3;
    const currentIncrease = Math.floor(adjustedRent * randomMultiplier);
    totalIncrease += currentIncrease;

    console.log(`[BRM][bb_updateMoney] randomMultiplier = ${randomMultiplier}, currentIncrease = ${currentIncrease}`);

    const safeRatio = Math.random() * 0.2 + 0.1;
    const safeIncrease = Math.round(currentIncrease * safeRatio);
    totalSafe += safeIncrease;

    console.log(`[BRM][bb_updateMoney] safeRatio = ${safeRatio.toFixed(3)}, safeIncrease = ${safeIncrease}`);

    const decreaseRatio = Math.random() * 0.4 + 0.4;
    const weeklyDecrease = Math.round(currentIncrease * decreaseRatio);

    console.log(`[BRM][bb_updateMoney] decreaseRatio = ${decreaseRatio.toFixed(3)}, weeklyDecrease = ${weeklyDecrease}`);

    // 減少 Bailey 的錢
    if (weeklyDecrease <= V.Baileys_safe_money) {
        console.log(`[BRM][bb_updateMoney] 從保險箱扣 ${weeklyDecrease}`);
        V.Baileys_safe_money -= weeklyDecrease;
    } else {
        const remaining = weeklyDecrease - V.Baileys_safe_money;
        console.log(`[BRM][bb_updateMoney] 保險箱不足，先扣光，再從可用扣 ${remaining}`);
        V.Baileys_safe_money = 0;
        V.Baileys_money -= remaining;
    }
    totalDecrease += weeklyDecrease;

    if (V.rentstage_step) {
        const oldStage = V.current_stage;
        V.current_stage = Math.clamp(V.current_stage + 1, 1, 6);
        console.log(`[BRM][bb_updateMoney] 租金階段上升：${oldStage} → ${V.current_stage}`);
    }

    // 最終分配
    V.Baileys_money += (totalIncrease - totalSafe);
    V.Baileys_safe_money += totalSafe;

    console.log(`[BRM][bb_updateMoney] 最終存款變化：可用 ${V.Baileys_money}，保險箱 ${V.Baileys_safe_money}`);

    // 記錄 Log
    V.weeksPassed = weeksPassed;
    V.totalIncrease = totalIncrease;
    V.totalDecrease = totalDecrease;
    V.totalSafe = totalSafe;

    if (!Array.isArray(V.Baileys_logs)) V.Baileys_logs = [];
    V.Baileys_logs.push(
        `第 ${Time.days} 天，又經過 1 周，總增加金額: ${totalIncrease}，總支出: ${totalDecrease}，保險箱: ${totalSafe}，可用存款: ${V.Baileys_money}，保險箱存款: ${V.Baileys_safe_money}`
    );

    console.log(`[BRM][bb_updateMoney] 已寫入 Bailey 的 log`);
}

// =======================
// 導出模組
// =======================
window.bb_initializeMoney = bb_initializeMoney;
window.bb_initializeSuspicion = bb_initializeSuspicion;
window.bb_updateMoney = bb_updateMoney;

// 註冊成 SugarCube macro
DefineMacro("initializeBaileysMoney", () => bb_initializeMoney());
DefineMacro("initializeSuspicion", () => bb_initializeSuspicion());
DefineMacro("updateBaileysMoney", () => bb_updateMoney());


// 註冊框架
(function register_bb_updateMoney() {
    const logger = window.modUtils.getLogger();

    const maplebirchMod = window.modUtils.getMod('maplebirch');
    const simpleMod = window.modUtils.getMod('Simple Frameworks');

    if (maplebirchMod) {
        maplebirchFrameworks.addTimeEvent('onDay', 'bb_updateMoney', {
            action: () => bb_updateMoney(),
            priority: 0,
            once: false
        });
        logger.log('[BRM] 已使用 Maplebirch 註冊每日金錢更新事件');
        return;
    }

    if (simpleMod) {
        new TimeEvent('onDay', 'bb_updateMoney').Action(() => bb_updateMoney());
        logger.log('[BRM] 已使用 Simple Frameworks 註冊每日金錢更新事件');
        return;
    }

    logger.error('[BRM] 找不到可用的時間框架（Maplebirch / Simple Frameworks）');
})();

// 定義函數
function brm_resetModule() {
    // BB 金錢系統
    delete V.Baileys_money;
    delete V.Baileys_safe_money;
    delete V.Baileys_logs;
    delete V.last_increase_day;
    delete V.bb_dayCounter;

    // 懷疑值
    delete V.suspicion;

    // 租金系統
    //delete V.rentmoney;
    delete V.rentstage;
    delete V.rent_enabled;
    delete V.rent_Interest;
    delete V.rentstage_step;
    //delete V.current_stage;
    //delete V.renttime;

    console.log("[BRM] 模組變數已強制重置，下次進行初始化會重新生成。");
}

// 註冊 macro
if (!Macro.get("brm_reset")) {
    DefineMacro("brm_reset", function() {
        brm_resetModule();
        this.output.append("[BRM] 模組重置完成");
    });
}
window.brm_resetModule = brm_resetModule;

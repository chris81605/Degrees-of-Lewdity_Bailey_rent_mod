// Core-計算欠債時間
function brm_calculateDebtTime() {
    if (V.renttime > -7) return null; // 未逾期，不計算
    
    const daysInDebt = Math.abs(V.renttime);

    const debt = {
        days: daysInDebt,
        years: Math.floor(daysInDebt / 365),
        months: Math.floor((daysInDebt % 365) / 30),
        weeks: Math.floor((daysInDebt % 30) / 7),
        remainingDays: daysInDebt % 7,
        overdueWeeks: Math.ceil(daysInDebt / 7)
    };

    // 同步到遊戲變數
    V.days_in_debt       = debt.days;
    V.years_in_debt      = debt.years;
    V.months_in_debt     = debt.months;
    V.weeks_in_debt      = debt.weeks;
    V.remaining_days     = debt.remainingDays;
    V.overdue_weeks      = debt.overdueWeeks;

    return debt;
}

// Core-累計租金
function brm_calculateRent(debt) {
    if (!debt) return;

    let rentmoneyAccum = 10000;  // 初始租金基數
    let currentStage = V.rentstage; // 獲取當前進度
    const rentTable = [10000, 30000, 50000, 70000, 100000, 150000, 200000];

    for (let i = 0; i < debt.overdueWeeks; i++) {
        const stageIndex = Math.clamp(currentStage, 1, 6);
        let baseRent = Math.floor(rentTable[stageIndex] * V.rentmod);

        if (V.robinpaid === 1) baseRent *= 2;

        rentmoneyAccum += baseRent;

        if (V.rentstage_step) { 
            currentStage = Math.clamp(currentStage + 1, 1, 6);
            V.currentStage = currentStage;
            }
    }

    const babyRentAccum = V.babyRent ? V.babyRent * debt.overdueWeeks : 0;

    V.rentmoney = (rentmoneyAccum + babyRentAccum) * V.rent_Interest;
}

// Core-更新租金
function brm_rentUpdate() {
    // 初始化相關變數
    if (V.rent_enabled === undefined) V.rent_enabled = 1;  // 模組開關
    if (V.rent_Interest === undefined) V.rent_Interest = 1; //利息倍率
    if (V.rentstage_step === undefined) V.rentstage_step = false; // 逐週步進
        
    const debt = brm_calculateDebtTime();
    if (V.rent_enabled ==1 && debt) brm_calculateRent(debt);
}

// 註冊函數（註冊到簡易框架或maplebirch，自動判斷環境）
function registerBrm_rentUpdate() {
    const maplebirchMod = window.modUtils.getMod('maplebirch');
    const simpleMod = window.modUtils.getMod('Simple Frameworks');
    const logger = window.modUtils.getLogger();

    if (maplebirchMod) {
        maplebirchFrameworks.addTimeEvent('onDay', 'brm_rentUpdate', {
            action: () => brm_rentUpdate(),
            priority: 0,
            once: false
        });
        logger.log('[BRM] Maplebirch 已註冊每日租金自動更新事件');
    } else if (simpleMod) {
        new TimeEvent('onDay', 'brm_rentUpdate').Action(() => brm_rentUpdate());
        logger.log('[BRM] Simple Frameworks 已註冊每日租金自動更新事件');
    } else {
        logger.error('[BRM] 未檢測到 Maplebirch 或 Simple Frameworks，無法註冊每日租金事件');
    }
};

// 初始化註冊函數
registerBrm_rentUpdate();
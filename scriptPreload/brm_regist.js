(() => {
    window.modSC2DataManager.getModLoadController().addLifeTimeCircleHook(
        'bailey_rent_mod',
        {
            ModLoaderLoadEnd: async () => {
                const logger = window.modUtils.getLogger();
                const maplebirchMod = window.modUtils.getMod('maplebirch');
                const simpleMod = window.modUtils.getMod('Simple Frameworks');

                if (maplebirchMod) {
                    maplebirchFrameworks.addto('CaptionAfterDescription', 'rent_acc_mod');
                    maplebirchFrameworks.addto('Options', 'rent_acc_mod_switch');
                    logger.log('[Bailey rent mod] Maplebirch 已註冊租屋模組');
                } else if (simpleMod) {
                    simpleFrameworks.addto('ModCaptionAfterDescription', 'rent_acc_mod');
                    simpleFrameworks.addto('iModOptions', 'rent_acc_mod_switch');
                    logger.log('[Bailey rent mod] Simple Frameworks 已註冊租屋模組');
                } else {
                    logger.error('[Bailey rent mod] 未檢測到 Maplebirch 或 Simple Frameworks');
                }
            },
        }
    );
})();
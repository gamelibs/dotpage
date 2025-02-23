import { CONFIG } from './config.js';
import { SoundManager, GameSettings } from './baseEvents.js';
import { AdManager } from './adManager.js';
import { ReportManager } from './reportManager.js';


const SDK = {

    initializeSDK: async function () {

        window.__woso = {
            SoundManager,
            GameSettings,
            isDot: false,
            ReportManager
        };

        try {

            const urlParams = new URLSearchParams(window.location.search);

            const paramObject = {};
            urlParams.forEach((value, key) => {
                paramObject[key] = value;
            });
            console.log(paramObject);

            // 转换 sound 参数为布尔值
            const soundEnabled = paramObject.sound === 'true';
            soundEnabled ? SoundManager.resumeAll() : SoundManager.pauseAll();

            // 转换 fps 参数为数字
            const fpsValue = Number(paramObject.fps);
            GameSettings.setFps(isNaN(fpsValue) ? 60 : fpsValue);

            // 转换 diff 参数为数字
            const difficultyValue = Number(paramObject.diff);
            GameSettings.setDifficulty(isNaN(difficultyValue) ? 0 : difficultyValue);

            // 转换 ads 参数为布尔值
            const adsEnabled = paramObject.ads === 'true';
            adsEnabled ? AdManager.open() : AdManager.close();

            const response = await fetch(CONFIG.TEST_URL);
            if (response.ok) {
                CONFIG.LOCAL_MODE = false;

                // 3. 加载广告SDK
                await AdManager.loadAdSDK();
                window.__woso.AdManager = AdManager;

                // 4. 初始化上报管理器
                try {
                    await ReportManager.init();
                    console.log('ReportManager initialized with userId:', ReportManager.userId);
                } catch (error) {
                    console.error('Failed to initialize ReportManager:', error);
                }

                console.log('成功连接服务器,启用完整功能');
            }
        } catch (e) {
            console.log('无法连接服务器,仅启用本地功能');
        }
    }
}
// 自动初始化
if (typeof window !== 'undefined') {
    SDK.initializeSDK().catch(console.error);
}
export default SDK;
/////////////////游戏调用代码/////////////////////
//
/**
 * 根据URL参数控制游戏功能
 * typeof __woso !="undefine" && !__woso.SoundManager.isSound; // 声音
 *
 * typeof __woso !="undefine" && !__woso.isDot; // 上报
 *
 * typeof __woso !="undefine" && !__woso.AdManager.isAds; // 广告
 */
// 
import { CONFIG, DOT_NAME } from './config.js';
import { DeviceInfo } from './deviceInfo.js';
import { generateUUID, getOrGenerateUserId } from './utils.js';

export const ReportManager = {
  initialized: false,
  userId: null,
  gameSessionId: null,

  init: async function () {
    if (this.initialized) return;

    try {
      this.userId = getOrGenerateUserId();
      this.gameSessionId = generateUUID();

      __woso.isDeug && console.log('初始化ID:', {
        userId: this.userId,
        gameSessionId: this.gameSessionId
      });

      const response = await fetch(CONFIG.TEST_URL);
      if (!response.ok) throw new Error('Server unreachable');

      this.initialized = true;
      this.userEvent(DOT_NAME.USER_ID, {
        user_id: this.userId,
        session_id: this.gameSessionId
      });

    } catch (e) {
      console.warn('Server unreachable, operating in local mode');
      CONFIG.LOCAL_MODE = true;
    }
  },

  userEvent: async function (eventType, data = {}) {
    if (CONFIG.LOCAL_MODE) {
      __woso.isDeug && console.log('Local mode - Event:', eventType, data);
      return;
    }

    if (!this.userId || !this.gameSessionId) {
      console.error('Missing required IDs', {
        userId: this.userId,
        sessionId: this.gameSessionId
      });
      return;
    }

    const payload = {
      user_id: this.userId,
      session_id: this.gameSessionId,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      device_info: DeviceInfo.get(),
      ...data
    };

    this.sendReport(CONFIG.SERVER_URL + '/api/users/register', payload);
  },

  startReporting: function () {
    if (CONFIG.LOCAL_MODE) return;
  },

  reportEvent: async function (eventType, data = {}) {
    if (CONFIG.LOCAL_MODE) {
      __woso.isDeug && console.log('Local mode - Event:', eventType, data);
      return;
    }

    if (!this.userId || !this.gameSessionId) {
      console.error('Missing required IDs', {
        userId: this.userId,
        sessionId: this.gameSessionId
      });
      return;
    }

    const payload = {
      user_id: this.userId,
      session_id: this.gameSessionId,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      device_info: DeviceInfo.get(),
      ...data
    };

    this.sendReport(`${CONFIG.SERVER_URL}/api/events/save`, payload);
  },

  reportGameEnter: function () {
    this.reportEvent(DOT_NAME.GAME_ENTER, {
      game_start_time: new Date().toISOString()
    });
  },

  reportGameTime: function () {
    this.reportEvent(DOT_NAME.GAME_UPTIME);
  },

  reportGameScore: function (score) {
    this.reportEvent(DOT_NAME.GAME_SCORE, {
      game_score: score
    });
  },

  reportLevelProgress: function (levelNumber, progress) {
    this.reportEvent(DOT_NAME.GAME_LEVEL, {
      level_number: levelNumber,
      progress: progress
    });
  },

  reportSoundState: function (isEnabled) {
    this.reportEvent(
      isEnabled ? DOT_NAME.SOUND_RESUMED : DOT_NAME.SOUND_PAUSED,
      { state: isEnabled ? 'OPEN' : 'CLOSE' }
    );
  },

  reportAdsState: function (isEnabled) {
    this.reportEvent(
      isEnabled ? DOT_NAME.ADS_OPENED : DOT_NAME.ADS_CLOSED,
      { state: isEnabled ? 'OPEN' : 'CLOSE' }
    );
  },

  reportFpsSet: function (fps) {
    this.reportEvent(DOT_NAME.FPS_SET, { rate: fps });
  },

  reportDifficultySet: function (level) {
    this.reportEvent(DOT_NAME.DIFFICULTY_SET, { level: level });
  },

  sendReport: function (url, data, retries = 1) {
    if (CONFIG.LOCAL_MODE) return;

    __woso.isDeug && console.log("正在上报:", JSON.stringify(data, null, 2));

    const attempt = (currentRetries) => {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
          return response.headers.get('content-type')?.includes('application/json')
            ? response.json()
            : response.text();
        })
        .then(result => {
          __woso.isDeug && console.log('上报成功:', typeof result === 'string' ? result : JSON.stringify(result, null, 2));
        })
        .catch(error => {
          if (currentRetries > 0) {
            console.warn(`上报失败,剩余重试次数: ${currentRetries - 1}`, error);
            setTimeout(() => attempt(currentRetries - 1), 1000);
          } else {
            console.error('上报失败,重试次数用尽:', error);
          }
        });
    };

    attempt(retries);
  }
};
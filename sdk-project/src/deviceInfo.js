export const DeviceInfo = {
    get: function() {
      const ua = navigator.userAgent.toLowerCase();
      
      return {
        platform: this.getPlatform(ua),
        browser: this.getBrowser(ua),
        os: this.getOS(ua),
        language: navigator.language,
        url: window.location.href
      };
    },
  
    getPlatform(ua) {
      if(/mobile|android|ios/i.test(ua)) return 'mobile';
      return 'desktop';
    },
  
    getBrowser(ua) {
      if(/chrome/i.test(ua)) return 'chrome';
      if(/firefox/i.test(ua)) return 'firefox';
      if(/safari/i.test(ua)) return 'safari';
      return 'other';
    },
  
    getOS(ua) {
      if(/android/i.test(ua)) return 'android';
      if(/ios/i.test(ua)) return 'ios'; 
      if(/windows/i.test(ua)) return 'windows';
      if(/mac/i.test(ua)) return 'macos';
      return 'other';
    }
};
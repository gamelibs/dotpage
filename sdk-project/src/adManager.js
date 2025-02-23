export const AdManager = {
  isAds: true,
  set: function (value) {
    this.isAds = value;
  },
  open: function () {
    this.set(true);
    console.log("启用广告");
  },
  close: function () {
    this.set(false);
    console.log("禁用广告");
  },

  adInstance: null,

  loadAdSDK: function () {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://www.cpsense.com/public/PRESDK3.0.1.js";
      script.async = true;

      script.onload = () => {
        this.initAdSDK();
        resolve();
      };

      script.onerror = reject;

      document.head.appendChild(script);
    });
  },

  initAdSDK: function () {
    this.adInstance = new adSdk({
      el: document.querySelector("#adcontent"),
      client: "cpsense",
      is_test: true
    });
  },

  showAd: function (type, callback) {
    if (!this.adInstance) {
      console.warn("Ad SDK not initialized");
      callback?.();
      return;
    }

    switch (type) {
      case 'interstitial':
        this.showInterstitialAd(callback);
        break;
      case 'rewarded':
        this.showRewardedAd(callback);
        break;
    }
  }
};
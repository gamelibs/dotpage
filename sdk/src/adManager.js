export const AdManager = {
  isAds: true,
  platform: "",
  platformType: 0,
  set: function (value) {
    this.isAds = value;
  },
  open: function () {
    this.set(true);
    OVO.isDeug && console.log("启用广告");
  },
  close: function () {
    this.set(false);
    OVO.isDeug && console.log("禁用广告");
  },

  adInstance: null,

  loadAdSDK: function () {
    if(this.isAds && this.platformType !== 0){

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
    }else{
      return null;
    }
  },

  initAdSDK: function () {
    this.adInstance = new adSdk({
      el: document.querySelector("#adcontent"),
      client: "cpsense",
      is_test: true
    });
  },

  showAd: function (type, callback) {

    if(this.platformType !== 0) {
      console.log("no pl")
      return;
    }
    if (!this.adInstance) {
      console.warn("Ad SDK not initialized");
      callback?.();
      return;
    }

    switch (type) {
      case 'fristAd':
        OVO.isDeug && console.log("请求开屏广告")
        this.showFristAd;
        break;
      case 'interstitial':
        OVO.isDeug && console.log("请求插页广告")
        this.showInterstitialAd(callback);
        break;
      case 'rewarded':
        OVO.isDeug && console.log("请求视频广告")
        this.showRewardedAd(callback);
        break;
    }
  },

  showFristAd: function () {
    let isTimeOut = false

    adInstance.interstitialAd({
      beforeAd() {
        isTimeOut = true
        typeof gamebox !== 'undefined' && (gamebox.style.display = 'none')
        // wsdk.gameDot(DOT.GAME_INTERSTITIAL_OPEN, 'fristAd open')
      },
      afterAd() {
        isTimeOut = true
        // wsdk.gameDot(DOT.GAME_INTERSTITIAL_VIEWED, 'fristAd viewed')
        typeof gamebox !== 'undefined' &&
          (gamebox.style.display = 'block')

      },
      error(err) {
        isTimeOut = true
        OVO.isDeug && console.log('fristAd', err)
        // wsdk.gameDot(DOT.AD_ERROR, 'fristAd ' + err)

      },
    })

    const st_time = setTimeout(() => {
      clearTimeout(st_time)
      if (!isTimeOut) {
        OVO.isDeug && console.log('fristAd timeout 3s')
        // wsdk.gameDot(DOT.AD_ERROR, 'fristAd timeout')

      }
    }, 3000)
  },

  // Display inset ads
  showInterstitialAd: function (callback) {
    let isAdError = false
    this.adInstance &&
      this.adInstance.interstitialAd({
        beforeAd() {
          isAdError = true
          // callback && callback('beforeAd')
        },
        afterAd() {
          isAdError = true
          // wsdk.gameDot(DOT.GAME_INTERSTITIAL_VIEWED, 'afterAd viewed')

          callback && callback(true)
          OVO.isDeug && console.log('afterAd-yes')
        },
        error(err) {
          isAdError = true
          callback && callback(false)
          OVO.isDeug && console.log('afterAd-Error-no')
        },
      })

    const st_Inter = setTimeout(() => {
      clearTimeout(st_Inter)

      if (!isAdError) {
        // wsdk.gameDot(DOT.AD_ERROR, 'inter timeout')
        callback && callback(false)
        OVO.isDeug && console.log('afterAd-Error-timeout')
      }
    }, 2000)
  },

  showRewardedAd: function (callback) {
    let isAdError = false
    this.adInstance.rewardAd({
      beforeAd() {
        isAdError = true
        // wsdk.gameDot(DOT.GAME_REWARD_OPEN, 'ad reward open')
      },
      adDismissed() {
        isAdError = true
        // wsdk.gameDot(DOT.GAME_REWARD_DISMISSED)

        callback && callback(false)
        OVO.isDeug && console.log('afterAd-v-no')

      },
      adViewed() {
        isAdError = true
        //wsdk.gameDot(DOT.GAME_REWARD_VIEWED)

        callback && callback(true)
        OVO.isDeug && console.log('afterAd-v-yes')
      },
      error(err) {
        isAdError = true
        //wsdk.gameDot(DOT.AD_ERROR, 'video' + err)

        callback && callback(false)
        OVO.isDeug && console.log('afterAd-Error-no')
      },
    })

    const st_video = setTimeout(() => {
      clearTimeout(st_video)

      if (!isAdError) {
        // wsdk.gameDot(DOT.AD_ERROR, 'video timerout')

        callback && callback(false)
        OVO.isDeug && console.log('afterAd-v-timeout')
      }
    }, 2000)
  }

};
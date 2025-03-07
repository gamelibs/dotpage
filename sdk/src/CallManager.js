
const CallManager = {
    // 这里可以添加 CallManager 的属性和方法

};
export default CallManager;

export const TopCallback = function () {
    console.log("call top message!");
    // window.TopCallback();
    // window["TopCallback"]?.();
    if (window.__woso.SoundManager.isSound) {
        window.__woso.SoundManager.resumeAll();
    } else {
        window.__woso.SoundManager.pauseAll();
    }

    //ads
    if(window.__woso.AdManager.isAds){
      window.__woso.TargetedAds.open();
    }else{
      window.__woso.TargetedAds.clos();
    }
};

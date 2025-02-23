export const SoundManager = {
  isSound: true,
  set: function(value) {
    this.isSound = value;
  },
  pauseAll: function() {
    this.set(false);
    console.log("暂停声音");
  },
  resumeAll: function() {
    this.set(true); 
    console.log("恢复声音");
  }
};

export const GameSettings = {
  fps: 60,
  difficulty: 0,
  setFps: function(value) {
    this.fps = value;
    console.log("设置FPS:", value);
  },
  setDifficulty: function(value) {
    this.difficulty = value;
    console.log("设置难度:", value);
  }
};

export const LocalStorage = {
  getItem: function(key) {
    try {
      return localStorage.getItem(key);
    } catch(e) {
      return null;
    }
  },
  setItem: function(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch(e) {
      console.warn("localStorage写入失败");
    }
  }
};
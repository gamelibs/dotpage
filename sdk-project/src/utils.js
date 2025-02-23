// 基础工具方法
const Utils = {
    // 存储相关方法
    storage: {
      get: function(key) {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          console.warn('localStorage读取失败:', e);
          return null;
        }
      },
  
      set: function(key, value) {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (e) {
          console.warn('localStorage写入失败:', e);
          return false;
        }
      }
    },
  
    // Cookie相关方法
    cookie: {
      set: function(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
      },
  
      get: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
      }
    }
  };
  
  // UUID生成
  export function generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  
  // 用户ID生成与获取
  export function generateUserId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `user_${timestamp}_${random}`;
  }
  
  export function getOrGenerateUserId() {
    // 先从localStorage获取
    let userId = Utils.storage.get('userId');
    
    // 如果没有再从cookie获取
    if (!userId) {
      userId = Utils.cookie.get('userId');
    }
    
    // 如果都没有则生成新的
    if (!userId) {
      userId = generateUserId();
      // 同时保存到localStorage和cookie
      Utils.storage.set('userId', userId);
      Utils.cookie.set('userId', userId, 365); // 保存365天
    }
    
    return userId;
  }
  
  // 时间格式化
  export function formatDate(date) {
    return new Date(date).toISOString();
  }
  
  // 防抖函数
  export function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    }
  }
  
  // 导出工具对象
  export default Utils;
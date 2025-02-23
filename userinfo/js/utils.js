/* filepath: /Users/vidar/works/deepseek/page/userinfo/js/utils.js */
class Utils {
  static formatDate(date) {
      return new Date(date).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
      });
  }

  static debounce(fn, delay) {
      let timer = null;
      return function (...args) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => fn.apply(this, args), delay);
      };
  }

  static async fetchWithRetry(url, options = {}, retries = CONFIG.RETRY_ATTEMPTS) {
      try {
          const response = await fetch(url, options);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return await response.json();
      } catch (error) {
          if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
              return this.fetchWithRetry(url, options, retries - 1);
          }
          throw error;
      }
  }
}
const CONFIG = {
  API_BASE_URL: 'http://192.168.1.157:13258',
  // API_BASE_URL: '//save.gameslog.top',
  PAGE_SIZE: 20,
  CACHE_DURATION: 5 * 60 * 1000, // 5分钟缓存
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',

  PAGINATION: {
    ITEMS_PER_PAGE: 10,
    MAX_PAGES_SHOWN: 5
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  },
  ENDPOINTS: {
    USERS: 'api/users',
    EVENTS: '/event/info',  // 使用正确的endpoint
    SESSION: '/session/info',
    USERLIST: "api/users/list"
  },
};

const EVENTS = {
  USER_SELECTED: 'userSelected',
  DATA_LOADED: 'dataLoaded',
  ERROR_OCCURRED: 'errorOccurred'
};
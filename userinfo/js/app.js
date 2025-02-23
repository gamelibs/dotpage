/* filepath: /Users/vidar/works/deepseek/page/userinfo/js/app.js */
class App {
    constructor() {
        this.store = new Store();
        window.store = this.store;

        this.userList = document.querySelector('user-list-component');
        this.eventDetails = document.querySelector('event-details-component');

        this.init();
    }

    init() {
        this.userList.addEventListener('user-selected', (e) => {
            const userId = e.detail.userId;
            this.eventDetails.loadUserDetails(userId);
        });

        // 监听全局加载状态
        this.store.subscribe(state => {
            document.getElementById('loading').style.display = 
                state.loading ? 'block' : 'none';
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
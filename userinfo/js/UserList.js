/* filepath: /Users/vidar/works/deepseek/page/userinfo/js/UserList.js */
class UserListComponent extends HTMLElement {
    constructor() {
        super();
        if (!window.store) {
            throw new Error('Store is not initialized');
        }
        this.store = window.store;
        this.currentPage = 1;
        this.loading = false;
        this.totalCount = 0; // 添加用户总数计数
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="user-list-container">
                <h2>用户列表</h2>
                <ul class="user-list"></ul>
                <div class="pagination">
                    <button class="prev-page" disabled>上一页</button>
                    <span class="page-info"></span>
                    <button class="next-page" disabled>下一页</button>
                </div>
            </div>
        `;

        // 添加分页按钮事件监听
        this.querySelector('.prev-page').addEventListener('click', () => this.changePage(-1));
        this.querySelector('.next-page').addEventListener('click', () => this.changePage(1));

        this.unsubscribe = this.store.subscribe(state => this.render(state));
        this.addEventListener('click', this.handleClick.bind(this));
        this.loadUsers();
    }

    changePage(delta) {
        const state = this.store.state;
        const totalPages = Math.ceil(state.users.length / this.pageSize);
        const newPage = this.currentPage + delta;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.render(state);
        }
    }

    disconnectedCallback() {
        this.unsubscribe?.();
    }

    async loadUsers() {
        try {
            this.store.dispatch('setLoading', true);
            const cachedUsers = this.store.getCachedData('users');
            
            if (cachedUsers) {
                this.store.dispatch('setUsers', cachedUsers);
            } else {
                const response = await Utils.fetchWithRetry(
                    `${CONFIG.API_BASE_URL}/${CONFIG.ENDPOINTS.USERLIST}`
                );
                
                // 检查响应格式并提取users数组
                if (response.success && Array.isArray(response.users)) {
                    const formattedUsers = response.users.map(user => ({
                        id: user.user_id,
                        created_at: user.created_at,
                        lastActive: user.last_active,
                        deviceInfo: user.device_info
                    }));
                    this.totalCount = response.count || formattedUsers.length; // 使用API返回的count或计算长度
                    this.store.dispatch('setUsers', formattedUsers);
                    this.store.setCachedData('users', formattedUsers);
                } else {
                    throw new Error('无效的数据格式');
                }
            }
            // 更新标题
            this.updateTitle();
        } catch (error) {
            console.error('加载用户数据失败:', error);
            this.store.dispatch('setError', error.message);
        } finally {
            this.store.dispatch('setLoading', false);
        }
    }

    // 添加更新标题的方法
    updateTitle() {
        const titleEl = this.querySelector('h2');
        if (titleEl) {
            titleEl.innerHTML = `用户列表 <sub>(${this.totalCount})</sub>`;
        }
    }

    render(state) {
        const listEl = this.querySelector('.user-list');
        if (!listEl) return;

        if (state.loading) {
            listEl.innerHTML = '<li class="loading">加载中...</li>';
            return;
        }

        if (state.error) {
            listEl.innerHTML = `<li class="error">${state.error}</li>`;
            return;
        }

        if (!Array.isArray(state.users) || state.users.length === 0) {
            listEl.innerHTML = '<li class="empty">暂无用户数据</li>';
            return;
        }

        listEl.innerHTML = state.users.map(user => `
            <li class="user-item ${state.selectedUser?.id === user.id ? 'selected' : ''}" 
                data-user-id="${user.id}">
                <div class="user-info">
                    <div class="user-primary">
                        <span class="user-id">ID: ${user.id}</span>
                        <span class="user-platform">${user.deviceInfo.platform}</span>
                    </div>
                    <div class="user-secondary">
                        <span class="user-created">注册: ${Utils.formatDate(user.created_at)}</span>
                        <span class="user-active">最近活动: ${Utils.formatDate(user.lastActive)}</span>
                    </div>
                    <div class="user-device">
                        <span>${user.deviceInfo.os} - ${user.deviceInfo.browser}</span>
                    </div>
                </div>
            </li>
        `).join('');
    
    }



    handleClick(event) {
        const userItem = event.target.closest('.user-item');
        if (userItem) {
            const userId = userItem.dataset.userId;
            this.store.dispatch('setSelectedUser', { id: userId });
            const event = new CustomEvent('user-selected', { detail: { userId } });
            this.dispatchEvent(event);
        }
    }
}

customElements.define('user-list-component', UserListComponent);
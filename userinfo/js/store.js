/* filepath: /Users/vidar/works/deepseek/page/userinfo/js/store.js */
class Store {
    constructor() {
        this.state = {
            users: [], // 确保初始值为空数组
            selectedUser: null,
            selectedUserDetails: null, // 添加用户详情状态
            events: [],
            loading: false,
            error: null
        };
        this.listeners = new Set();
        this.cache = new Map();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    dispatch(action, payload) {
        switch (action) {
            case 'setUsers':
                this.state.users = payload;
                break;
            case 'setSelectedUser':
                this.state.selectedUser = payload;
                break;
            case 'setSelectedUserDetails':
                this.state.selectedUserDetails = payload;
                break;
            case 'setEvents':
                this.state.events = payload;
                break;
            case 'setLoading':
                this.state.loading = payload;
                break;
            case 'setError':
                this.state.error = payload;
                break;
        }
        this.notify();
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    getCachedData(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        if (Date.now() - cached.timestamp > CONFIG.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
}
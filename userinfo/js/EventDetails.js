/* filepath: /Users/vidar/works/deepseek/page/userinfo/js/EventDetails.js */
class EventDetailsComponent extends HTMLElement {
    constructor() {
        super();
        if (!window.store) {
            throw new Error('Store is not initialized');
        }
        this.store = window.store;
        this.pageSize = 10; // 每页显示10条
        this.currentPage = 1;
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="event-details">
                <h2>用户详情</h2>
                <div class="event-content"></div>
                <div class="pagination">
                    <button class="prev-page" disabled>上一页</button>
                    <span class="page-info">第 1 页</span>
                    <button class="next-page" disabled>下一页</button>
                </div>
            </div>
        `;

        // 添加分页按钮事件监听
        this.querySelector('.prev-page')?.addEventListener('click', () => this.changePage(-1));
        this.querySelector('.next-page')?.addEventListener('click', () => this.changePage(1));

        this.unsubscribe = this.store.subscribe(state => this.render(state));
    }


    changePage(delta) {
        if (!this.store.state.selectedUserDetails) return;
        
        const { events } = this.store.state.selectedUserDetails;
        const totalPages = Math.ceil(events.length / this.pageSize);
        const newPage = this.currentPage + delta;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.render(this.store.state);
        }
    }

    async loadUserDetails(userId) {
        try {
            this.store.dispatch('setLoading', true);
            const response = await Utils.fetchWithRetry(
                `${CONFIG.API_BASE_URL}/api/users/${userId}`
            );

            if (response.success && response.data) {
                // 更新数据结构以匹配新的API响应
                const { user, events, stats } = response.data;
                this.store.dispatch('setSelectedUserDetails', {
                    user,
                    events,
                    stats
                });
            } else {
                throw new Error('获取用户详情失败');
            }
        } catch (error) {
            console.error('加载用户详情失败:', error);
            this.store.dispatch('setError', error.message);
        } finally {
            this.store.dispatch('setLoading', false);
        }
    }

    render(state) {
        const contentEl = this.querySelector('.event-content');
        if (!contentEl) return;

        if (state.loading) {
            contentEl.innerHTML = '<div class="loading">加载中...</div>';
            this.hidePagination();
            return;
        }

        if (state.error) {
            contentEl.innerHTML = `<div class="error">${state.error}</div>`;
            this.hidePagination();
            return;
        }

        const details = state.selectedUserDetails;
        if (!details) {
            contentEl.innerHTML = '<div class="no-selection">请选择用户查看详情</div>';
            this.hidePagination();
            return;
        }

        const { user, events, stats } = details;

        // 计算分页数据
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const totalPages = Math.ceil(events.length / this.pageSize);
        const paginatedEvents = events.slice(startIndex, endIndex);

        // 渲染内容
        contentEl.innerHTML = `
            <div class="user-summary">
                <h3>用户信息</h3>
                <div class="user-info">
                    <p>用户ID: ${user.id}</p>
                    <p>最后活动: ${Utils.formatDate(user.last_active)}</p>
                    <p>设备: ${user.device.platform} - ${user.device.os} - ${user.device.browser}</p>
                </div>
                <div class="stats-info">
                    <p>总事件数: ${stats.total_events}</p>
                    <p>最后活动时间: ${Utils.formatDate(stats.last_activity)}</p>
                </div>
            </div>
            <div class="events-section">
                <h3>事件列表 (${startIndex + 1}-${Math.min(endIndex, events.length)}/${events.length})</h3>
                <div class="events-list">
                    ${paginatedEvents.map(event => `
                        <div class="event-item">
                            <div class="event-header">
                                <span class="event-type">${event.type}</span>
                                <span class="event-time">${Utils.formatDate(event.time)}</span>
                            </div>
                            ${event.score ? `<div class="event-score">得分: ${event.score}</div>` : ''}
                            <div class="event-device">
                                ${event.device.platform} - ${event.device.os} - ${event.device.browser}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // 更新分页控件状态
        this.updatePaginationState(totalPages);
    }

    updatePaginationState(totalPages) {
        const pagination = this.querySelector('.pagination');
        const prevBtn = this.querySelector('.prev-page');
        const nextBtn = this.querySelector('.next-page');
        const pageInfo = this.querySelector('.page-info');

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        pageInfo.textContent = `第 ${this.currentPage} 页 / 共 ${totalPages} 页`;
    }

    hidePagination() {
        const pagination = this.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = 'none';
        }
    }
}

customElements.define('event-details-component', EventDetailsComponent);
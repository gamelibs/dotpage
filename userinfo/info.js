const ip_address = "http://192.168.1.157:13258";
const ITEMS_PER_PAGE = 5; // 每页显示的数量

let currentUserPage = 1;
let currentEventPage = 1;
let allUsers = [];
let currentEvents = [];

// 页面加载时获取用户列表
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${ip_address}/users`);
        if (!response.ok) {
            throw new Error("获取用户数据失败");
        }
        const data = await response.json();
        allUsers = data.users;
        document.getElementById('total-users').textContent = data.count;
        renderUserList(1);
        renderUserPagination(data.count);
        showSuccess('加载用户数据成功'); // 添加成功提示
    } catch (error) {
        console.error("Error:", error);
        showError('加载用户数据失败'); // 添加失败提示
    }
});

// 渲染分页按钮
function renderPagination(totalItems, currentPage, itemsPerPage, containerId, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (totalPages <= 1) return;

    const createPageButton = (page, text) => {
        const button = document.createElement('button');
        button.textContent = text || page;
        if (page === currentPage) button.classList.add('active');
        button.addEventListener('click', () => onPageChange(page));
        return button;
    };

    // 添加首页
    container.appendChild(createPageButton(1));

    // 添加省略号和中间页
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) container.appendChild(document.createTextNode('...'));

    for (let i = startPage; i <= endPage; i++) {
        container.appendChild(createPageButton(i));
    }

    if (endPage < totalPages - 1) container.appendChild(document.createTextNode('...'));

    // 添加末页
    if (totalPages > 1) {
        container.appendChild(createPageButton(totalPages));
    }
}

// 渲染用户分页
function renderUserPagination(totalUsers) {
    renderPagination(
        totalUsers,
        currentUserPage,
        ITEMS_PER_PAGE,
        'user-pagination',
        page => {
            currentUserPage = page;
            renderUserList(page);
        }
    );
}

// 渲染用户列表
function renderUserList(page) {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageUsers = allUsers.slice(startIndex, endIndex);

    const userList = document.getElementById("user-list");
    userList.innerHTML = "";

    pageUsers.forEach((user) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>用户ID: ${user.user_id}</div>
            <div>创建时间: ${new Date(user.created_at).toLocaleString()}</div>
        `;
        li.addEventListener("click", () => loadUserEvents(user.user_id));
        userList.appendChild(li);
    });
}

// 统计事件类型数量
function countEventTypes(events) {
    const counts = {};
    events.forEach(event => {
        counts[event.event_type] = (counts[event.event_type] || 0) + 1;
    });
    return counts;
}

// 渲染事件类型统计
function renderEventTypeCounts(eventCounts) {
    const container = document.getElementById('event-type-count');
    container.innerHTML = '';

    Object.entries(eventCounts).forEach(([type, count]) => {
        const span = document.createElement('span');
        span.textContent = `${type}: ${count}`;
        container.appendChild(span);
    });
}

// 加载用户事件
async function loadUserEvents(userId) {
    try {
        const response = await fetch(`${ip_address}/event/info?user_id=${userId}`);
        if (!response.ok) {
            throw new Error("获取用户事件失败");
        }
        currentEvents = await response.json();

        // 获取最新的会话信息（如果有）
        if (currentEvents.length > 0) {
            const latestEvent = currentEvents[0];
            const sessionInfo = await fetchSessionInfo(userId, latestEvent.session_id);
            displaySessionInfo(sessionInfo);
        } else {
            displaySessionInfo(null);
        }

        // 统计事件类型
        const eventCounts = countEventTypes(currentEvents);
        renderEventTypeCounts(eventCounts);

        // 重置事件页面到第一页
        currentEventPage = 1;
        renderEventList(currentEventPage);
        renderEventPagination(currentEvents.length);
    } catch (error) {
        console.error("Error:", error);
        displaySessionInfo(null);
    }
}

// 渲染事件分页
function renderEventPagination(totalEvents) {
    renderPagination(
        totalEvents,
        currentEventPage,
        10,
        'event-pagination',
        page => {
            currentEventPage = page;
            renderEventList(page);
        }
    );
}

// 渲染事件列表
function renderEventList(page) {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const pageEvents = currentEvents.slice(startIndex, endIndex);

    const eventList = document.getElementById("event-list");
    eventList.innerHTML = "";

    pageEvents.forEach((event) => {
        const li = document.createElement("li");
        // 基础字段（所有事件都显示）
        let eventContent = `
            <strong>事件类型:</strong> ${event.event_type}<br>
            <strong>会话ID:</strong> ${event.session_id}<br>
        `;

        // 根据事件类型添加特定字段
        switch (event.event_type) {
            case 'game_enter':
                eventContent += `
                    <strong>游戏名称:</strong> ${event.game_name || "无"}<br>
                    <strong>游戏开始时间:</strong> ${event.game_start_time ? new Date(event.game_start_time).toLocaleString() : "无"}<br>
                    <strong>设备信息:</strong> ${event.device_info || "无"}<br>
                `;
                break;
            case 'game_level':
                eventContent += `
                    <strong>关卡:</strong> ${event.game_level || "无"}<br>
                    <strong>难度:</strong> ${event.data?.custom_params?.level_info?.difficulty || "无"}<br>
                    <strong>进度:</strong> ${event.data?.custom_params?.level_info?.progress || "无"}<br>
                `;
                break;
            case 'game_score':
                eventContent += `
                    <strong>积分:</strong> ${event.game_score || "无"}<br>
                    <strong>游戏名称:</strong> ${event.game_name || "无"}<br>
                `;
                break;
            case 'game_uptime':
                eventContent += `
                    <strong>游戏会话:</strong> ${event.game_session || "无"}<br>
                    <strong>上报次数:</strong> ${event.uptime_count || 0}<br>
                    <strong>上报间隔:</strong> ${event.interval_time || 10}秒<br>
                    <strong>本次时长:</strong> ${formatTime(event.game_play_time)}<br>
                    <strong>总计时长:</strong> ${formatTime(event.total_uptime)}<br>
                    <strong>最后更新:</strong> ${event.last_update ? new Date(event.last_update).toLocaleString() : "无"}<br>
                `;
                break;
            case 'sound_paused':
            case 'sound_resumed':
                eventContent += `
                    <strong>游戏名称:</strong> ${event.game_name || "无"}<br>
                `;
                break;
            case 'ads_opened':
            case 'ads_closed':
                eventContent += `
                    <strong>游戏名称:</strong> ${event.game_name || "无"}<br>
                    <strong>时间戳:</strong> ${event.timestamp ? new Date(event.timestamp).toLocaleString() : "无"}<br>
                `;
                break;
            case 'fps_set':
                eventContent += `
                    <strong>FPS值:</strong> ${event.data?.custom_params?.fps || "无"}<br>
                `;
                break;
            case 'difficulty_set':
                eventContent += `
                    <strong>难度设置:</strong> ${event.data?.custom_params?.difficulty || "无"}<br>
                `;
                break;
            default:
                // 对于未定义的事件类型，只显示基础信息
                break;
        }

        li.innerHTML = eventContent;
        eventList.appendChild(li);
    });


}


// 添加获取会话信息的函数
async function fetchSessionInfo(userId, sessionId) {
    try {
        const response = await fetch(`${ip_address}/session/info?user_id=${userId}&session_id=${sessionId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch session info');
        }
        const sessionData = await response.json();
        return sessionData;
    } catch (error) {
        console.error('Error fetching session info:', error);
        return null;
    }
}

// 添加显示会话信息的函数
function displaySessionInfo(sessionData) {
    const sessionDetails = document.getElementById('session-details');
    if (!sessionData) {
        sessionDetails.innerHTML = '<div class="detail-item">没有活跃的会话信息</div>';
        return;
    }

    sessionDetails.innerHTML = `
        <div class="detail-item">
            <strong>会话ID:</strong> ${sessionData.session_id}
        </div>
        <div class="detail-item">
            <strong>开始时间:</strong> ${new Date(sessionData.start_time).toLocaleString()}
        </div>
        <div class="detail-item">
            <strong>总计时长:</strong> ${formatTime(sessionData.total_uptime)}
        </div>
        <div class="detail-item">
            <strong>上报次数:</strong> ${sessionData.uptime_count}
        </div>
        <div class="detail-item">
            <strong>最后更新:</strong> ${new Date(sessionData.last_update).toLocaleString()}
        </div>
    `;
}


// 添加时间格式化辅助函数
function formatTime(seconds) {
    if (!seconds) return "无";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}小时`);
    if (minutes > 0) parts.push(`${minutes}分钟`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds}秒`);

    return parts.join(' ') || '0秒';
}

function showSuccess(message) {
    const container = document.getElementById('app');

    // 移除已存在的成功提示（如果有）
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    // 创建成功提示元素
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.innerHTML = `
        <div class="success-content">
            <i class="success-icon">✔️</i>
            <span>${message}</span>
        </div>
    `;

    // 插入成功提示
    container.insertBefore(successElement, container.firstChild);

    // 3秒后移除成功提示
    setTimeout(() => {
        successElement.remove();
    }, 3000);
}

function showError(message) {
    const container = document.getElementById('app');

    // 移除已存在的错误提示（如果有）
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // 创建错误提示元素
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
        <div class="error-content">
            <i class="error-icon">❌</i>
            <span>${message}</span>
        </div>
    `;

    // 插入错误提示
    container.insertBefore(errorElement, container.firstChild);

    // 3秒后移除错误提示
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}
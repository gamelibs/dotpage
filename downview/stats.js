// 初始化图表变量
let chart;


// 获取数据并渲染图表
async function fetchAndRender() {
    try {
        // 显示加载状态
        showLoading();

        const resUrl = false ? 'https://app.gameslog.top/stats' : 'http://localhost:15300/stats';
        const response = await fetch(resUrl);
        const data = await response.json();

        // 解析请求数据
        const endpoints = data.endpoints;
        const labels = [];
        const successValues = [];
        const failureValues = [];

        // 遍历数据，提取成功与失败的次数
        Object.entries(endpoints).forEach(([key, value]) => {
            if (typeof value.success === 'number' && typeof value.failure === 'number') {
                labels.push(key);
                successValues.push(value.success);
                failureValues.push(value.failure);
            } else {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    labels.push(`${key}/${subKey}`);
                    successValues.push(subValue.success);
                    failureValues.push(subValue.failure);
                });
            }
        });

        // 更新下载统计数据
        document.getElementById('successCount').textContent = data.total_success;
        document.getElementById('failureCount').textContent = data.total_failure;

        // 获取 canvas 元素
        const canvas = document.getElementById('requestsChart');
        if (!canvas) {
            console.error('无法获取 canvas 元素');
            showError('无法渲染图表，请检查页面元素');
            hideLoading();
            return;
        }

        // 设置 canvas 样式
        canvas.style.width = '100%';
        canvas.style.maxWidth = '800px';
        canvas.style.height = 'auto';
        canvas.style.maxHeight = '400px';

        // 初始化或更新图表
        if (chart) {
            chart.destroy();
        }
        const ctx = canvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '成功请求',
                        data: successValues,
                        backgroundColor: '#28a745',
                        borderColor: '#218838',
                        borderWidth: 1
                    },
                    {
                        label: '失败请求',
                        data: failureValues,
                        backgroundColor: '#dc3545',
                        borderColor: '#c82333',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        enabled: true
                    },
                    datalabels: {
                        display: true,
                        align: 'top',
                        anchor: 'end',
                        color: '#000',
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });

        // 隐藏加载状态
        hideLoading();
    } catch (error) {
        console.error('获取数据失败:', error);
        showError('无法获取统计数据，请检查网络连接');
        hideLoading();
    }
}

// 加载状态函数
function showLoading() {
    const container = document.querySelector('.container');
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('loading');
    loadingElement.textContent = '加载中...';
    container.appendChild(loadingElement);
}

function hideLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

function showError(message) {
    const container = document.querySelector('.container');
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.innerHTML = `
        <h2>错误</h2>
        <p>${message}</p>
    `;
    container.appendChild(errorElement);
}

// 初始加载
fetchAndRender();

// 监听窗口大小变化，重新渲染图表
window.addEventListener('resize', function () {
    if (chart) {
        chart.destroy();
        fetchAndRender();
    }
});

// 设置自动刷新
let refreshInterval = 10 * 60 * 1000; // 60秒自动刷新
setInterval(fetchAndRender, refreshInterval);

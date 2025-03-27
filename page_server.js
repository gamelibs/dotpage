// 引入 express 模块
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 13260;
const IP = "0.0.0.0"
// 创建一个 express 应用
const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

// 设置静态文件目录，允许访问当前目录下的所有资源
app.use(express.static(path.join(__dirname, './')));
// app.get('/downview', (req, res) => {
//     res.sendFile(path.join(__dirname, 'statsview', 'index.html'));
// });


// app.get('/downview', (req, res) => {
//     res.sendFile(path.join(__dirname, 'statsview', 'index.html'));
// });

// 启动服务器，监听指定端口
app.listen(PORT, IP, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

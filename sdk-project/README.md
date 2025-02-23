# SDK 项目
## 概述
此项目是一个软件开发工具包（SDK），旨在管理包括广告管理、声音设置、游戏配置和用户事件报告在内的多种功能。
## 文件结构
- **src/**：包含源 JavaScript 文件。
- **adManager.js**：管理广告功能。
- **baseEvents.js**：控制声音设置和游戏配置。
- **config.js**：包含配置设置和事件类型常量。
- **deviceInfo.js**：获取用户设备信息。
- **init.js**：初始化 SDK。
- **reportManager.js**：处理用户事件报告。
- **utils.js**：提供用于存储和 Cookie 管理的实用函数。
- **dist/**：用于输出打包和压缩后的 JavaScript 文件的目录。
- **package.json**：npm 的配置文件，列出依赖项和脚本。
- **webpack.config.js**：用于配置 Webpack 来打包和压缩 JavaScript 文件。
## 安装说明1. 克隆此代码库。2. 导航至项目目录。3. 运行 `npm install` 命令来安装依赖项。4. 使用 `npm run build` 命令来打包和压缩 JavaScript 文件。
## 使用方法
在您的 HTML 文件中包含 `dist/` 目录下的捆绑 JavaScript 文件，即可使用 SDK 的各项功能。
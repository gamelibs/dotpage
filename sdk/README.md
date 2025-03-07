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


/////////////////游戏调用代码/////////////////////
//
```
  根据URL参数控制游戏功能
/**
 * 根据URL参数控制游戏功能
 * typeof OVO !="undefine" && OVO.isDot; // 上报
 *
 * typeof OVO !="undefine" && OVO.isDot && !OVO.SoundManager.isSound; // 声音
 *
 * typeof OVO !="undefine" && OVO.isDot && !OVO.AdManager.isAds; // 广告
 * 
 * 关卡
 * typeof OVO!='undefined' && OVO.isDot && OVO.ReportManager.reportLevelProgress(level_number, progress) 
 * 分数,金币
 * typeof OVO!='undefined' && OVO.isDot && OVO.ReportManager.reportGameScore(100)
 */
```
// 

<div id="adcontent">
<script>
        const adContentDiv = document.querySelector("#adcontent");

      // 检查元素是否存在
      if (adContentDiv) {
          // 设置元素的样式
          adContentDiv.style.width = "100%";
          adContentDiv.style.height = "100%";
          adContentDiv.style.position = "fixed";
          adContentDiv.style.zIndex = 1;
      } else {
          console.error("未找到具有 id 为 'adcontent' 的元素。");
      }           
</script>

...游戏内容

# sdk使用示例
```
// // 动态加载外部脚本的方法
function loadScript(url, type = "module") {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.type = type;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
    });
}
loadScript("http://localhost:13260/sdk/src/init.js")
    .then(() => {
        
        window.__woso = OVO.deepCopy(OVO);
    })
    .then(() => {
      //处理游戏进程
    })
    .catch((err) => {
        console.error("Error during initialization:", err);
    });
```
# // 深度合并
window.__woso = deepMerge({}, window.top__woso, window.__woso);
# SmartProfits Management System PWA

智能利润管理系统 - 一个功能完整的库存和财务管理PWA应用

## 🚀 功能特性

- 📱 **PWA支持** - 可安装到桌面和移动设备
- 🔄 **离线功能** - 支持离线使用，自动缓存重要资源
- 📊 **库存管理** - 完整的库存增减、查询功能
- 💰 **财务管理** - 交易记录、利润分析
- 📈 **数据可视化** - 图表展示业务数据
- 🔐 **用户权限** - 多级用户权限管理
- 📱 **响应式设计** - 完美适配各种设备

## 🛠 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **数据库**: Firebase Realtime Database
- **认证**: Firebase Authentication
- **PWA**: Service Worker, Web App Manifest
- **图表**: Chart.js
- **PDF生成**: jsPDF

## 📦 部署到GitHub Pages

### 1. 创建GitHub仓库

```bash
# 在GitHub上创建新仓库，然后克隆到本地
git clone https://github.com/你的用户名/你的仓库名.git
cd 你的仓库名

# 将项目文件复制到仓库目录
# 确保包含以下文件：
# - index.html
# - manifest.json
# - sw.js
# - stock.png
# - README.md
```

### 2. 推送代码到GitHub

```bash
git add .
git commit -m "Initial commit: PWA SmartProfits Management System"
git push origin main
```

### 3. 启用GitHub Pages

1. 进入你的GitHub仓库页面
2. 点击 **Settings** 标签
3. 滚动到 **Pages** 部分
4. 在 **Source** 下选择 **Deploy from a branch**
5. 选择 **main** 分支和 **/ (root)** 文件夹
6. 点击 **Save**

### 4. 访问你的PWA

几分钟后，你的应用将在以下地址可用：
```
https://你的用户名.github.io/你的仓库名/
```

## 🔧 PWA功能说明

### 安装应用
- 在支持的浏览器中访问应用
- 点击右下角的"安装应用"按钮
- 或使用浏览器的安装提示

### 离线使用
- 应用会自动缓存重要资源
- 离线时仍可查看已缓存的数据
- 网络恢复时会自动同步

### 推送通知
- 支持Web推送通知（需要用户授权）
- 可接收重要业务提醒

## 🎨 自定义配置

### 修改应用图标
替换 `stock.png` 文件为你的自定义图标（建议512x512像素）

### 修改应用信息
编辑 `manifest.json` 文件：
```json
{
  "name": "你的应用名称",
  "short_name": "短名称",
  "description": "应用描述",
  "theme_color": "#你的主题色",
  "background_color": "#你的背景色"
}
```

### Firebase配置
在 `index.html` 中找到Firebase配置部分，替换为你的Firebase项目配置：
```javascript
const firebaseConfig = {
  apiKey: "你的API密钥",
  authDomain: "你的项目.firebaseapp.com",
  databaseURL: "你的数据库URL",
  projectId: "你的项目ID",
  // ... 其他配置
};
```

## 📱 移动端优化

- 响应式设计，完美适配手机和平板
- 触摸友好的界面元素
- 移动端专用的卡片布局
- 手势支持和触摸反馈

## 🔒 安全特性

- Firebase身份验证
- 用户权限分级管理
- 数据传输加密
- 安全的API调用

## 🐛 故障排除

### Service Worker问题
如果PWA功能不正常，请：
1. 清除浏览器缓存
2. 检查浏览器控制台错误
3. 确保HTTPS访问（GitHub Pages自动提供）

### 安装问题
如果无法安装PWA：
1. 确保使用支持PWA的浏览器
2. 检查manifest.json文件格式
3. 验证所有图标文件存在

## 📞 支持

如有问题或建议，请联系开发者Mark。

## 📄 许可证

本项目采用MIT许可证。

---

**享受使用SmartProfits管理系统！** 🎉 
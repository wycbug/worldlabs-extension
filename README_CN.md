# Marble WorldLabs 扩展程序

这是一个为 Marble WorldLabs 网站设计的浏览器扩展程序，可以在侧边栏中显示生成的 3D 世界的详细信息，包括提示词、图片和可下载的资源文件。

## 项目管理

**⚠️ 重要提示**: 此项目使用 **Bun** 作为包管理器和运行时进行管理。所有命令都应使用 `bun` 而不是 `npm`。

### 系统要求

- **Bun**: v1.3.1 或更高版本（参见 `.bun-version` 文件）
- **Node.js**: 与 WXT 框架要求兼容的版本
- **Chrome/Chromium**: 用于扩展程序开发和测试

### 为什么选择 Bun？

- **更快的安装速度**: 比 npm 快 20 倍
- **减少磁盘空间占用**: 单一二进制文件，内置包管理器
- **TypeScript 支持**: 内置 TypeScript 编译
- **现代 JavaScript**: 原生支持最新的 ES 特性

## 功能特性

- **🌍 国际化**: 支持英语和简体中文
- **📋 世界详情侧边栏**: 显示 3D 世界的全面信息
- **📝 提示词复制**: 一键复制世界生成提示词
- **🖼️ 图片下载**: 下载用于生成的输入图片
- **📦 资源下载**: 下载不同质量的 3D 模型文件
- **🎨 现代化界面**: 干净、响应式设计，带有流畅动画
- **🚀 性能优化**: 快速加载，最小资源占用

## 工作原理

1. **自动检测**: 扩展程序自动检测您何时在 Marble WorldLabs 世界页面上
2. **数据提取**: 从 URL 中提取世界 ID，并从 WorldLabs API 获取详细数据
3. **交互式侧边栏**: 在滑出式侧边栏中显示全面的世界信息

## 安装说明

### 开发环境

1. 克隆此仓库
2. 安装依赖：
   ```bash
   bun install
   ```
3. 启动开发服务器：
   ```bash
   bun run dev
   ```
4. 在浏览器中加载扩展程序：
   - Chrome: 前往 `chrome://extensions/`，启用开发者模式，点击"加载已解压的扩展程序"
   - 选择 `dist/chrome-mv3` 文件夹

### 生产构建

1. 构建扩展程序：
   ```bash
   bun run build
   ```
2. 从 `dist/chrome-mv3` 文件夹加载构建的扩展程序

### 可用脚本

- `bun run dev` - 启动带热重载的开发服务器
- `bun run build` - 构建生产版本
- `bun run compile` - 类型检查但不构建
- `bun run zip` - 创建分发包 ZIP 文件

## 使用方法

1. 导航到任何 Marble WorldLabs 世界页面（例如 `https://marble.worldlabs.ai/world/[world-id]`）
2. 点击右上角的蓝色 📋 按钮
3. 在侧边栏中查看世界详情：
   - **标题和创建者**: 世界名称和作者信息
   - **统计数据**: 点赞数和参与度指标
   - **提示词**: 带复制功能的完整文本提示词
   - **输入图片**: 用于生成的参考图片
   - **模型**: 使用的 AI 模型版本
   - **导出文件**: 下载各种质量的 3D 模型

### SPA 导航支持

扩展程序自动检测您在 Marble WorldLabs 网站上不同世界之间的导航，无需页面刷新。当您执行以下操作时，浮动按钮和数据会自动更新：

- 点击不同的世界链接
- 使用浏览器前进/后退按钮
- 通过网站的单页应用程序进行导航

**智能侧边栏更新**: 如果您在浏览不同世界时保持侧边栏打开，它会自动刷新以显示新世界的数据，并提供加载指示器，提供无缝的浏览体验。

扩展程序实时监控 URL 变化，并为您访问的每个世界获取最新数据。

## 支持的语言

- **English** (默认)
- **简体中文** (Simplified Chinese)

扩展程序会自动检测您的浏览器语言并显示相应的翻译。

## 技术详情

- **框架**: 使用 WXT 框架构建浏览器扩展程序
- **前端**: React with TypeScript
- **样式**: 自定义 CSS，使用 WXT 的自动 CSS 注入
- **API 集成**: 从 `https://marble2-kgw-prod-iac1.wlt-ai.art/api/v1/worlds/` 获取数据
- **权限**: 仅需要访问 marble.worldlabs.ai 域名的权限

## 开发

扩展程序包含以下组件：

- `entrypoints/content.ts`: 注入 UI 和处理数据获取的主要内容脚本
- `entrypoints/style.css`: 现代化界面的自定义样式（由 WXT 自动注入）
- `locales/en.yml`: 英文翻译
- `locales/zh_CN.yml`: 简体中文翻译
- `wxt.config.ts`: 带有 i18n 模块的 WXT 配置

### 添加新语言

1. 在 `locales/` 目录中创建新的 YAML 文件（例如法语使用 `fr.yml`）
2. 添加英文文件中的所有必需翻译键
3. 重新构建扩展程序：`bun run build`

### 翻译键

所有 UI 文本都已外部化到翻译文件：
- 扩展程序元数据：`extName`、`extDescription`
- UI 元素：`worldDetails`、`stats`、`prompt` 等
- 用户消息：`loadingWorldData`、`copied`、`failedToLoadWorldData`
- 动态内容：`likes`、`by`、`downloadQuality`（带占位符）

## 许可证

MIT 许可证
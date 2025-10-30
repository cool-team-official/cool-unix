<div align="center">
  
# 🚀 Cool Unix

**基于 uni-app x 的跨端应用开发脚手架**

_一次开发，全端运行 - 为您的创新想法提供最强大的技术底座_

[![GitHub license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/cool-team-official/cool-unix/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/package-json/v/cool-team-official/cool-unix?style=flat-square&color=blue)](https://github.com/cool-team-official/cool-unix/releases)
[![GitHub stars](https://img.shields.io/github/stars/cool-team-official/cool-unix?style=flat-square&color=yellow)](https://github.com/cool-team-official/cool-unix/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/cool-team-official/cool-unix?style=flat-square&color=orange)](https://github.com/cool-team-official/cool-unix/network)
[![Last commit](https://img.shields.io/github/last-commit/cool-team-official/cool-unix?style=flat-square&color=red)](https://github.com/cool-team-official/cool-unix/commits)

</div>

### 项目概述

Cool Unix 是一个高效的项目脚手架。它内置了 UI 组件库、Service 请求、TailwindCSS 插件、多语言一键翻译等多种实用功能，极大提升了开发者的开发效率与体验。

- [📖 在线文档](https://unix.cool-js.com/)

- [🎯 快速开始](https://unix.cool-js.com/src/introduce/quick.html)

- [🌟 在线预览](https://unix.cool-js.com/demo)

### 组件库引入

如果你只需使用组件库，请参考 [🚀 组件库引入指南](https://unix.cool-js.com/src/introduce/uni-components.html) 进行配置，快速集成到你的项目中。

### 多语言

配置完成后，仅需执行一条命令，AI 即可自动检索并统一翻译全文内容，无需手动维护繁琐的中英对照表，大幅提升多语言开发效率。

```html
<text>{{ t('你好') }}</text>
```

在其他位置上绑定如下：

```html
<script setup lang="ts">
	import { $t, t } from "@/uni_modules/cool-ui";
	import { useUi } from "@/uni_modules/cool-ui";

	const ui = useUi();

	ui.showToast({
		message: t("操作成功")
	});

	ui.showToast({
		message: $t("欢迎回来，{name}", { name: "神仙都没用" })
	});
</script>
```

```shell
npx cool-i18n create
```

### TailwindCSS

不同于其他 UI 组件库仅内置简单样式，Cool Unix 深度兼容 TailwindCSS 的写法，支持如 `dark:`、`!` 等操作符，既保留了灵活性，也便于扩展。

```html
<view class="bg-surface-100 dark:!bg-surface-900">
	<text class="text-surface-700 dark:!text-white">Cool Unix</text>
</view>
```

### PassThrough

PassThrough 是一种用于访问组件内部 DOM 结构的 API，它允许开发者将任意属性和监听器直接应用于组件内部的 DOM 元素。这种设计的核心优势在于突破了组件主要 API 的限制，提供更灵活的定制能力。

```html
<cl-button
	:pt="{
    className: '!rounded-2xl',
    icon: {
      size: 50,
      className: 'mr-5',
    },
    label: {
      color: 'red',
      className: 'font-bold',
    },
    loading: {
      size: 50,
    },
  }"
>
	点击
</cl-button>
```

### 预览

<table>
  <tr>
    <td align="center">
      <img src="https://unix.cool-js.com/qrcode-h5.png" width="200px" /><br/>
      H5 预览
    </td>
    <td align="center">
      <img src="https://unix.cool-js.com/qrcode-apk.png" width="200px" /><br/>
      APP 下载
    </td>
  </tr>
</table>

### 技术栈

<div align="center">

### 核心框架

![uni-app x](https://img.shields.io/badge/uni--app%20x-2CA5E0?style=for-the-badge&logo=vue.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue%203-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### UI & 样式

![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Cool UI](https://img.shields.io/badge/Cool%20UI-FF6B6B?style=for-the-badge&logo=componentstore&logoColor=white)

### 开发工具

![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

</div>

### Star History

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=cool-team-official/cool-unix&type=Date)](https://star-history.com/#cool-team-official/cool-unix&Date)

</div>

### 参与贡献

我们欢迎所有形式的贡献，无论是新功能、Bug 修复、文档改进还是其他任何改进。

### 开源协议

本项目基于 [MIT 协议](LICENSE) 开源，您可以自由使用、修改和分发。

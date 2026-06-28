# Base UI × Tailwind CSS 协作规范

## 原则

- **Base UI (`@base-ui/react`)** 只负责行为逻辑与无障碍（a11y），**不提供任何样式**。
- **全部视觉样式由 Tailwind CSS utility class 提供**，无 CSS-in-JS 引擎，无 preflight 冲突。
- 组件写法：`<Input className="..." />`，Base UI 的 className 直接映射到 DOM 根元素。

## 基础样式封装

为保持一致性，以下定义一组可复用的 Tailwind class 组合，用于所有页面。

### 按钮 (Button)

| 变体 | Class |
|------|-------|
| 主要按钮 (Primary) | `btn-primary` — `inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors` |
| 次要按钮 (Secondary) | `btn-secondary` — `inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors` |
| 危险按钮 (Danger) | `btn-danger` — `inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors` |
| 文字按钮 (Ghost) | `btn-ghost` — `inline-flex items-center justify-center px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors` |

### 输入框 (Input)

| 状态 | Class |
|------|-------|
| 默认 | `input-field` — `block w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow` |
| 错误 | `input-error` — `block w-full px-3 py-2 rounded-lg border border-red-500 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow` |
| 禁用 | — `block w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed` |

### 卡片 (Card)

| 用途 | Class |
|------|-------|
| 通用卡片 | `card` — `bg-white rounded-xl shadow-sm border border-gray-200 p-6` |
| 紧凑卡片 | `card-compact` — `bg-white rounded-lg shadow-sm border border-gray-200 p-4` |
| 悬浮效果 | — `hover:shadow-md transition-shadow` |

### 表单布局

```html
<div class="space-y-4">          <!-- 表单字段间距 -->
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
    <input class="input-field" />
    <p class="mt-1 text-sm text-red-500">错误提示</p>
  </div>
</div>
```

### 页面布局

```html
<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b border-gray-200">...</header>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">...</main>
</div>
```

### 加载 / 错误 / 空态 (三态)

| 状态 | Class |
|------|-------|
| 加载中 | `flex items-center justify-center py-12 text-gray-400` |
| 错误 | `flex items-center justify-center py-12 text-red-500` |
| 空态 | `flex flex-col items-center justify-center py-12 text-gray-400` |

## 导入规范

```tsx
// Base UI 子路径导入，不引入根模块
import { Button } from '@base-ui/react/button'
import { Input } from '@base-ui/react/input'
import { Select } from '@base-ui/react/select'
import { Popover } from '@base-ui/react/popover'
```

## 注意事项

1. 所有 Base UI 组件均使用 `className` 传 Tailwind class，不使用 `style` 或 `css` prop。
2. 避免在 Tailwind 中覆盖 Base UI 的 `aria-*` 属性选择器——Base UI 的无障碍属性保持默认。
3. 公共样式 class 优先在 tailwind.config 的 `theme.extend` 中定义，不写全局 CSS。

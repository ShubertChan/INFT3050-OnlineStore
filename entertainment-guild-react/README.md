# Wukong — React 版

这是把原来用「原生 JavaScript」写的单页网站，整体改写成 **React + Vite** 之后的版本。
界面、配色、所有页面与原版保持一致，区别在于底层换成了 React 框架。

## 本次更新
- 商店更名为 **Wukong**，并新增一个悟空(美猴王)主题的 logo（顶栏和后台侧边栏都会显示）。
- 所有可交互按钮加入统一的交互反馈：**鼠标悬浮时放大并变色，点击时再次变色**。
- logo 同时作为网站图标(favicon)：`public/wukong-logo.svg`。

## 技术栈
- **React 18** — 组件化界面（每个页面、每个布局都是一个组件）
- **Vite** — 开发服务器 + 打包构建
- **react-router-dom** — 路由（用 HashRouter，URL 形如 `#/home`，和原版一致，任意静态服务器都能直接跑）
- **React Context** — 全局状态：登录状态、购物车、提示弹窗（原来写在 state.js 里的逻辑搬到了这里）

## 如何运行
需要先装好 Node.js（建议 18 或更高版本）。

```bash
npm install      # 第一次运行，安装依赖
npm run dev      # 启动开发服务器，终端会显示一个本地网址（默认 http://localhost:5173）
```

打包成静态文件（部署用）：

```bash
npm run build    # 产物输出到 dist/ 目录
npm run preview  # 本地预览打包后的结果
```

## 目录结构
```
src/
├── main.jsx              入口文件
├── App.jsx               路由表（所有页面的地址在这里登记）
├── index.css            全局样式（原 ui.js 里的 sharedStyles）
├── data.js              商品 / 订单 / 用户等静态数据 + 工具函数
├── useTitle.js          设置网页标题的小 hook
├── store/               全局状态
│   ├── AuthContext.jsx     登录状态（useAuth）
│   ├── CartContext.jsx     购物车（useCart）
│   ├── ToastContext.jsx    右下角提示弹窗（useToast）
│   └── feedback.js         联系表单数据存取
├── components/          可复用的布局组件
│   ├── CustomerShell.jsx   顾客端外壳（顶栏 + 导航）
│   ├── AdminShell.jsx      管理员端外壳（侧边栏）
│   ├── AccountMenu.jsx     账户中心侧边菜单
│   └── Cover.jsx           商品封面方块
└── pages/               17 个页面，每个对应一个网址
    ├── Home / Search / ProductDetail / Cart / Payment
    ├── LoginSelect / Login / Register / Forgot / AdminLogin
    ├── Contact
    ├── AccountOverview / Address / Password
    └── AdminDashboard / AdminProducts / AdminUsers
```

## 测试账号
- 管理员登录页（先点右上角 Log In → 选 Administrator）：邮箱 `admin@example.com`
- 顾客登录页：任意邮箱都能登录（演示用，没有真实数据库校验）

## 说明
- 登录、注册、地址、改密码这些表单是演示性质，除了**购物车**和**联系表单**会存进浏览器
  localStorage 之外，其它表单不连后端、不持久化。
- 管理员页面目前没有「路由守卫」——也就是直接在地址栏输入 `#/admin` 也能进。
  如果作业要求未登录管理员不能访问，可以再加一层保护，告诉我即可。
- 后台仪表盘的统计数字（248、1206 等）是占位示例数据。

# JobHunter Frontend

Ứng dụng tìm việc làm JobHunter - Frontend phát triển bằng React + TypeScript + Vite với Ant Design

## 📋 Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Tính năng](#tính-năng)
-   [Công nghệ sử dụng](#công-nghệ-sử-dụng)
-   [Cài đặt](#cài-đặt)
-   [Sử dụng](#sử-dụng)
-   [Cấu trúc thư mục](#cấu-trúc-thư-mục)
-   [Scripts](#scripts)
-   [Môi trường](#môi-trường)
-   [Đóng góp](#đóng-góp)

## 🚀 Giới thiệu

JobHunter là một platform tìm việc làm hiện đại, kết nối giữa ứng viên và nhà tuyển dụng. Ứng dụng cung cấp giao diện người dùng thân thiện với các tính năng quản lý công việc, hồ sơ ứng viên và quy trình tuyển dụng.

## ✨ Tính năng

### Dành cho Ứng viên

-   🔍 Tìm kiếm và lọc công việc theo nhiều tiêu chí
-   📝 Tạo và quản lý hồ sơ cá nhân
-   💼 Ứng tuyển và theo dõi trạng thái đơn ứng tuyển
-   ⭐ Lưu công việc yêu thích
-   👥 Theo dõi nhà tuyển dụng
-   📧 Đăng ký nhận thông báo việc làm qua email
-   📊 Xem thống kê ứng tuyển

### Dành cho Nhà tuyển dụng

-   🏢 Tạo và quản lý hồ sơ công ty
-   📋 Đăng tuyển và quản lý tin tuyển dụng
-   👤 Xem và quản lý hồ sơ ứng viên
-   📈 Theo dõi thống kê tuyển dụng
-   💬 Liên hệ với ứng viên

### Dành cho Admin

-   🎛️ Dashboard quản trị với biểu đồ thống kê
-   👥 Quản lý người dùng (ứng viên, nhà tuyển dụng)
-   💼 Quản lý công việc và ứng tuyển
-   🏷️ Quản lý ngành nghề và kỹ năng
-   🔐 Quản lý vai trò và quyền hạn
-   📊 Báo cáo và phân tích

## 🛠️ Công nghệ sử dụng

### Core Technologies

-   **React 18** - Library JavaScript cho UI
-   **TypeScript** - Typed JavaScript
-   **Vite** - Build tool và dev server
-   **React Router DOM** - Routing

### UI & Styling

-   **Ant Design** - Component library
-   **Ant Design Pro Components** - Advanced components
-   **SASS/SCSS** - CSS preprocessor
-   **React Icons** - Icon library
-   **Motion** - Animation library

### State Management

-   **Redux Toolkit** - State management
-   **React Redux** - React bindings for Redux

### HTTP & API

-   **Axios** - HTTP client
-   **React Query** (thông qua RTK Query) - Server state management

### Charts & Visualization

-   **ECharts** - Chart library
-   **React ApexCharts** - Chart components
-   **React CountUp** - Number animation

### Internationalization

-   **i18next** - Internationalization framework
-   **React i18next** - React bindings

### Editor & Rich Text

-   **Lexical** - Rich text editor framework
-   **React Quill** - Quill editor for React

### Utilities

-   **Day.js** - Date manipulation
-   **Lodash** - Utility library
-   **UUID** - Unique identifier generation
-   **Query String** - URL query parsing
-   **HTML React Parser** - HTML parsing

### Development Tools

-   **ESLint** - Code linting
-   **TypeScript ESLint** - TypeScript-specific linting

## 📦 Cài đặt

### Yêu cầu hệ thống

-   Node.js 16+
-   npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone https://github.com/MinhDat1312/jobhunter_fe.git
cd jobhunter_fe
```

### Bước 2: Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### Bước 3: Cấu hình môi trường

Tạo file `.env` từ `.env.example` và cấu hình các biến môi trường:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=JobHunter
```

## 🚀 Sử dụng

### Development

```bash
npm run dev
# hoặc
npm start
```

Ứng dụng sẽ chạy trên `http://localhost:5173`

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Cấu trúc thư mục

```
jobhunter_fe/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, fonts, etc.
│   │   └── images/
│   ├── components/             # React components
│   │   ├── admin/              # Admin-specific components
│   │   │   ├── applicant/
│   │   │   ├── application/
│   │   │   ├── career/
│   │   │   ├── job/
│   │   │   ├── permission/
│   │   │   ├── recruiter/
│   │   │   ├── role/
│   │   │   └── skill/
│   │   ├── client/             # Client-facing components
│   │   │   ├── card/
│   │   │   ├── form/
│   │   │   ├── modal/
│   │   │   └── tab/
│   │   └── share/              # Shared components
│   │       └── protected-route/
│   ├── config/                 # Configuration files
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page components
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── job/
│   │   └── recruiter/
│   ├── redux/                  # Redux store and slices
│   │   └── slice/
│   ├── styles/                 # Global styles and SCSS modules
│   └── types/                  # TypeScript type definitions
├── eslint.config.js            # ESLint configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # Documentation
```

### Mô tả các thư mục chính

-   **`components/`**: Chứa tất cả React components
    -   `admin/`: Components cho trang quản trị
    -   `client/`: Components cho trang người dùng
    -   `share/`: Components dùng chung
-   **`pages/`**: Các page components chính
-   **`redux/`**: Quản lý state với Redux Toolkit
-   **`hooks/`**: Custom hooks tái sử dụng
-   **`config/`**: Cấu hình API, axios, i18n, utilities
-   **`types/`**: TypeScript type definitions
-   **`styles/`**: SCSS modules và global styles

## 📝 Scripts

| Script            | Mô tả                    |
| ----------------- | ------------------------ |
| `npm run dev`     | Chạy development server  |
| `npm start`       | Alias cho `npm run dev`  |
| `npm run build`   | Build production         |
| `npm run preview` | Preview production build |
| `npm run lint`    | Chạy ESLint              |

## 🔧 Cấu hình

### Environment Variables

```env
VITE_API_URL=http://localhost:8080    # Backend API URL
VITE_APP_NAME=JobHunter               # Application name
```

### Vite Configuration

Project sử dụng Vite với cấu hình cơ bản trong `vite.config.ts`

### TypeScript Configuration

-   `tsconfig.json`: Cấu hình TypeScript chính
-   `tsconfig.app.json`: Cấu hình cho app
-   `tsconfig.node.json`: Cấu hình cho Node.js

## 🌐 Môi trường

### Development

-   URL: `http://localhost:5173`
-   Hot reload: Enabled
-   Source maps: Enabled

### Production

-   Optimized build với tree shaking
-   Minified assets
-   Lazy loading routes

## 🎨 UI/UX Features

-   **Responsive Design**: Hỗ trợ tất cả các thiết bị
-   **Internationalization**: Đa ngôn ngữ (Tiếng Việt, English)
-   **Loading States**: Skeleton loading và spinners
-   **Error Boundaries**: Xử lý lỗi graceful
-   **Accessibility**: WCAG compliant

## 🔒 Authentication & Authorization

-   JWT-based authentication
-   Role-based access control (RBAC)
-   Protected routes
-   Automatic token refresh

## 📊 State Management

### Redux Slices

-   `accountSlice`: Quản lý thông tin tài khoản
-   `applicantSlice`: Quản lý ứng viên
-   `applicationSlice`: Quản lý đơn ứng tuyển
-   `careerSlice`: Quản lý ngành nghề
-   `jobSlice`: Quản lý công việc
-   `permissionSlice`: Quản lý quyền hạn
-   `recruiterSlice`: Quản lý nhà tuyển dụng
-   `roleSlice`: Quản lý vai trò
-   `skillSlice`: Quản lý kỹ năng

## 🐛 Debugging

### Development Tools

-   React DevTools
-   Redux DevTools
-   Vite DevTools

### Common Issues

1. **CORS errors**: Kiểm tra backend CORS configuration
2. **Build errors**: Kiểm tra TypeScript types
3. **404 on refresh**: Cấu hình server để serve index.html

## 🚀 Deployment

### Build

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Deploy to traditional hosting

1. Build project: `npm run build`
2. Upload `dist/` folder contents
3. Configure server to serve `index.html` for all routes

### Coding Standards

-   Sử dụng TypeScript strict mode
-   Follow ESLint rules
-   Component naming: PascalCase
-   File naming: kebab-case hoặc camelCase
-   CSS class naming: BEM methodology

## 📞 Liên hệ

-   **Developer**: MinhDat1312
-   **Repository**: [https://github.com/MinhDat1312/jobhunter_fe](https://github.com/MinhDat1312/jobhunter_fe)

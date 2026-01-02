# 🚀 Zenith Task Management System - Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)

**A modern, responsive, and interactive Task Management Client built with React 19 & TypeScript.**

[Live Demo](#) • [Documentation](DOCUMENTATION.md) • [Report Bug](CONTRIBUTING.md) • [Request Feature](CONTRIBUTING.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Scripts](#-scripts)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Contact](#-contact)

---

## 🎯 Overview

The **Zenith Frontend** is the user interface for the Zenith Task Management System. It is designed to be **fast, intuitive, and accessible**. Built as a Single Page Application (SPA), it leverages the latest web technologies to provide a seamless experience similar to native desktop applications.

### 🌟 Key Highlights
- **Optimistic UI Updates**: Drag and drop tasks without waiting for server confirmation.
- **Real-time Collaboration**: See updates from team members instantly via SignalR.
- **Responsive Design**: Works perfectly on Desktops, Tablets, and Mobile devices.
- **Type Safety**: Fully typed with TypeScript for robust code quality.

---

## ✨ Features

### 🔐 Authentication
- **Secure Login & Registration** with JWT handling.
- **Email Verification** flow pages.
- **Protected Routes** ensuring unauthorized access is blocked.

### 📊 Dashboard
- **Interactive Charts** (Recharts) showing task completion rates.
- **Summary Cards** for quick project overview.
- **Personalized Greeting** and daily focus summary.

### 📁 Project & Task Management
- **Kanban Board**: Interactive Drag & Drop interface (using `@dnd-kit`).
- **List View**: Sortable and filterable task lists.
- **Task Details Modal**:
    - **Checklists**: Add sub-tasks and track progress.
    - **Attachments**: Upload and preview files.
    - **Comments**: Discuss tasks with your team.
    - **Time Tracking**: Start/stop timers on tasks.
    - **Dependencies**: Link tasks to one another.

### 🔔 Notifications
- **Real-time Alerts**: Toast notifications for assignments and updates.
- **Notification Center**: View history of important events.

---

## 🛠 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core** | [React 19](https://react.dev/) | The library for web and native user interfaces. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strongly typed programming language. |
| **Build Tool** | [Vite](https://vitejs.dev/) | Next Generation Frontend Tooling. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | A utility-first CSS framework. |
| **UI Components** | [Headless UI](https://headlessui.com/) | Unstyled, fully accessible UI components. |
| **State Mgmt** | [Zustand](https://github.com/pmndrs/zustand) | A small, fast and scalable bearbones state-management solution. |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query) | Powerful asynchronous state management. |
| **Forms** | [React Hook Form](https://react-hook-form.com/) | Performant, flexible and extensible forms. |
| **Validation** | [Zod](https://zod.dev/) | TypeScript-first schema declaration and validation. |
| **Real-time** | [SignalR Client](https://www.npmjs.com/package/@microsoft/signalr) | Real-time web functionality. |
| **Icons** | [Lucide React](https://lucide.dev/) | Beautiful & consistent icons. |

---

## 📂 Project Structure

A clearly organized codebase ensures maintainability and scalability.

```bash
src/
├── assets/             # Static assets (images, fonts, global css)
├── components/         # Reusable UI components
│   ├── ui/             # Generic UI elements (Button, Input, Modal)
│   └── feature/        # Feature-specific components (TaskCard, ProjectList)
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts (Sidebar, Header)
├── lib/                # Utility libraries and configurations (Axios, Utils)
├── pages/              # Route components
├── services/           # API service layer (Auth, Projects, Tasks)
├── store/              # Global state stores (Zustand)
├── types/              # TypeScript interface definitions
└── App.tsx             # Main application entry
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muhamedessamz/Zenith-Frontend.git
   cd Zenith-Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` to point to your backend (e.g., `http://localhost:5287/api`).

4. **Run Development Server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server with HMR. |
| `npm run build` | Build for production. |
| `npm run preview` | Preview production build locally. |
| `npm run lint` | Run ESLint check. |

---

## 🔒 Security

- **JWT Interceptor**: Automatically attaches `Authorization` headers to requests.
- **XSS Protection**: React automatically escapes content.
- **Route Guards**: `ProtectedRoute` component matches user session validity before rendering private pages.

---

## 🚢 Deployment

For detailed deployment instructions, please read [DEPLOYMENT.md](DEPLOYMENT.md).

Quick Build:
```bash
npm run build
```
Upload the `dist` folder to your static hosting provider (Netlify, Vercel, IIS).

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started, our code of conduct, and submission guidelines.

---

## 📞 Contact

If you have any questions, feel free to reach out:

- **Maintainer**: [Mohamed Essam](https://www.linkedin.com/in/mohamedessamz/)
- **GitHub**: [muhamedessamz](https://github.com/muhamedessamz)

---

<div align="center">

**Made with ❤️ by Mohamed Essam**

</div>

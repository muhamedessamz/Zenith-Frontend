# 🤝 Contributing to Zenith Task Management Frontend

First off, thank you for considering contributing to the Zenith Task Management Frontend! It's people like you that make this project better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and help them learn
- ✅ Focus on what is best for the community
- ✅ Show empathy towards other community members
- ❌ No harassment, trolling, or insulting comments
- ❌ No political or off-topic discussions

---

## 🚀 How Can I Contribute?

### 1. Reporting Bugs 🐛

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**
- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Browser and OS details
- Console errors (F12 > Console)

**Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - Browser: [e.g. Chrome 120]
 - OS: [e.g. Windows 11]
 - Screen Resolution: [e.g. 1920x1080]
```

### 2. Suggesting Features 💡

We love feature suggestions! Before creating a feature request:
- Check if the feature already exists
- Check if it's already been suggested
- Consider if it fits the project's scope

**Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or mockups about the feature request.
```

### 3. Code Contributions 💻

We welcome code contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Verify functionality**
5. **Commit your changes** (see [Commit Guidelines](#commit-guidelines))
6. **Push to your fork** (`git push origin feature/AmazingFeature`)
7. **Open a Pull Request**

---

## 🛠️ Development Setup

### Prerequisites

- Node.js > 18.0.0
- npm (comes with Node.js)
- Git
- VS Code (Recommended) with ESLint and Prettier extensions

### Setup Steps

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Zenith-Task-Management-Frontend.git
   cd Zenith-Task-Management-Frontend
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/muhamedessamz/Zenith-Task-Management-Frontend.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   ```bash
   # Linux/Mac
   cp .env.example .env
   
   # Windows
   copy .env.example .env
   ```
   Update `.env` with your API URLs if different from default.

5. **Run the application**
   ```bash
   npm run dev
   ```

---

## 📝 Coding Standards

### React & TypeScript Style Guide

We follow standard React best practices and Airbnb style guide where applicable.

#### Key Points:

1. **Naming Conventions**
   ```typescript
   // PascalCase for components, interfaces, types
   export const TaskCard = () => {}
   interface TaskProps {}
   
   // camelCase for variables, functions, hooks
   const [isLoading, setIsLoading] = useState(false);
   const handleSubmit = () => {};
   
   // UP_CASE for constants
   const MAX_RETRIES = 3;
   ```

2. **Component Structure**
   ```tsx
   // Imports
   import { useState } from 'react';
   import { useQuery } from '@tanstack/react-query';
   
   // Interfaces
   interface Props {
     title: string;
   }
   
   // Component
   export const MyComponent = ({ title }: Props) => {
     // Hooks
     const { data } = useQuery(...);
     
     // Handlers
     const handleClick = () => {};
     
     // Render
     return (
       <div onClick={handleClick}>
         {title}
       </div>
     );
   };
   ```

3. **State Management**
   - Use **local state** (`useState`) for UI-only state (modals, inputs).
   - Use **Zustand** for global client state (auth, theme).
   - Use **TanStack Query** for ALL server state (fetching data).

4. **Styling**
   - Use **Tailwind CSS** utility classes.
   - Avoid inline styles.
   - Use `clsx` or `tailwind-merge` for conditional classes.

### Folder Structure
```
src/
  components/    # Shared UI components
  pages/         # Route pages
  services/      # API calls
  store/         # Global state
  types/         # TS interfaces
  lib/           # Utilities
```

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semi colons, etc
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process, dependency updates

### Examples
```bash
git commit -m "feat(tasks): add drag and drop support"
git commit -m "fix(auth): fix login redirection loop"
git commit -m "style(navbar): update mobile menu padding"
```

---

## 🔄 Pull Request Process

1. ✅ Ensure your code follows the coding standards
2. ✅ Run `npm run lint` to check for errors
3. ✅ Check `npm run build` passes without errors
4. ✅ Update documentation if needed
5. ✅ Rebase on latest `main` branch
6. ✅ Ensure no merge conflicts

---

## 📞 Questions?

- Open a [Discussion](https://github.com/muhamedessamz/Zenith-Task-Management-API/discussions)
- LinkedIn: [Mohamed Essam](https://www.linkedin.com/in/mohamedessamz/)


---

<div align="center">

**Thank you for contributing! 🙏**

Every contribution, no matter how small, makes a difference.

</div>

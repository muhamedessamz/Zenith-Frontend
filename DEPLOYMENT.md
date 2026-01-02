# 🚀 Deployment Guide - Zenith Frontend

## 📋 Table of Contents
- [Before You Deploy](#before-you-deploy)
- [Build Process](#build-process)
- [Deployment Options](#deployment-options)
    - [Netlify / Vercel](#option-1-netlify--vercel-recommended)
    - [Docker / Nginx](#option-2-docker--nginx)
    - [Static Hosting (IIS/Apache)](#option-3-static-hosting-iisapache)
- [Environment Variables](#environment-variables)
- [Security Checklist](#security-checklist)

---

## 🔐 Before You Deploy

### ⚠️ IMPORTANT: Configure Environment Variables!

The frontend application requires specific environment variables to communicate with the backend API.
Ensure you have the correct production URLs for your API.

### Required Variables:
1. `VITE_API_BASE_URL` - The full URL to your backend API (e.g., `https://api.yourdomain.com/api`).
2. `VITE_SIGNALR_HUB_URL` - The URL to the SignalR hub (e.g., `https://api.yourdomain.com/hubs/notifications`).

---

## 🏗️ Build Process

The project uses **Vite** for building the production bundle.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Build Command
```bash
npm run build
```

This will create a `dist` folder containing:
- optimized `index.html`
- minified CSS and JavaScript assets in `dist/assets/`
- static files from public folder

### 3. Preview Production Build (Optional)
```bash
npm run preview
```
This serves the `dist` folder locally to verify everything works before uploading.

---

## 🌐 Deployment Options

### Option 1: Netlify / Vercel (Recommended) ⭐

These platforms are optimized for React SPA deployment.

1. **Push your code** to GitHub.
2. **Import project** in Netlify/Vercel.
3. **Configure Build Settings**:
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
4. **Environment Variables**:
    - Add `VITE_API_BASE_URL` and `VITE_SIGNALR_HUB_URL` in the project settings UI.
5. **Deploy**.

*Note: Add a `_redirects` file (Netlify) or `vercel.json` (Vercel) to handle client-side routing (redirect all to `/index.html`).*

**Example `_redirects` for Netlify (put in `public/`):**
```
/*  /index.html  200
```

---

### Option 2: Docker / Nginx

You can containerize the frontend using Nginx to serve the static files.

#### 1. Create `Dockerfile`
```dockerfile
# Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config to handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Create `nginx.conf`
```nginx
server {
    listen 80;
    
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. Build & Run
```bash
docker build -t zenith-frontend .
docker run -d -p 80:80 zenith-frontend
```

---

### Option 3: Static Hosting (IIS/Apache)

#### IIS (Windows Server)

1. **Install IIS URL Rewrite Module**.
2. **Copy contents of `dist/`** to `C:\inetpub\wwwroot\ZenithFrontend`.
3. **Create `web.config`** in the root of the site to handle client-side routing:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="React Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

---

## 🔑 Environment Variables

| Variable | Description | Example (Production) |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Application API endpoint | `https://api.zenithapp.com/api` |
| `VITE_SIGNALR_HUB_URL` | Real-time Hub endpoint | `https://api.zenithapp.com/hubs/notifications` |
| `VITE_APP_NAME` | Browser Tab Title | `Zenith` |
| `VITE_ENABLE_ANALYTICS` | Toggle analytics scripts | `true` |

---

## 🔒 Security Checklist

- [ ] ✅ **HTTPS is enabled**: Serve frontend over HTTPS to prevent mixed content errors with secure APIs.
- [ ] ✅ **Variables Checked**: Ensure production API URLs are correct.
- [ ] ✅ **No Secrets**: Ensure no private keys or secrets are accidentally committed or included in the frontend bundle (everything in frontend is public!).
- [ ] ✅ **Cache Control**: Configure cache headers for static assets (`Cache-Control: public, max-age=31536000, immutable`) and `index.html` (`no-cache`).

---

## 📞 Support

If the frontend fails to load:
1. Check browser console for errors (F12).
2. Verify network requests are hitting the correct API URL.
3. Check CORS settings on the backend (must allow your frontend domain).

---

<div align="center">

**Ready to ship! 🚀**

</div>

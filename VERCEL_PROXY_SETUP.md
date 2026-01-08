# Vercel Reverse Proxy Configuration

## Problem Solved
This configuration solves the **Mixed Content** error that occurs when an HTTPS frontend (deployed on Vercel) tries to make requests to an HTTP backend.

Browsers block HTTP requests from HTTPS pages for security reasons, causing errors like:
```
Mixed Content: The page at 'https://your-app.vercel.app' was loaded over HTTPS, 
but requested an insecure resource 'http://zenith.runasp.net/api/...'. 
This request has been blocked.
```

## Solution Overview
We've configured Vercel to act as a reverse proxy:
```
Frontend (HTTPS) → Vercel (HTTPS) → Backend (HTTP)
```

All API calls now go through Vercel's HTTPS connection, which then forwards them to your HTTP backend.

## Changes Made

### 1. Created `vercel.json`
This file configures Vercel's reverse proxy with two main sections:

#### Rewrites
- `/api/*` → forwards to `http://zenith.runasp.net/api/*`
- `/hubs/*` → forwards to `http://zenith.runasp.net/hubs/*` (for SignalR WebSockets)

#### Headers
Added CORS headers to ensure cross-origin requests work properly.

### 2. Updated `.env.production`
Changed from:
```env
VITE_API_URL=http://zenith.runasp.net
```

To:
```env
# Leave empty to use relative paths (proxied by Vercel)
VITE_API_URL=
```

When `VITE_API_URL` is empty, the app uses relative paths like `/api/Auth/login` instead of full URLs.

### 3. Updated API Configuration Files

#### `src/lib/axios.ts`
- Now uses `/api` as baseURL in production (when `VITE_API_URL` is empty)
- In development, still uses full localhost URL

#### `src/services/signalRService.ts`
- SignalR hub now connects to `/hubs/notifications` in production
- Vercel proxies WebSocket connections to the backend

#### `src/services/attachmentService.ts`
- File download URLs use relative paths in production
- Ensures file downloads work through the Vercel proxy

#### `src/store/authStore.ts`
- Profile picture URLs handled correctly in both environments
- In production, uses relative paths; in development, uses full URLs

## How It Works

### Development (localhost)
- `VITE_API_URL=http://localhost:5287/api` (from `.env`)
- Direct calls to your local backend
- Example: `http://localhost:5287/api/Auth/login`

### Production (Vercel)
- `VITE_API_URL=` (empty, from `.env.production`)
- Relative paths: `/api/Auth/login`
- Vercel intercepts and forwards to: `http://zenith.runasp.net/api/Auth/login`
- Browser only sees HTTPS requests to Vercel

## API Call Examples

### Before (Direct HTTP calls - BLOCKED by browser)
```javascript
// ❌ Mixed content error
fetch('http://zenith.runasp.net/api/Auth/login', {...})
```

### After (Proxied through Vercel)
```javascript
// ✅ Works! Browser sees HTTPS to Vercel
fetch('/api/Auth/login', {...})
// Vercel forwards to: http://zenith.runasp.net/api/Auth/login
```

## Deployment Instructions

### 1. Push Changes to Git
```bash
git add .
git commit -m "Configure Vercel reverse proxy for HTTP backend"
git push origin main
```

### 2. Deploy to Vercel
Vercel will automatically deploy when you push to your repository.

**Important:** Make sure your Vercel project is connected to your Git repository.

### 3. Verify Deployment
After deployment:
1. Open your Vercel app URL (e.g., `https://your-app.vercel.app`)
2. Open browser DevTools (F12) → Network tab
3. Try logging in or making API calls
4. You should see requests to `/api/*` (relative paths)
5. No mixed content errors should appear

## Testing Locally

To test the production build locally:

```bash
# Build the production version
npm run build

# Preview the production build
npm run preview
```

Note: The preview will still use development settings unless you temporarily rename `.env.production` to `.env`.

## Troubleshooting

### Issue: API calls still fail in production
**Solution:** Check that:
1. `vercel.json` is in the project root
2. `.env.production` has `VITE_API_URL=` (empty)
3. You've redeployed after making changes

### Issue: SignalR WebSocket connection fails
**Solution:** 
1. Verify `/hubs/*` rewrite is in `vercel.json`
2. Check that your backend supports WebSocket connections
3. Ensure your backend CORS settings allow Vercel's domain

### Issue: File downloads don't work
**Solution:**
1. Check that file paths from backend are relative (start with `/`)
2. Verify the attachment service is using the correct path logic

## Backend Requirements

Your backend (`http://zenith.runasp.net`) must:

1. **Accept requests from Vercel's IP addresses**
2. **Have CORS configured** to allow your Vercel domain:
   ```csharp
   // In your ASP.NET Core startup/program.cs
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowVercel", policy =>
       {
           policy.WithOrigins("https://your-app.vercel.app")
                 .AllowAnyMethod()
                 .AllowAnyHeader()
                 .AllowCredentials();
       });
   });
   ```

3. **Support WebSocket connections** for SignalR

## Security Notes

- ✅ All client-to-Vercel communication is HTTPS (secure)
- ⚠️ Vercel-to-backend communication is HTTP (insecure)
- 🔒 Consider upgrading your backend to HTTPS for end-to-end encryption

## Future Improvements

1. **Upgrade backend to HTTPS**: Use a free SSL certificate (Let's Encrypt)
2. **Use environment variables in Vercel**: Store backend URL in Vercel environment variables
3. **Add rate limiting**: Protect your API from abuse
4. **Monitor proxy performance**: Check Vercel analytics for latency

## Files Modified

- ✅ `vercel.json` (created)
- ✅ `.env.production` (updated)
- ✅ `src/lib/axios.ts` (updated)
- ✅ `src/services/signalRService.ts` (updated)
- ✅ `src/services/attachmentService.ts` (updated)
- ✅ `src/store/authStore.ts` (updated)

---

**Status:** ✅ Ready for deployment to Vercel

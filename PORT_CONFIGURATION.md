# Port Configuration Guide

This guide explains how to run the Barber Shop Admin Panel on any port and configure API connections.

## 🚀 Quick Start on Different Ports

### Method 1: Using npm scripts
```bash
# Run on port 3000 (default)
npm start

# Run on port 3001
npm run start:3001

# Run on port 3002
npm run start:3002

# Let React choose any available port
npm run start:any
```

### Method 2: Using environment variables
```bash
# Windows (PowerShell)
$env:PORT=3001; npm start

# Windows (Command Prompt)
set PORT=3001 && npm start

# macOS/Linux
PORT=3001 npm start
```

### Method 3: Modify .env file
Edit the `.env` file in the root directory:
```
PORT=3001
```
Then run `npm start`

## 🔧 API Configuration

The app automatically handles backend API connections through environment variables:

### Primary API (Local Development)
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Fallback API (Production/Remote)
```
REACT_APP_API_FALLBACK_URL=https://salonn-backend.onrender.com
```

## 🔄 Auto-Fallback System

The app includes an intelligent API fallback system:

1. **Primary Attempt**: Tries to connect to `REACT_APP_API_BASE_URL` (default: localhost:5000)
2. **Automatic Fallback**: If primary fails, automatically tries `REACT_APP_API_FALLBACK_URL`
3. **Error Handling**: Provides detailed error messages if both APIs fail

## 📝 Environment Variables

Create or modify `.env` file in the root directory:

```env
# Frontend port (optional - React will find available port if not set)
PORT=3000

# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_API_FALLBACK_URL=https://salonn-backend.onrender.com

# Dashboard refresh interval (milliseconds)
REACT_APP_REFRESH_INTERVAL=30000
```

## 🐛 Troubleshooting

### Port Already in Use
If you get "Port 3000 is already in use", React will automatically suggest the next available port (3001, 3002, etc.). Just press 'Y' to accept.

### API Connection Issues
Check the browser console for API connection logs:
- Green logs: Successful API connection
- Yellow warnings: Primary API failed, trying fallback
- Red errors: Both APIs failed

### Backend Not Running
If your local backend (port 5000) isn't running:
1. The app will automatically try the fallback API
2. Or start your backend server on port 5000
3. Or update `REACT_APP_API_BASE_URL` to point to your backend's actual port

## 🎯 Common Scenarios

### Scenario 1: Run frontend on 3001, backend on 5000
```bash
PORT=3001 npm start
```
No additional configuration needed - API will connect to localhost:5000

### Scenario 2: Run frontend on 3002, backend on 8080
1. Update `.env`:
   ```
   PORT=3002
   REACT_APP_API_BASE_URL=http://localhost:8080
   ```
2. Run: `npm start`

### Scenario 3: Use only remote API
1. Update `.env`:
   ```
   REACT_APP_API_BASE_URL=https://your-backend.com
   REACT_APP_API_FALLBACK_URL=https://backup-backend.com
   ```
2. Run on any port: `npm start`

## 🔍 Verification

After starting the app:
1. Check the browser console for API connection logs
2. Verify the dashboard loads data successfully
3. Test booking operations to confirm API connectivity

The app is now fully flexible and can run on any available port while maintaining proper API connections!

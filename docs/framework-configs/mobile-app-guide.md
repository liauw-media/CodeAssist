# Mobile App Development Guide

*Progressive Web Apps (PWA) with Next.js and Native Apps with React Native*

---

## Overview

This guide covers building mobile applications using two approaches:
1. **PWA (Progressive Web App)** - Web-based, installable, works offline
2. **React Native** - True native apps for iOS/Android

**Related Documents**:
- [JavaScript/TypeScript Setup](./javascript-setup-guide.md)
- [Laravel Setup](./laravel-setup-guide.md) (for backend API)
- [Project Use-Case Scenarios](../project-use-case-scenarios.md)

---

## Table of Contents

1. [Decision Matrix: PWA vs React Native](#decision-matrix-pwa-vs-react-native)
2. [Progressive Web Apps (PWA) with Next.js](#progressive-web-apps-pwa-with-nextjs)
3. [React Native Apps](#react-native-apps)
4. [Backend Integration](#backend-integration)
5. [Common Features](#common-features)
6. [Deployment](#deployment)

---

## Decision Matrix: PWA vs React Native

### Choose PWA When:
✅ Need **fast time to market** (single codebase = web + mobile)
✅ Budget-conscious (one team, one codebase)
✅ **Web-first** with mobile as bonus
✅ Don't need native device features (camera, contacts, etc.)
✅ Want **SEO** and web discoverability
✅ Targeting Android primarily (better PWA support)

### Choose React Native When:
✅ Need **true native performance**
✅ Require native device features (complex camera, Bluetooth, NFC)
✅ Building mobile-first / mobile-only app
✅ Need app store presence (marketing/discoverability)
✅ Targeting iOS users (better native experience)
✅ Complex offline functionality needed

### Hybrid Approach:
💡 **Build both**: Next.js web app + PWA + React Native app sharing same backend API

---

## Progressive Web Apps (PWA) with Next.js

### What is a PWA?

A PWA is a web app that:
- **Installs** on device home screen
- Works **offline** (service workers)
- Sends **push notifications**
- Feels like a native app
- Accessible via browser and as "app"

**Tech Stack**:
- **Framework**: Next.js 14+ (App Router)
- **PWA Plugin**: `next-pwa`
- **Backend**: Laravel/Express/FastAPI (API)
- **State**: React Query or Zustand
- **Auth**: NextAuth / Clerk / JWT

---

### Step 1: Create Next.js Project with PWA

**Installation**:
```bash
# Create Next.js project
npx create-next-app@latest my-pwa-app --typescript --tailwind --app
cd my-pwa-app

# Install PWA dependencies
npm install next-pwa
npm install @types/serviceworker --save-dev
```

---

### Step 2: Configure next-pwa

**File**: `next.config.js`

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable in dev for easier debugging
  buildExcludes: [/middleware-manifest\.json$/],
  scope: '/',
  sw: 'sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.yourdomain\.com\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 // 1 hour
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
```

---

### Step 3: Create Web App Manifest

**File**: `public/manifest.json`

```json
{
  "name": "My PWA App",
  "short_name": "MyApp",
  "description": "Amazing Progressive Web App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Generate icons**: Use https://www.pwabuilder.com/imageGenerator

---

### Step 4: Add Manifest to Layout

**File**: `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My PWA App',
  description: 'Amazing Progressive Web App',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'My PWA App',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### Step 5: Add Install Prompt

**File**: `components/InstallPrompt.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50">
      <p className="mb-2">Install this app on your device for a better experience!</p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Install
        </button>
        <button
          onClick={() => setShowInstall(false)}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
        >
          Later
        </button>
      </div>
    </div>
  );
}
```

**Use in layout**:
```typescript
import InstallPrompt from '@/components/InstallPrompt';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
```

---

### Step 6: Add Offline Support

**File**: `app/offline/page.tsx`

```typescript
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">You're Offline</h1>
        <p className="text-gray-600 mb-4">
          It looks like you've lost your internet connection.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

---

### Step 7: Push Notifications (Optional)

**File**: `lib/push-notifications.ts`

```typescript
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // Send subscription to your backend
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}
```

---

### PWA Testing Checklist

```bash
# Build for production
npm run build
npm start

# Test PWA features
✓ Install prompt appears
✓ App installs to home screen
✓ Offline page works (disconnect network)
✓ Service worker caches assets
✓ Push notifications (if implemented)

# Lighthouse PWA audit
# In Chrome DevTools > Lighthouse > Progressive Web App
# Score should be 90+
```

---

## React Native Apps

### Step 1: Choose Workflow

#### Option A: Expo (Recommended for most projects)

**Pros**:
- Fastest setup
- Built-in tooling (camera, location, notifications)
- Easy updates (OTA)
- Expo Go for instant testing

**Cons**:
- Larger app size
- Some limitations on native modules

**Best for**: MVPs, quick prototypes, standard apps

#### Option B: Bare React Native

**Pros**:
- Full control
- Smaller app size
- Access to all native modules

**Cons**:
- More complex setup
- Manual native configuration
- Harder debugging

**Best for**: Complex apps, specific native requirements

---

### Step 2: Create Expo Project

```bash
# Install Expo CLI
npm install -g expo-cli

# Create new project
npx create-expo-app my-native-app --template tabs

cd my-native-app

# Install dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

---

### Step 3: Project Structure

```
my-native-app/
├── app/                    # App Router (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx      # Home tab
│   │   ├── profile.tsx    # Profile tab
│   │   └── _layout.tsx    # Tab layout
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── lib/
│   ├── api.ts             # API client
│   ├── auth.ts            # Auth logic
│   └── storage.ts         # AsyncStorage wrapper
├── constants/
│   └── Colors.ts
├── assets/
│   ├── images/
│   └── fonts/
├── app.json               # Expo config
└── package.json
```

---

### Step 4: Configure Expo

**File**: `app.json`

```json
{
  "expo": {
    "name": "My Native App",
    "slug": "my-native-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.myapp",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to take photos.",
        "NSPhotoLibraryUsageDescription": "This app accesses your photos."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.myapp",
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

---

### Step 5: API Client Setup

**File**: `lib/api.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      requiresAuth: false,
    });

    await AsyncStorage.setItem('auth_token', data.token);
    return data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    await AsyncStorage.removeItem('auth_token');
  }

  // Resources
  async getPosts() {
    return this.request('/posts', { method: 'GET' });
  }

  async createPost(data: any) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
```

---

### Step 6: Authentication Setup

**File**: `lib/auth.ts`

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const data = await api.login(email, password);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: async () => {
    await api.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        const user = await api.request('/auth/me', { method: 'GET' });
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
```

---

### Step 7: Protected Routes

**File**: `app/_layout.tsx`

```typescript
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/lib/auth';

export default function RootLayout() {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return null; // Or loading screen
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}
```

---

### Step 8: Login Screen Example

**File**: `app/auth/login.tsx`

```typescript
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
});
```

---

## Backend Integration

### Laravel Backend for Mobile

**API Routes** (`routes/api.php`):
```php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::apiResource('posts', PostController::class);
});
```

**Auth Controller**:
```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
```

**CORS Configuration** (`config/cors.php`):
```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // Restrict in production
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

---

## Common Features

### 1. Push Notifications

#### Expo Push Notifications

**Installation**:
```bash
npx expo install expo-notifications expo-device expo-constants
```

**Setup** (`lib/notifications.ts`):
```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    alert('Must use physical device for push notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })
  ).data;

  // Send token to backend
  await api.request('/push/register', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

  return token;
}
```

---

### 2. Offline Storage

**Installation**:
```bash
npx expo install @react-native-async-storage/async-storage
```

**Usage**:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
await AsyncStorage.setItem('user_settings', JSON.stringify(settings));

// Get data
const settings = JSON.parse(await AsyncStorage.getItem('user_settings') || '{}');

// Remove data
await AsyncStorage.removeItem('user_settings');
```

---

### 3. Image Upload (Camera/Gallery)

**Installation**:
```bash
npx expo install expo-image-picker
```

**Usage** (`components/ImagePicker.tsx`):
```typescript
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';

export function ImagePickerComponent() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Upload to backend
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        <Text>Pick Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}
```

---

### 4. Biometric Authentication

**Installation**:
```bash
npx expo install expo-local-authentication
```

**Usage**:
```typescript
import * as LocalAuthentication from 'expo-local-authentication';

export async function authenticateWithBiometrics() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to continue',
    fallbackLabel: 'Use passcode',
  });

  return result.success;
}
```

---

## Deployment

### PWA Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy --prod
```

#### Netlify
```bash
npm run build
netlify deploy --prod --dir=out
```

#### Self-hosted (Nginx)
```bash
npm run build
# Copy build output to web server
scp -r out/* user@server:/var/www/html/
```

---

### React Native Deployment

#### iOS (App Store)

**Requirements**:
- Mac with Xcode
- Apple Developer Account ($99/year)
- EAS Build (Expo)

**Build**:
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

---

#### Android (Google Play)

**Build**:
```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

**Or manual build**:
```bash
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

---

## Project Structure Comparison

### PWA (Next.js)
```
my-pwa-app/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── layout.tsx
├── components/
├── lib/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
└── next.config.js
```

### React Native (Expo)
```
my-native-app/
├── app/
│   ├── (tabs)/
│   ├── auth/
│   └── _layout.tsx
├── components/
├── lib/
├── assets/
├── app.json
└── eas.json
```

---

## Testing

### PWA Testing
```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Lighthouse audit (Chrome DevTools)
# Target: 90+ PWA score
```

### React Native Testing
```bash
# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Test on physical device
npx expo start
# Scan QR code with Expo Go app
```

---

## Best Practices

### PWA
1. **Always test offline mode**
2. **Optimize images** (WebP, lazy loading)
3. **Use service worker caching** strategically
4. **Test install prompt** on Android/iOS
5. **Lighthouse audit** before deployment

### React Native
1. **Test on both iOS and Android**
2. **Use React Native Debugger**
3. **Implement error boundaries**
4. **Optimize bundle size** (tree shaking)
5. **Test on low-end devices**

### Both
1. **API-first design** (share backend)
2. **TypeScript** for type safety
3. **Consistent UI/UX** across platforms
4. **Proper error handling**
5. **Analytics and crash reporting**

---

## Next Steps

After choosing PWA or React Native:
1. ✅ Set up backend API (Laravel/Express/FastAPI)
2. ✅ Configure authentication (Sanctum/JWT)
3. ✅ Implement core features
4. ✅ Add offline support
5. ✅ Test thoroughly on target devices
6. ✅ Deploy to production

---

## Related Documentation

- [JavaScript/TypeScript Setup](./javascript-setup-guide.md)
- [Laravel Backend API](./laravel-setup-guide.md)
- [Project Use-Case Scenarios](../project-use-case-scenarios.md)
- [API Documentation Guide](../api-documentation-guide.md)

---

*Choose the right tool for your mobile app needs!*

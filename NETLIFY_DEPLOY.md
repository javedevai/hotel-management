# Netlify Deployment Guide

## Step 1: Add Environment Variables

Go to: https://app.netlify.com/sites/quetta-hotel-management/settings/env

Click **Add a variable** and add these 3 environment variables:

### Variable 1: Supabase URL
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://ejqozmptdwdbkbazxzyk.supabase.co`
- **Scopes**: All scopes

### Variable 2: Supabase Anon Key
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqcW96bXB0ZHdkYmtiYXp4enlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjI5MzcsImV4cCI6MjA3OTc5ODkzN30.DJA1JH2ChStxzukWZjiajWZu1TnYuHDbo51V_h9_puM`
- **Scopes**: All scopes

### Variable 3: Gemini API Key
- **Key**: `VITE_GEMINI_API_KEY`
- **Value**: `AIzaSyAa0j3ZpNM9DUdBdN7G0eRdoniwgMHsg1Y`
- **Scopes**: All scopes

## Step 2: Clear Cache and Deploy

1. Go to: https://app.netlify.com/sites/quetta-hotel-management/deploys
2. Click **Trigger deploy** dropdown
3. Select **Clear cache and deploy site**
4. Wait for deployment to complete (usually 2-3 minutes)

## Step 3: Verify Deployment

1. Visit: https://quetta-hotel-management.netlify.app
2. Check that the site loads
3. Test authentication (sign up/sign in)
4. Test AI concierge chat
5. Check room listings

## Troubleshooting

### If site shows blank page:
1. Check browser console for errors
2. Verify all 3 environment variables are set in Netlify
3. Make sure variable names start with `VITE_`
4. Clear cache and redeploy

### If environment variables not working:
1. Double-check variable names (case-sensitive)
2. Ensure no extra spaces in values
3. Make sure scopes are set to "All scopes"
4. Redeploy after adding variables

### If build fails:
1. Check build logs in Netlify
2. Verify Node version is 22 (set in netlify.toml)
3. Check that all dependencies are in package.json

## Build Settings (Already Configured)

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 22
- **Redirects**: Configured for SPA routing

# Security Setup Guide

## Environment Variables Configuration

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual API keys in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

3. The `.env` file is gitignored and won't be committed to GitHub

### Netlify Deployment

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site: `quetta-hotel-management`
3. Go to **Site settings** → **Environment variables**
4. Add these variables:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://ejqozmptdwdbkbazxzyk.supabase.co`

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqcW96bXB0ZHdkYmtiYXp4enlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjI5MzcsImV4cCI6MjA3OTc5ODkzN30.DJA1JH2ChStxzukWZjiajWZu1TnYuHDbo51V_h9_puM`

   **Variable 3:**
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyAa0j3ZpNM9DUdBdN7G0eRdoniwgMHsg1Y`

5. Click **Save**
6. Trigger a new deploy: **Deploys** → **Trigger deploy** → **Deploy site**

## Security Best Practices

✅ **What's Protected:**
- API keys are now in environment variables
- `.env` file is gitignored
- Keys are not exposed in GitHub repository
- Netlify securely stores environment variables

⚠️ **Important Notes:**
- Never commit `.env` file to Git
- Supabase anon key is safe to expose (it's public by design)
- Gemini API key should be kept private
- For production, consider using API key restrictions in Google Cloud Console

## Verifying Setup

After deployment, check:
1. Environment variables are set in Netlify
2. Application works correctly on production
3. AI Concierge responds to messages
4. Authentication works properly

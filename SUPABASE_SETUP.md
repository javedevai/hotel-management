# Supabase Setup Guide

## Step 1: Disable Email Confirmation (for development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Providers** → **Email**
4. **Disable** "Confirm email" option
5. Click **Save**

## Step 2: Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** or press `Ctrl+Enter`

## Step 3: Verify Setup

Run this query in SQL Editor to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- profiles
- room_types
- menu_items
- orders
- order_items
- housekeeping_tasks
- bookings

## Step 4: Test Authentication

1. Run your app: `npm run dev`
2. Click "Sign In" button
3. Click "Sign Up" to create a new account
4. Enter email, password, and name
5. Click "Create Account"

## Troubleshooting

### Issue: "User already registered"
- The user exists but profile wasn't created
- Run this SQL to create missing profile:

```sql
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'guest'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
```

### Issue: "Email not confirmed"
- Go to Authentication → Users in Supabase dashboard
- Find the user and click the three dots
- Click "Confirm email"

### Issue: Can't sign in
- Check browser console for errors
- Verify Supabase URL and key in `services/supabaseClient.ts`
- Make sure tables exist (run Step 2)

## Production Setup

For production, you should:
1. **Enable** email confirmation
2. Set up proper email templates
3. Configure custom SMTP (optional)
4. Add proper RLS policies for security

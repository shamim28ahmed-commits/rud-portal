# RUD Portal Supabase Backend Setup

## 1. Supabase project create

Go to https://supabase.com and create a new project.

## 2. Database table create

Open Supabase Dashboard > SQL Editor.

Copy all code from `supabase-schema.sql` and run it.

## 3. URL and anon key add

Open `supabase-config.js`.

Replace:

```js
url: "",
anonKey: ""
```

with your Supabase Project URL and anon public key.

Example:

```js
window.RUD_SUPABASE = {
  url: "https://your-project.supabase.co",
  anonKey: "your-anon-public-key"
};
```

## 4. Test

Open:

- `admin-login.html`
- add a student from admin dashboard
- open `student-login.html`
- login with student ID and access key

If Supabase config is empty, the site will keep working with local demo data.

## Important

This is a public demo backend setup. Before real student data, admin login should be upgraded with proper Supabase Auth and stricter database policies.

# Database Setup Instructions

## Step 1: Create Database Tables

Run this command to create all database tables:

```bash
npx wrangler d1 execute recipe-db --file=schema.sql
```

## Step 2: Insert Admin User

Run this command to create your admin account:

```bash
npx wrangler d1 execute recipe-db --file=insert-admin.sql
```

## Step 3: Verify Admin User

You can verify the admin was created:

```bash
npx wrangler d1 execute recipe-db --command="SELECT username, email, user_role FROM admin;"
```

## Login Credentials

After setup, you can login at: https://khatirecipe-app.pages.dev/login

- **Username**: `buhumsolen`
- **Password**: `Angvaiti@1`

## Note

Make sure you have `wrangler` installed globally:
```bash
npm install -g wrangler
```

And you're logged into your Cloudflare account:
```bash
npx wrangler login
```

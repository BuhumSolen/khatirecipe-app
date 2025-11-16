# Deployment Guide - Recipe Admin Panel on Cloudflare Pages

This guide will walk you through deploying your Recipe Admin Panel to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (sign up at https://dash.cloudflare.com/sign-up)
- Git installed on your computer
- Node.js 18+ installed

## Step-by-Step Deployment

### Step 1: Prepare Your Project

1. Make sure all dependencies are installed:
```bash
npm install
```

2. Test the build locally:
```bash
npm run build
```

### Step 2: Set Up Cloudflare CLI

1. Install Wrangler (Cloudflare CLI):
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
npx wrangler login
```

This will open your browser to authenticate.

### Step 3: Create D1 Database

1. Create the D1 database:
```bash
npx wrangler d1 create recipe-db
```

2. Copy the `database_id` from the output and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "recipe-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace this
```

3. Initialize the database with schema:
```bash
npx wrangler d1 execute recipe-db --file=./schema.sql
```

4. Verify tables were created:
```bash
npx wrangler d1 execute recipe-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

### Step 4: Create R2 Bucket

1. Create R2 bucket for image storage:
```bash
npx wrangler r2 bucket create recipe-images
```

2. The bucket name is already configured in `wrangler.toml`

### Step 5: Deploy via Git (Recommended)

1. Initialize Git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Recipe Admin Panel"
```

2. Push to GitHub:
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/recipe-admin-panel.git
git branch -M main
git push -u origin main
```

3. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)

4. Navigate to **Workers & Pages** → **Create Application** → **Pages**

5. Click **Connect to Git** and authorize GitHub

6. Select your repository: `recipe-admin-panel`

7. Configure build settings:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `out`

8. Add environment bindings in **Settings** → **Functions**:
   - Click **Add binding**
   - Type: **D1 Database**
   - Variable name: `DB`
   - D1 database: Select `recipe-db`
   
   - Click **Add binding** again
   - Type: **R2 Bucket**
   - Variable name: `IMAGES`
   - R2 bucket: Select `recipe-images`

9. Add environment variable:
   - Go to **Settings** → **Environment variables**
   - Add variable: `JWT_SECRET` = `your-secure-random-string-here`

10. Click **Save and Deploy**

### Step 6: Deploy via CLI (Alternative)

If you prefer CLI deployment:

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name=recipe-admin-panel
```

## Post-Deployment

### Access Your Admin Panel

Your admin panel will be available at:
```
https://recipe-admin-panel.pages.dev
```

Or your custom domain if configured.

### Default Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the default password immediately after first login!

### Configure Custom Domain (Optional)

1. Go to your Pages project in Cloudflare Dashboard
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Follow the instructions to add your domain

## Database Management

### View Database Content

```bash
# List all recipes
npx wrangler d1 execute recipe-db --command "SELECT * FROM recipe;"

# List all categories
npx wrangler d1 execute recipe-db --command "SELECT * FROM category;"

# List all admins
npx wrangler d1 execute recipe-db --command "SELECT id, username, email FROM admin;"
```

### Backup Database

```bash
# Export database to SQL file
npx wrangler d1 export recipe-db --output=backup.sql
```

### Restore Database

```bash
# Import from backup
npx wrangler d1 execute recipe-db --file=backup.sql
```

## Troubleshooting

### Build Fails

If the build fails:
1. Check `next.config.ts` has `output: 'export'`
2. Ensure no server-side only features are used
3. Check build logs in Cloudflare Dashboard

### Database Connection Issues

If you can't connect to D1:
1. Verify `database_id` in `wrangler.toml` is correct
2. Check D1 binding is properly configured in Cloudflare Dashboard
3. Ensure database tables exist: `npx wrangler d1 execute recipe-db --command "SELECT name FROM sqlite_master WHERE type='table';"`

### Images Not Uploading

If image uploads fail:
1. Verify R2 bucket exists: `npx wrangler r2 bucket list`
2. Check R2 binding is configured in Cloudflare Dashboard
3. Ensure bucket name matches `wrangler.toml`

## Monitoring & Analytics

### View Deployment Logs

1. Go to Cloudflare Dashboard
2. Navigate to your Pages project
3. Click on the deployment
4. View **Functions logs** for API errors

### Analytics

Cloudflare automatically provides:
- Page views
- Unique visitors
- Request stats
- Performance metrics

Access via: **Workers & Pages** → Your Project → **Analytics**

## Cost Considerations

### Free Tier Limits

Cloudflare Pages Free Tier includes:
- ✅ **Unlimited** requests
- ✅ **Unlimited** bandwidth
- ✅ **500 builds** per month
- ✅ **D1:** 100,000 reads/day, 50,000 writes/day
- ✅ **R2:** 10 GB storage, 1 million reads/month

For most recipe apps, this is more than sufficient!

### Upgrading (if needed)

If you exceed free limits:
- **Workers Paid Plan:** $5/month (10 million requests)
- **R2 Pricing:** $0.015/GB/month for storage
- **D1 Pricing:** Pay as you go beyond free tier

## Security Best Practices

1. **Change default password** immediately
2. **Use strong JWT_SECRET** (at least 32 random characters)
3. **Enable 2FA** on your Cloudflare account
4. **Regularly backup** your D1 database
5. **Monitor** unusual activity in analytics

## Updating Your Deployment

### Auto-Deploy (Git)

If connected to GitHub, every push to `main` branch automatically deploys.

### Manual Deploy

```bash
# Pull latest changes
git pull

# Build
npm run build

# Deploy
npx wrangler pages deploy out
```

## Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [R2 Storage Docs](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## Support

Need help? Check:
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Discord](https://discord.cloudflare.com/)
- [GitHub Issues](https://github.com/cloudflare/workers-sdk/issues)

---

**Congratulations! 🎉**

Your Recipe Admin Panel is now running on Cloudflare's global network, completely free!

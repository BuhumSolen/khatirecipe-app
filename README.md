# Recipe Admin Panel - Cloudflare Pages

A modern, serverless admin panel for the Recipe App, built with Next.js and deployed on Cloudflare Pages with D1 database.

## Features

- ✅ **Serverless Architecture** - No PHP, runs entirely on Cloudflare's edge
- ✅ **Free Hosting** - Deploy on Cloudflare Pages for free
- ✅ **Modern UI** - Built with React, Next.js, and Tailwind CSS
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Fast & Scalable** - Powered by Cloudflare's global network
- ✅ **D1 Database** - Serverless SQLite database
- ✅ **R2 Storage** - Image uploads to Cloudflare R2

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Cloudflare D1 Database

```bash
# Login to Cloudflare
npx wrangler login

# Create D1 database
npx wrangler d1 create recipe-db

# Note the database_id from output and update wrangler.toml
```

### 3. Initialize Database

```bash
# Run the schema to create tables
npx wrangler d1 execute recipe-db --file=./schema.sql
```

### 4. Create R2 Bucket (for image uploads)

```bash
npx wrangler r2 bucket create recipe-images
```

### 5. Update Configuration

Edit `wrangler.toml`:
- Replace `database_id` with your D1 database ID
- Update `JWT_SECRET` to a secure random string

### 6. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Default Login:**
- Username: `admin`
- Password: `admin123`

### 7. Deploy to Cloudflare Pages

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out
```

**OR** connect your GitHub repository to Cloudflare Pages for automatic deployments:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Create Application** → **Pages**
3. Connect your GitHub repository
4. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
5. Add environment bindings:
   - D1 database: `DB` → Select your `recipe-db`
   - R2 bucket: `IMAGES` → Select `recipe-images`
6. Deploy!

## Project Structure

```
cloudflare-admin-panel/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── recipes/           # Recipe management
│   ├── categories/        # Category management
│   └── settings/          # Settings pages
├── components/            # React components
├── lib/                   # Utility functions
│   ├── db.ts             # Database utilities
│   └── types.ts          # TypeScript types
├── schema.sql            # D1 database schema
├── wrangler.toml         # Cloudflare configuration
└── next.config.ts        # Next.js configuration
```

## API Endpoints

When deployed, the app will use Cloudflare Workers Functions:

- `GET /api/recipes` - List all recipes
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2
- **Authentication:** JWT

## Migration from PHP

This replaces the old PHP admin panel with a modern serverless architecture:

### Before (PHP/MySQL)
- Required: Apache, PHP 7+, MySQL
- Hosting: Traditional web hosting
- Cost: $5-20/month

### After (Cloudflare)
- Required: None (serverless)
- Hosting: Cloudflare Pages
- Cost: **FREE** (generous limits)

## Support

For issues or questions, please refer to:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Next.js Docs](https://nextjs.org/docs)

## License

MIT

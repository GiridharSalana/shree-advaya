# Admin Panel Setup Guide

This guide will help you set up the admin panel for your ShreeAdvaya website hosted on Vercel.

## Overview

The admin panel allows you to manage your website content (products, gallery, hero images, and content) directly through a web interface without needing a traditional backend. It uses:

- **Vercel Serverless Functions** - API routes that securely communicate with GitHub
- **GitHub API** - To store and retrieve data from your repository
- **JSON Files** - Data is stored in JSON files in your `data/` folder

## Prerequisites

1. Your website is hosted on Vercel
2. Your code is stored in a GitHub repository
3. You have admin access to your Vercel project

## Setup Steps

### Step 1: Create GitHub Personal Access Token

You can use either **Classic** or **Fine-grained** tokens. Both work!

#### Option A: Classic Token (Simpler)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → **Tokens (classic)**
2. Click "Generate new token (classic)"
3. Give it a name like "ShreeAdvaya Admin"
4. Select expiration (recommended: 90 days or No expiration for production)
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again!)

#### Option B: Fine-grained Token (More Secure)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. Click "Generate new token"
3. Give it a name like "ShreeAdvaya Admin"
4. Select expiration (recommended: 90 days or No expiration)
5. Select repository access:
   - ✅ **Only select repositories** → Choose your ShreeAdvaya repository
6. Under "Repository permissions", select:
   - ✅ **Contents**: Read and write
   - ✅ **Metadata**: Read-only (automatically included)
7. Click "Generate token"
8. **Copy the token immediately** (you won't see it again!)

**Note:** Fine-grained tokens are more secure as they're scoped to specific repositories. The code supports both token types automatically!

### Step 2: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   | Name | Value | Environment | Required |
   |------|-------|-------------|----------|
   | `GITHUB_TOKEN` | Your GitHub token from Step 1 | Production, Preview, Development | ✅ Yes |
   | `ADMIN_PASSWORD` | Your secure admin password | Production, Preview, Development | ✅ Yes |
   | `GITHUB_OWNER` | Your GitHub username | Production, Preview, Development | ⚠️ Only if different from Vercel's auto-detected |
   | `GITHUB_REPO` | Your repository name | Production, Preview, Development | ⚠️ Only if different from Vercel's auto-detected |

**Note:** Vercel automatically detects your repository name and owner from your Git connection. You only need to set `GITHUB_OWNER` and `GITHUB_REPO` manually if:
- Your Vercel project is connected to a different repo than where you want to store data
- You want to use a different repo for staging/production
- Vercel's auto-detection doesn't work for your setup

4. Click **Save** for each variable

### Step 3: Create Data Directory

Create a `data` folder in your repository root and add initial JSON files:

```bash
mkdir data
```

Create these files:

**`data/products.json`** (initial empty array):
```json
[]
```

**`data/gallery.json`** (initial empty array):
```json
[]
```

**`data/hero.json`** (initial empty array):
```json
[]
```

**`data/content.json`** (initial content):
```json
{
  "about": "ShreeAdvaya represents the perfect fusion of traditional Indian craftsmanship and contemporary design.",
  "email": "info@shreeadvaya.com",
  "phone": "+91 98765 43210",
  "whatsapp": "919876543210"
}
```

### Step 4: Update Admin Password

1. Open `assets/js/admin.js`
2. Find this line (around line 4):
   ```javascript
   const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password
   ```
3. Change `'admin123'` to your secure password
4. Commit and push to GitHub

### Step 5: Deploy to Vercel

1. Commit all changes to your GitHub repository
2. Push to your main branch
3. Vercel will automatically deploy
4. Wait for deployment to complete

### Step 6: Access Admin Panel

1. Go to your website URL: `https://your-site.vercel.app/admin.html`
2. Enter your admin password
3. Start managing your content!

## API Routes Structure

The admin panel uses these API endpoints:

- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products?id={id}` - Update product
- `DELETE /api/products?id={id}` - Delete product

- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Add gallery image
- `PUT /api/gallery?id={id}` - Update gallery image
- `DELETE /api/gallery?id={id}` - Delete gallery image

- `GET /api/hero` - Get all hero images
- `POST /api/hero` - Add hero image
- `PUT /api/hero?id={id}` - Update hero image
- `DELETE /api/hero?id={id}` - Delete hero image

- `GET /api/content` - Get website content
- `PUT /api/content` - Update website content

## How It Works

1. **Admin makes changes** in the admin panel UI
2. **Frontend sends request** to Vercel serverless function
3. **Serverless function** uses GitHub API to:
   - Read JSON file from repository
   - Update the data
   - Commit changes back to repository
4. **Vercel auto-deploys** the updated content (if configured)
5. **Website updates** with new content

## Security Notes

- ✅ GitHub token is stored securely in Vercel environment variables (never exposed to client)
- ✅ Admin panel has password protection (change default password!)
- ✅ All API calls go through serverless functions (no client-side GitHub API calls)
- ⚠️ Consider adding IP whitelist or additional authentication for production

## Troubleshooting

### "GitHub token not configured" error
- Check that `GITHUB_TOKEN` is set in Vercel environment variables
- Make sure you've redeployed after adding environment variables

### "GitHub API error: 404"
- Check that `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Verify the repository exists and is accessible

### "GitHub API error: 403"
- Your GitHub token might not have the right permissions
- Regenerate token with `repo` scope

### Changes not appearing on website
- Vercel might need a few seconds to redeploy
- Check Vercel deployment logs
- Verify JSON files were updated in GitHub

## Next Steps

1. **Migrate existing products** from `index.html` to `data/products.json`
2. **Update main website** to load products from JSON files dynamically
3. **Add image upload functionality** (currently requires manual image URLs)
4. **Set up automatic Vercel redeployment** on GitHub commits

## Support

If you encounter issues, check:
- Vercel function logs (Vercel Dashboard → Functions)
- Browser console for frontend errors
- GitHub repository for updated JSON files

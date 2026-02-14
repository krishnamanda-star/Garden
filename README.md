# 🌿 Garden Journal

A garden tracking app to log plantings by section, month, and year — with bloom calendars and care tips. Shared data via JSONBin so multiple devices/users see the same garden.

## Quick Start

### 1. Set up JSONBin (free shared storage)

1. Go to [jsonbin.io](https://jsonbin.io) and create a free account
2. Navigate to **API Keys** and copy your **X-Master-Key**
3. Open `src/storage.js` and replace the placeholder:
   ```js
   API_KEY: '$2a$10$YOUR_ACTUAL_KEY_HERE',
   ```
4. The app will auto-create a storage bin on first use. After first run, copy the bin ID from the browser console and paste it into `storage.js` as well (optional but recommended):
   ```js
   BIN_ID: 'YOUR_BIN_ID_HERE',
   ```

### 2. Deploy to GitHub Pages

**Option A: Automatic (recommended)**

1. Create a new repo on GitHub (e.g., `garden`)
2. Push this code to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/garden.git
   git branch -M main
   git push -u origin main
   ```
3. Go to repo **Settings → Pages → Source** and select **GitHub Actions**
4. The included workflow (`.github/workflows/deploy.yml`) will auto-build and deploy on every push

**Option B: Manual**

```bash
npm install
npm run build
# Upload the contents of the `dist/` folder to your hosting
```

### 3. Custom Domain (optional)

If you want this at `cmanda.org/garden`:

1. In `vite.config.js`, confirm the base path: `base: '/garden/'`
2. If using a subdomain like `garden.cmanda.org`, change to: `base: '/'`
3. Add a `CNAME` file in the `public/` folder with your domain

## Features

- **Dashboard**: Summary cards, monthly planting chart, section overview, month detail with bloom forecasts
- **Manage Plants**: Add/edit/delete plants with section, date, and notes
- **30+ built-in plants** with bloom months, hardiness zones, sun/water needs, and care tips
- **Custom plants**: Select "Custom" from the dropdown to add any plant
- **Shared data**: JSONBin syncs data across all devices — both you and your wife see the same garden
- **Offline fallback**: If JSONBin is unreachable, data saves locally in the browser
- **Mobile friendly**: Responsive layout works on phones and tablets

## Tech Stack

- React 18 + Vite
- JSONBin.io (free tier: 10,000 requests/month)
- GitHub Pages hosting

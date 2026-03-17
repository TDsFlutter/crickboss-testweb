# CrickBoss.live

## 🚀 Local Development Commands

### Start Dev Server
```powershell
npm run dev
```

### Build for Production
```powershell
npm run build
```

## 🌐 GitHub Pages Deployment

**Live URL:** [https://tdsflutter.github.io/crickboss-testweb/](https://tdsflutter.github.io/crickboss-testweb/)

Deployment is **automatic** — every push to `main` triggers a GitHub Actions build and deploy.

### Build + Commit + Push to GitHub (Triggers Deployment)
```powershell
npm run build
git add .
git commit -m "UI Updates for Create & Manage Auctions"
git push origin main
```

### Trigger Deployment Manually
To trigger a fresh deploy without code changes, run:
```powershell
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin main
```

# GitHub Pages deployment

This project is configured for a static Next.js export and deploys through `.github/workflows/deploy-pages.yml`.

## First deployment

Create an empty GitHub repository, then run these commands from this folder in PowerShell:

```powershell
git init
git add .
git commit -m "Initial Durban United club platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

On GitHub, open **Settings > Pages**, choose **GitHub Actions** as the source, and push to `main`. The workflow publishes to:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

The workflow passes `GITHUB_REPOSITORY` into Next, so `basePath` and asset URLs are generated for the repository name automatically.

## Static hosting limits

GitHub Pages serves the frontend only. The Express API, PostgreSQL database, authentication, admin persistence, Cloudinary uploads, and Stripe/PayFast webhooks must be deployed separately, for example on Railway. Replace placeholder client interactions with the deployed API URL before production use. Never put database credentials, JWT secrets, payment secrets, or Cloudinary secrets in this repository.

# Diego Teran's Website

A simple HTML website that automatically deploys to [diegote.dev](https://diegote.dev) whenever changes are pushed to the repository.

## 🚀 Automatic Deployment

This repository is configured with GitHub Actions to automatically deploy to GitHub Pages on every push to the `main` or `master` branch.

### Setup Instructions

1. Go to your repository settings
2. Navigate to **Pages** section
3. Under **Build and deployment**, select **GitHub Actions** as the source
4. Configure your custom domain `diegote.dev` in the custom domain field
5. Ensure DNS records are properly configured to point to GitHub Pages

### DNS Configuration

To use the custom domain `diegote.dev`, configure the following DNS records with your domain registrar:

- **A Records** (for apex domain):
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

- **CNAME Record** (if using www subdomain):
  - `www` → `diegoteran.github.io`

## 📝 Making Changes

Simply edit the HTML and CSS files in this repository and push your changes. The website will automatically update within a few minutes.

## 🛠️ Local Development

To view the website locally:

1. Clone this repository
2. Open `index.html` in your web browser
3. Make changes and refresh to see updates

No build process required - it's just HTML and CSS!

## 📁 File Structure

```
.
├── index.html       # Main HTML file
├── styles.css       # CSS styling
└── .github/
    └── workflows/
        └── deploy.yml # Deployment automation
```
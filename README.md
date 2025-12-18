# MultiTools

A collection of 95+ free online tools including calculators, converters, generators, SEO tools, image tools, and more. No download required, instant access for everyone!

**Latest Update:** Image Tools fixed and improved!

## Features
- 95+ handy online tools
- Categories: Image, SEO, Text, Developer, Math, Unit Converter, Security, Social Media, Miscellaneous
- Modern, responsive design
- No login or installation required

## Folder Structure
```
assets/         # CSS, JS, images, manifests
components/     # HTML components (header, footer, ads, tabs)
tools/          # Individual tool HTML files (+ a few helper scripts)
blog/           # Blog articles and listing page
index.html      # Main homepage
sw-config.js    # Service worker config (registers /sw.js when enabled)
sw.js           # Service worker
robots.txt      # Robots directives
sitemap.xml     # Sitemap (generated)
```

## How to Run Locally
1. Download or clone this repository.
2. Open `index.html` in your web browser (doubleâ€‘click or via a static server).

## Deploy on GitHub Pages
Option A: User/Org site (root at main branch)
1. Repo name: `<user>.github.io`
2. Push this project as the repository contents
3. Pages autoâ€‘serves from `/`

Option B: Project site
1. Push to GitHub
2. In GitHub repo â†’ Settings â†’ Pages â†’ Build and deployment
3. Source: Deploy from a branch â†’ Branch: `main` â†’ Folder: `/root`
4. Save. Site will be available at: `https://<user>.github.io/<repo>/`

Notes:
- Ensure absolute URLs in code use root (`/...`) or relative paths; this repo already uses relative paths suited for Pages.
- Service worker: controlled by `sw-config.js` via `window.SW_CONFIG.enabled`. Disable for first deploy if needed.

## Alternate Hosting
- **Netlify** ([docs](https://docs.netlify.com/))
- **Vercel** ([docs](https://vercel.com/docs))
- **Cloudflare Pages** ([docs](https://developers.cloudflare.com/pages/))

## Credits
- Author: [Rajesh Kumar S]
- Website: [https://github.com/Rajesh1461/Multi-Tools]

## SEO Content Plan

We maintain a complete SEO content strategy to improve discoverability of all tools on **multitoolszone.fun**.  

ðŸ“„ See [`multitoolszone_full_seo_plan.txt`](./multitoolszone_full_seo_plan.txt)  

This document includes:  
- SEO Titles for 100+ tools and keywords  
- Meta Descriptions crafted for ranking in Google  
- Content Outlines with suggested sections and FAQ ideas  

Use this file as a reference when:  
- Creating new tool pages  
- Writing blog articles or landing pages  
- Updating metadata for existing tools
- updating sitemap

# Zain Duah — Portfolio

A responsive personal portfolio for Zain Duah, developer and founder of ZINICH in Tema, Ghana.

## Project files

- `index.html` — semantic page content, SEO metadata, and Person structured data
- `styles.css` — responsive visual design, themes, and motion
- `script.js` — theme toggle, mobile navigation, reveal animations, certificate viewer, and email handoff
- `certificates/` — SoloLearn course certificate screenshots shown in the interactive gallery
- `robots.txt` and `sitemap.xml` — crawler guidance and sitemap
- `site.webmanifest` — installable-site metadata

## Preview locally

Open `index.html` in a browser, or serve the folder with a local static server:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment and SEO

The canonical URL, sitemap, robots file, and social preview URLs use the portfolio's Vercel deployment: `https://zain-duah-portfolio.vercel.app/`. If the production domain changes, update those URLs together in `index.html`, `robots.txt`, and `sitemap.xml`.

The contact form opens a prefilled email draft addressed to `zainduah55@gmail.com`; it does not send or store form submissions on a server.

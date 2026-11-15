# Adarsh Singh Kushwah — model portfolio

A static Next.js portfolio prepared for GitHub Pages.

## Run locally

```sh
npm install
npm run dev
```

## Publish on GitHub Pages

The included GitHub Actions workflow builds the static site from the `main` branch and deploys the `out/` folder. In the repository’s Pages settings, select **GitHub Actions** as the deployment source. The build serves assets from the domain root for the custom domain `adarshsingh.vitabletech.in`.

To build locally with the same root paths used on GitHub Pages:

```sh
GITHUB_PAGES=true npm run build
```

## Update the portfolio

- Replace or add photos in `public/images/` and update the `looks` list in `app/page.tsx`.
- Set confirmed model measurements in the `measurements` list in `app/page.tsx` before sharing the book for casting.
- Update the `phone` constant in `app/page.tsx` to change the WhatsApp destination. Include the country code without a `+` sign.
- Update the canonical site URL in `app/layout.tsx` and `public/sitemap.xml` if the repository name or hosting domain changes.

## Add an approved 3D scan

The default viewer loads `public/models/adarsh-photo-avatar.glb`, a photo-informed 3D illustration based on the black-shirt portrait. The face, back, and portions cropped out of the photo are approximations; it is not a photogrammetry scan. The measurement guides show placement only. To replace it with an approved model scan, add a `.glb` file at `public/models/adarsh.glb` and change the `modelUrl` in `app/page.tsx` to `/models/adarsh.glb`. The viewer normalizes the scan to a standing height, then keeps the rotate, front/side/back, zoom, guide and fullscreen controls. A GLB with textures embedded is easiest to host as a single static file.

To rebuild the photo-informed GLB from the current 3D geometry, run `npm run generate:avatar`.

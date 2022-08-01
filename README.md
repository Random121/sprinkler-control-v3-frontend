# sprinkler-control-v3-frontend

## Deploying with the Flask Server

1. Run `npm run build` to create the frontend bundle in `dist/` folder
2. Copy the asset files in `dist/assets/` into the flask server's `public/panel/static` folder
3. Copy the `index.html` inside the `public/template` folder
4. Edit `index.html` so the assets source is linked with `url_for()`
5. Link the favicon in `index.html`

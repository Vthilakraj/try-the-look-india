# Try the Look India

A menswear storefront with an interactive WebGL runway, 12 styled outfits, and 48 products across nine collections. Browse by colour, size, or price, then save individual pieces or full outfits to a styling bag.

## Run locally

From the repository root, run:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. The runway is at http://localhost:8000/runway/ and uses WebGL.

## Build the pages

Run `python3 source/build.py` after changing the shared page template or collection routes. Generated pages and their assets are in `dist/`. Serve that directory at the root of a static web host with directory indexes enabled.

The catalog uses sample prices in INR. The styling bag is stored in the browser.

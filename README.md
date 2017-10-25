# reduction

> An universal React/Redux applications starter kit based on universal familly of packages.

## About

This starter kit contains all the minimal tooling and configuration you need to kick off your next universal React/Redux project.

It uses [Universal Development Kit](https://github.com/enten/udk) to won't have to write specific code for development purposes (allows hot reloading on webpack, client and server layers).

## Features

* [`udk`](https://github.com/enten/udk) as compiler and [development container](https://github.com/enten/udk#dev-container).
* [`webpack`](https://github.com/webpack/webpack) v3 as bundler engine.
* [`react`](https://github.com/facebook/react/) v16 as the view.
* [`redux-first-router`](https://github.com/faceyspacey/redux-first-router) as the router.
* [`express`](https://github.com/expressjs/express) server.
* Server Side Rendering (SSR).
* Universal Code-Splitting (JS and CSS) based on universal family of packages: 
  * [`react-universal-component`](https://github.com/faceyspacey/react-universal-component)
  * [`webpack-flush-chunks`](https://github.com/faceyspacey/webpack-flush-chunks)
  * [`extract-css-chunks-webpack-plugin`](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin)
  * [`babel-plugin-universal-import`](https://github.com/faceyspacey/babel-plugin-universal-import)
* Extreme live development: hot reloading of all changes into webpack, client and server layers.
* Full ES2015+ support: use the same JS syntax across the client and server sources.
* Preconfigured to deploy to [now](https://zeit.co/now) with a single command.

## Getting started

```shell
git clone https://github.com/enten/reduction my-project
cd my-project
npm install
npm run dev
```

## Things To Do

- Run dev container with `npm run dev`
- Open [localhost:3000](http://localhost:3000) in your browser
- Click "CHANGE PAGE" to cycle through dynamically imported pages
- refresh on any page
- and then view the source in the browser to see what chunks are being sent on each page
- **view the primary code in:** ***[webapp/components/App.js](./webapp/components/App.js)***
- open the Network tab to see when imports are fetched
- edit the components to see that HMR works--even for split chunks.
- edit and save the CSS files to confirm HMR works for CSS as well, thanks to [extract-css-chunks-webpack-plugin](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin)
- examine the build folders to see exactly what chunks and files are built for you 
- Run in production mode with `npm start`

*Long live the dreams of Universal HMR* and ***Universal Code-Splitting!***

## Thanks to

* [ctrlplusb](https://github.com/ctrlplusb)
* [faceyspacey](https://github.com/faceyspacey)

## License

[MIT](./LICENSE)

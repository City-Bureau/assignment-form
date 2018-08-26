# Documenters Assignment Form

Online form created with [Vue.js](https://vuejs.org/) to apply for assignments in [City Bureau's Documenters program](https://www.citybureau.org/documenters/).

## Setup

If you're using [yarn](https://yarnpkg.com), you can install dependencies and run a local development server with:

```bash
yarn
yarn run dev
```

If you're using npm you can run the same commands, substituting `npm` for `yarn`. Once this is run, you should be able to access the application at [http://localhost:8080](http://localhost:8080).

To make local development easier, outside of the production environment all requests to the API are replaced by sample responses. Sample events are in `test/fixtures/events.json`, and assignment request submissions always return a successful response. The live application makes requests to the assignment API (source code at [City-Bureau/assignment-api](https://github.com/City-Bureau/assignment-api)).

## Configuration

The value of the environment variable `API_HOST` is read when `yarn build` is run and used for all API requests. It should be a hostname, without a scheme (e.g. `documenter-assignments-api.labs.citybureau.org`). You'll want to configure this in whatever environment the app is being built in.

## Contributing

The Documenters assignment form is part of the [City Scrapers project of City Bureau Labs](https://github.com/City-Bureau/city-scrapers). Check out that project [README](https://github.com/City-Bureau/city-scrapers/blob/master/README.md) for more information on getting involved.

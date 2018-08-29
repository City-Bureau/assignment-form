'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

var host = process.env.API_HOST || "localhost:8080";

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"' + host + '"',
})

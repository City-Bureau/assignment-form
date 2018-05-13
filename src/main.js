// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import fetchIntercept from 'fetch-intercept';

import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

require('./assets/sass/main.scss');

// Patch any API routes with fixtures if not in production
if (process.env.NODE_ENV !== 'production') {
  let apiRoutes = [
    {
      method: 'GET',
      url: 'api/events',
      response: require('../test/fixtures/events.json')
    },
    {
      method: 'POST',
      url: 'api/applications',
      response: { ok: true }
    }
  ];

  fetchIntercept.register({
    response: function (response) {
      // Return a modified response object if included in patched API routes
      let route = apiRoutes.find(item => response.url.endsWith(item.url));
      if (route) {
        return new Response(JSON.stringify(route.response), { status: 200 });
      }
      return response;
    }
  });
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

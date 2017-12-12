<template>
  <div id="app">
    <section class="section header">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-12">
            <a href="http://citybureau.org">
              <img src="/static/logo.png" class="logo">
            </a>
          </div>
          <div class="column is-12">
            <h1 class="title">Documenters Assignment Application</h1>
          </div>
        </div>
      </div>
    </section>

    <section class="section main">
      <div class="container">
        <div class="columns">
          <div class="column">
            <div class="content">
              <router-view/>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss" scoped>
img.logo {
  width: 10em;
}
.header {
  padding-bottom: 0;
}
.main {
  padding-top: 1em;
}
</style>

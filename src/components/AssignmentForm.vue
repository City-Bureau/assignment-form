<template>
  <div class="form">
    <h1>Documenters Assignment Application</h1>
    <div class="loading" v-if="loading">
      Loading...
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssignmentForm',
  data () {
    return {
      selected: [],
      loading: false,
      events: [],
      documenters: [],
      error: null,
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      const getDocumenters = fetch('http://localhost:8080/api/documenters').then((response) => {
      });

      const getEvents = fetch('http://localhost:8080/api/events').then((response) => {
      });
      Promise.all(getEvents, getDocumenters).then(() => { this.loading = false });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

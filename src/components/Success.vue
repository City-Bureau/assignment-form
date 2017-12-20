<style lang="scss" scoped>
</style>

<template>
  <div>
    <h3>Your application has been received! We will email you to follow up.</h3>
    <p><router-link :to="{ name: 'assignment_form'}">Return to the home page.</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'Success',
}
</script>
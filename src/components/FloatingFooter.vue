<style lang="scss" scoped>

@import "../assets/sass/variables.scss";

.sticky-footer {
}

.floater.floating {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
</style>

<template>
  <div class="sticky-footer">
    <div class="floater" :class="{floating: floating && !isVisible}">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'floating-footer',
  props: ['floating'],

  data () {
    return {
      isVisible: false,
    };
  },

  mounted () {
    const check = () => {
      const floater = this.$el.querySelector('.floater');
      const footerHeight = floater.getBoundingClientRect().height;
      const toTopOfPage = this.$el.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;

      const y = toTopOfPage + footerHeight - viewportHeight;

      if (y < 0) {
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
    }

    this.onScroll = () => {
      if(!window.requestAnimationFrame){
        return setTimeout(check, 16);
      }

      window.requestAnimationFrame(check);
    }

    window.addEventListener('scroll', this.onScroll);
  },

  destroyed () {
    window.removeEventListener('scroll', this.onScroll);
  }
}
</script>

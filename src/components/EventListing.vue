<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

@import "../assets/sass/variables.scss";

.content .event .subtitle {
  margin-bottom: .5rem;
}

.description, .location, .community-area {
  font-size: .9em;
}

.event {
  margin: 2em 0 3em;
  color: rgba($black, .6);

  .subtitle {
    color: inherit;
  }

  .meta {
    margin-left: 55px;
  }

  p.community-area {
    margin-bottom: 0;
    font-weight: bold;
  }

  &:hover {
    cursor: pointer;
    .title {
      color: darken( red, 20%);
    }
  }

  &.selected {
    color: $black;
    .title {
      color: red;
    }
  }

}

.event .b-checkbox {
  line-height: 1.8;
  overflow: hidden;

  label .hidden {
    display: none;
  }
  label::before {
    height: 44px;
    width: 44px;
  }
  label::after {
    width: 44px;
    height: 44px;
    left: 5px;
    top: 5px;
    font-size: 36px;
  }
  .title, .subtitle {
    margin-left: 55px;
  }
  .checkbox-container {
    float: left;
  }
}
</style>

<template>
  <div class="event" v-if="event" v-bind:class="{ selected: event.selected }" @click="toggleSelection(event)">
    <div class="b-checkbox">
      <div class="checkbox-container">
        <input type="checkbox" v-model="event.selected" :id="event.id" class="styled" @click.prevent.stop >
        <label :for="event.id" @click.prevent ><span class="hidden">{{ event.fields.name }}, {{ event.fields.agency_name }}</span></label>
      </div>
      <p class="title is-4">{{ event.fields.name }}</p>
      <p class="subtitle is-6">
        {{ event.fields.agency_name }}
      </p>
    </div>

    <div class="columns">
      <div class="column is-half">
        <div class="meta">
          <p class="assignment-type">
            <span v-for="t in event.fields.assignment" :key="t" class="tag is-rounded" :class="event.selected ? 'is-warning' : 'is-light'">{{ t }}</span>
          </p>
          <p class="date">
            {{ format(event.fields.date, "dddd, MMMM D, YYYY")}}<br>
            {{ format(event.fields.date, "h:mma") }}
          </p>
          <p class="description">{{ event.fields["description"] }}</p>
          <p class="community-area">Community Area</p>
          <p class="location"><a v-on:click.stop :href="mapURL(event.fields['location_name'])" target="_blank">{{ event.fields["location_name"] }}</a></p>
        </div>
      </div>
    </div>
    <div class="column">
    </div>

  </div>
</template>

<script>
import format from 'date-fns/format';

export default {
  name: 'EventListing',
  props: ['event'],
  methods: {
    format,
    toggleSelection(event) {
      event.selected = !event.selected;
    },
    mapURL(address) {
      const encodedAddress = encodeURIComponent(address);
      return `https://www.google.com/maps/search/${encodedAddress}`;
    },
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

@import "../assets/sass/variables.scss";

.content .event .subtitle {
  margin-bottom: .5rem;
}

.description, .location, .community-area, .url, .start-time, .end-time {
  font-size: .9em;
  .tag {
    padding-left: 0;
    color: rgba($black, .6);
  }
}

.start-time, .end-time {
  width: 40%;
  vertical-align: top;
}
.start-time, .end-time {
  display: inline-block;
}

.description {
  white-space: pre-line;
  max-width: 600px;
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

  p.community-area, p.location {
    margin-bottom: 0;
  }

  &.selected {
    color: $black;
    .title {
      color: red;
    }
  }

  p.assignment-type-tags, p.assignment-type-select {
    height: 2em;
  }

  select.assignment-type {
    border: solid 2px #333;
    font-size: .9em;
    &.is-invalid {
      border-color: $yellow;
    }
  }
}

.event .b-checkbox {
  line-height: 1.8;
  overflow: hidden;

  &:hover {
    cursor: pointer;
  }

  label .hidden {
    display: none;
  }
  label::before {
    height: 44px;
    width: 44px;
    background-color: #f5f5f5;
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
  <div class="event" v-if="event" v-bind:class="{ selected: event.selected }">
    <div class="b-checkbox" @click="toggleSelection(event)">
      <div class="checkbox-container">
        <input type="checkbox" v-model="event.selected" :id="event.id" class="styled" @click.prevent.stop >
        <label :for="event.id" ><span class="hidden">{{ event.fields.name }}, {{ event.fields.agency_name }}</span></label>
      </div>
      <p class="title is-4">{{ event.fields.agency_name }}</p>
      <p class="subtitle is-6">
        {{ event.fields.name }}
      </p>
    </div>

    <div class="columns">
      <div class="column">
        <div class="meta">
          <p v-if="event.selected" class="assignment-type-select">
          <select
              class="assignment-type" :class="{'is-invalid': event.selectedAssignmentType === 'none'}"
              v-if="event.selected" v-model="event.selectedAssignmentType"
              @click.stop
            >
            <option value="none" disabled>Choose an assignment type...</option>
              <option v-for="t in event.fields.assignment" :value="t">{{ t }}</option>
            </select>
          </p>
          <p v-else class="assignment-type tags">
            <span v-for="t in event.fields.assignment" :key="t" class="tag is-rounded is-light">{{ t }}</span>
          </p>
          <p class="start-time">
          <span class="tag is-white">Start Time</span><br>
            {{ format(event.fields.start_time, "dddd, MMMM D, YYYY")}}<br>
            {{ format(event.fields.start_time, "h:mma") }}
          </p>
          <p class="end-time">
          <span class="tag is-white">End Time</span><br>
            <span v-if="event.fields.end_time">
              {{ format(event.fields.end_time, "dddd, MMMM D, YYYY")}}<br>
              {{ format(event.fields.end_time, "h:mma") }}
            </span>
            <span v-else>-</span>
          </p>
          <p class="description">
          <span class="tag is-white">Description</span>
            {{ event.fields["description"] || "-"}}
          </p>
          <p class="community-area">
            <span class="tag is-white">Community Area</span>
            {{ event.fields["community_area"] || "-"}}
          </p>
          <p class="location">
            <span class="tag is-white">Location</span>
            <a v-if="event.fields['location_address']" v-on:click.stop :href="mapURL(event.fields['location_address'])" target="_blank">{{ event.fields["location_address"] }}</a>
            <span v-else>-</span>
          </p>
          <p class="url">
            <span class="tag is-white">URL</span>
            <a v-if="event.fields['url']" v-on:click.stop :href="event.fields['url']" target="_blank">{{ event.fields["url"] }}</a>
            <span v-else>-</span>
          </p>
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

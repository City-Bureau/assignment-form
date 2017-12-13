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

.summary {
  padding: 2em;
  border: solid 4px $yellow;

  .validation {
    margin-top: 2em;
    p {
      color: red;
      margin: 0;
    }
  }
}

.summary .b-checkbox {
  margin: 1.5em 0;
  line-height: 1.8;

  label {
    padding-left: 15px;
    font-weight: bold;
  }
  label::before {
    height: 24px;
    width: 24px;
  }
  label::after {
    width: 22px;
    height: 22px;
    left: 4px;
    top: 4px;
    font-size: 17px;
    line-height: 1;
  }
}

button.submit {
  margin-top: 1em;
}

.form .date {
  margin-bottom: .5em;
  font-weight: bold;
}
</style>

<template>
  <div class="form">
    <div class="loading" v-if="loading">
      Loading...
    </div>
    <div v-else>
      <p>Please use this form to claim assignments you want to document. Selected Documenters will be notified via email with instructions on how to complete the assignment and receive payment.</p>
      <div v-for="e in events" :key="e.id" class="event" v-bind:class="{ selected: e.selected }" @click="toggleSelection(e)">
        <div class="b-checkbox">
          <div class="checkbox-container">
            <input type="checkbox" v-model="e.selected" :id="e.id" class="styled" @click.prevent.stop >
            <label :for="e.id" @click.prevent ><span class="hidden">{{ e.fields.name }}, {{ e.fields.agency_name }}</span></label>
          </div>
          <p class="title is-4">{{ e.fields.name }}</p>
          <p class="subtitle is-6">
            {{ e.fields.agency_name }}
          </p>
        </div>

        <div class="columns">
          <div class="column is-half">
            <div class="meta">
              <p class="assignment-type">
                <span v-for="t in e.fields.assignment" :key="t" class="tag is-rounded" :class="e.selected ? 'is-warning' : 'is-light'">{{ t }}</span>
              </p>
              <p class="date">
                {{ format(e.fields.date, "dddd, MMMM D, YYYY")}}<br>
                {{ format(e.fields.date, "h:mma") }}
              </p>
              <p class="description">{{ e.fields["description"] }}</p>
              <p class="community-area">Community Area</p>
              <p class="location"><a v-on:click.stop :href="mapURL(e.fields['location_name'])" target="_blank">{{ e.fields["location_name"] }}</a></p>
            </div>
          </div>
        </div>
        <div class="column">
        </div>

      </div>

      <form>
      <div class="summary">
        <p class="subtitle is-5">{{ selectedAssignmentsMessage() }}</p>

        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" v-model="name" placeholder="Firstname Lastname">
          </div>
        </div>

        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="text" v-model="email" placeholder="you@email.com">
          </div>
        </div>

        <div class="field">
          <div class="control">
            <div class="b-checkbox">
              <input type="checkbox" v-model="agreedToTerms" id="agreedToTerms" class="styled">
              <label for="agreedToTerms">
                I agree to the <a href="" _target="blank">terms and conditions</a> of this Documenters assignment.
              </label>
            </div>
          </div>
        </div>

        <p>You will be paid through our automated system when the agreed upon terms have been met, i.e. if you are assigned to fill out a meeting template and live-tweet a meeting, your payment will be processed when the template is turned in and the live-tweets confirmed.</p>

        <div class="field">
          <div class="control">
            <div class="b-checkbox">
              <input type="checkbox" v-model="agreedToRate" id="agreedToRate" class="styled">
              <label for="agreedToRate">
                I agree to City Bureau's $15/hour pay rate for Documenters assignments.
              </label>
            </div>
          </div>
        </div>

        <div v-if="submissionAttempted" class="validation">
          <p v-for="m in validationMessages()" :key="m">{{m}}</p>
        </div>

        <button class="button is-warning is-medium submit" v-on:click.prevent="submit">Request Assignments</button>
      </div>
      </form>

    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import parse from 'date-fns/parse';
import format from 'date-fns/format';

export default {
  name: 'AssignmentForm',
  data () {
    return {
      loading: false,
      error: null,
      submissionAttempted: false,
      events: [],
      agreedToTerms: false,
      agreedToRate: false,
      name: "",
      email: "",
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    format,
    toggleSelection(event) {
      event.selected = !event.selected;
    },
    mapURL(address) {
      const encodedAddress = encodeURIComponent(address);
      return `https://www.google.com/maps/search/${encodedAddress}`;
    },
    selectedAssignments() {
      return this.events.filter( (e) => e.selected );
    },

    selectedAssignmentsMessage() {
      const selected = this.selectedAssignments();
      const len = selected.length;
      if (len === 1) {
        return `You have selected ${len} assignment.`;
      } else {
        return `You have selected ${len} assignments.`;
      }
    },

    validationMessages() {
      let errors = [];
      if (this.selectedAssignments().length === 0) {
        errors.push("Please select at least one assignment above.");
      }
      if (this.name.trim().length === 0) {
        errors.push("Please enter your name.");
      }
      const emailLength = this.email.trim().length;
      if (emailLength === 0) {
        errors.push("Please enter your email.");
      }
      if (emailLength > 0 && !/.+@.+\..+/.test(this.email)) {
        errors.push("Please enter a valid email.");
      }
      if (!this.agreedToTerms) {
        errors.push("Please agree to terms and conditions.");
      }
      if (!this.agreedToRate) {
        errors.push("Please agree to the rate.");
      }
      return errors;
    },

    fetchData() {
      this.loading = true;
      const domain = process.env.NODE_ENV === 'production' ? 'http://assignment-api.cb.autonomousmachine.com' : 'http://localhost:5000';

      fetch(`${domain}/api/events`)
        .then((response) => response.json())
        .then((data) => {
          data.forEach( (d) => {
            d.fields.date = parse(d.fields.start_time);
            d.selected = false;
          });
          this.events = data;
          this.loading = false;
        })
        .catch( (e) => this.error = e.toString());
    },

    submit(event) {
      this.submissionAttempted = true;
      const errors = this.validationMessages();
      if (errors.length > 0) {
        return;
      }
      console.debug('saving!');
    }
  }
}
</script>

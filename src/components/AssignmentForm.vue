<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

@import "../assets/sass/variables.scss";

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

      <event-listing v-for="e in events" :key="e.id" :event="e">
      </event-listing>

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
import EventListing from './EventListing.vue';

export default {
  name: 'assignment-form',
  components: { EventListing },

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

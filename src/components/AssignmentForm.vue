<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

@import "../assets/sass/variables.scss";

.summary {
  border: solid 4px $yellow;

  .validation {
    margin-top: 2em;
    p {
      color: red;
      margin: 0;
    }
  }

  .box-header {
    color: white;
    font-weight: bold;

    .instructions {
      display: none;
    }

  }

  .floating .box-header .instructions {
    display: inline;
  }

  .summary-content {
    padding: 2em;
  }
}

.summary .b-checkbox {
  margin: 1.5em 0;
  line-height: 1.8;

  label {
    padding-left: 2em;
    font-weight: bold;
    display: block;
    line-height: 1.4em;
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

  input[type="checkbox"] {
    position: absolute;
  }
}

button.submit {
  margin-top: 1em;
}

.form .date {
  margin-bottom: .5em;
  font-weight: bold;
}

.error {
  margin-top: 1em;
  font-size: 1.2em;
  color: red;
}

.box-header {
  padding: .7em 1em;
  background: $yellow;
  line-height: 1.3em;
  border-bottom: solid 4px $yellow;
}

.floating .box-header {
  border-bottom: none;
}

.no-events {
}

</style>

<template>
  <div class="form">
    <div class="loading" v-if="loading">
      Loading...
    </div>
    <div v-else>

      <div v-if="events.length === 0" class="no-events">
        <p>There are no available assignments at this time.</p>
      </div>

      <div v-else>

      <p>Please use this form to claim assignments you want to document. Selected Documenters will be notified via email with instructions on how to complete the assignment and receive payment.</p>
        <event-listing v-for="e in events" :key="e.id" :event="e">
        </event-listing>

        <form>
          <div class="summary">
            <floating-footer :floating="selectedAssignments().length > 0">
              <p class="box-header is-5">
                {{ selectedAssignmentsMessage() }}
                <span class="instructions">
                  Please scroll down to complete your submission.
                </span>
              </p>
            </floating-footer>

            <div class="summary-content">

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
                    <input type="checkbox" v-model="agreeToAttend" id="agreeToAttend" class="styled">
                    <label for="agreeToAttend">
                      I agree to fulfill the terms of my assignment, including any in-person attendance requirements and stated deadlines.
                    </label>
                  </div>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <div class="b-checkbox">
                    <input type="checkbox" v-model="agreeToFollowInstructions" id="agreeToFollowInstructions" class="styled">
                    <label for="agreeToFollowInstructions">
                      I agree to read all emailed instructions and submit documentation to City Bureau before payment for my work is approved.
                    </label>
                  </div>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <div class="b-checkbox">
                    <input type="checkbox" v-model="agreeToRate" id="agreeToRate" class="styled">
                    <label for="agreeToRate">
                      I agree to City Bureau's $15/hour pay rate for Documenters assignments.
                    </label>
                  </div>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <div class="b-checkbox">
                    <input type="checkbox" v-model="agreeToPayTaxes" id="agreeToPayTaxes" class="styled">
                    <label for="agreeToPayTaxes">
                      I understand that Documenters are independent contractors and that I am responsible for all taxes associated with this income.
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="submissionAttempted" class="validation">
                <p v-for="m in validationMessages()" :key="m">{{m}}</p>
              </div>

              <button class="button is-dark is-medium submit" v-on:click.prevent="submit" :disabled="submitting">
                {{ submitting ? "Please wait..." : "Request Assignments" }}
              </button>
            </div>
          </div>
        </form>
      </div>

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
import FloatingFooter from './FloatingFooter.vue';

export default {
  name: 'assignment-form',
  components: { EventListing, FloatingFooter },

  data () {
    return {
      loading: false,
      submitting: false,
      error: null,
      submissionAttempted: false,
      events: [],
      agreeToAttend: false,
      agreeToRate: false,
      agreeToFollowInstructions: false,
      agreeToPayTaxes: false,
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
      let unselectedAssignmentTypes = this.selectedAssignments().some( a => a.selectedAssignmentType === "none" );
      if (unselectedAssignmentTypes) {
        errors.push("Please choose an assignment type from the menu for each selected meeting.");
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
      if (!this.agreeToAttend || !this.agreeToFollowInstructions ||
          !this.agreeToRate || !this.agreeToPayTaxes) {
        errors.push("Please agree to all terms and conditions.");
      }
      return errors;
    },

    domain() {
      return process.env.API_HOST;
    },

    fetchData() {
      this.loading = true;

      const options = {
        headers: {
          "Accept": "application/json"
        }
      };

      fetch(`//${this.domain()}/api/events`, options)
        .then((response) => response.json())
        .then((data) => {
          data.forEach( (d) => {
            d.fields.date = parse(d.fields.start_time);
            d.selected = false;
            d.selectedAssignmentType = "none";
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

      this.submitting = true;

      const params = {
        agree_to_attend: this.agreeToAttend,
        agree_to_follow_instructions: this.agreeToFollowInstructions,
        agree_to_rate: this.agreeToRate,
        agree_to_pay_taxes: this.agreeToPayTaxes,
        applied_name: this.name,
        email: this.email,
        event: this.selectedAssignments().map( (event) => {
          return {id: event.id, assignment_type: event.selectedAssignmentType}
        }),
      };

      const options = {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      };

      fetch(`//${this.domain()}/api/applications`, options)
        .then((response) => {
          if(response.ok) {
            return response.json();
          }
          throw new Error("Application could not be submitted! Please send us an email and report this problem.");
        })
        .then((data) => {
          this.submitting = false;
          this.$router.push({name: 'success'});
        })
        .catch( (e) => this.error = e.toString());
    }
  }
}
</script>

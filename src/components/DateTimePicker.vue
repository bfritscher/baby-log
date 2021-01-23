<template>
  <div>
    <span>{{ label }}</span>
    <v-dialog
      ref="dialogTime"
      v-model="dialogTime"
      :return-value.sync="time"
      persistent
      width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="time"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker v-if="dialogTime" v-model="time" format="24hr" full-width>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="dialogTime = false"> Cancel </v-btn>
        <v-btn text color="primary" @click="$refs.dialogTime.save(time)">
          OK
        </v-btn>
      </v-time-picker>
    </v-dialog>

    <v-dialog
      ref="dialogDate"
      v-model="dialogDate"
      :return-value.sync="date"
      persistent
      width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="dialogDate = false"> Cancel </v-btn>
        <v-btn text color="primary" @click="$refs.dialogDate.save(date)">
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export default {
  name: "DateTimePicker",
  props: ["label", "value"],
  data() {
    return {
      dialogTime: false,
      dialogDate: false
    };
  },
  computed: {
    time: {
      get() {
        let date = new Date(this.value);
        if (!isValidDate(date)) {
          date = new Date();
        }
        return `${("0" + date.getHours()).slice(-2)}:${(
          "0" + date.getMinutes()
        ).slice(-2)}`;
      },
      set(time) {
        const date = new Date(this.value);
        date.setHours(...time.split(":"));
        this.$emit("input", date.toISOString());
      }
    },
    date: {
      get() {
        let dateString = this.value;
        const date = new Date(dateString);
        if (!isValidDate(date)) {
          dateString = new Date().toISOString();
        }
        return dateString.split("T")[0];
      },
      set(dateString) {
        let time;
        try {
          time = this.value.split("T")[1];
        } catch (e) {
          time = undefined;
        }
        if (!time) {
          time = "12:00:00.00Z";
        }
        this.$emit("input", dateString + "T" + time);
      }
    }
  }
};
</script>
;

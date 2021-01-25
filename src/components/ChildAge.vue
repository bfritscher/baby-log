<template>
  <span>age {{ age }}</span>
</template>

<script>
export default {
  name: "ChildAge",
  props: ["birthdate"],
  computed: {
    age() {
      const daysTotal = Math.floor(
        (new Date().getTime() - new Date(this.birthdate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const daysMonth = daysTotal % 365;
      const years = (daysTotal - daysMonth) / 365;
      const daysWeeks = daysMonth % 30;
      const months = (daysMonth - daysWeeks) / 30;
      const days = daysWeeks % 7;
      const weeks = (daysWeeks - days) / 7;
      let ageString = "";
      if (years > 0) {
        ageString += `${years} an`;
        if (years > 1) {
          ageString += "s";
        }
        if (months > 0 || weeks > 0) {
          ageString += ", ";
        }
      }
      if (months > 0) {
        ageString += `${months} mois`;
        if (weeks > 0) {
          ageString += ", ";
        }
      }
      if (weeks > 0) {
        ageString += `${weeks} semaine`;
        if (weeks > 1) {
          ageString += "s";
        }
      }
      if (days > 0) {
        ageString += ` et ${days} jour`;
        if (days > 1) {
          ageString += "s";
        }
      }
      return ageString;
    }
  }
};
</script>

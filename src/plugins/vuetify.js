import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import Alphabet from "../components/icons/Alphabet";
import BabyBottle from "../components/icons/BabyBottle";
import BabyTummy from "../components/icons/BabyTummy";
import Bath from "../components/icons/Bath";
import Bowl from "../components/icons/Bowl";
import Diaper from "../components/icons/Diaper";
import Health from "../components/icons/Health";
import L from "../components/icons/L";
import MeasuringTape from "../components/icons/MeasuringTape";
import Medication from "../components/icons/Medication";
import Pee from "../components/icons/Pee";
import Poo from "../components/icons/Poo";
import PeePoo from "../components/icons/PeePoo";
import Pump from "../components/icons/Pump";
import PumpL from "../components/icons/PumpL";
import PumpR from "../components/icons/PumpR";
import PumpB from "../components/icons/PumpB";
import R from "../components/icons/R";
import Ruler from "../components/icons/Ruler";
import Stroller from "../components/icons/Stroller";
import Syringe from "../components/icons/Syringe";
import Thermometer from "../components/icons/Thermometer";
import Weight from "../components/icons/Weight";
import ZzzSleep from "../components/icons/ZzzSleep";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#1976D2',
        secondary: "#FFFFFF",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      }
    }
  },
  icons: {
    values: {
      alphabet: {
        component: Alphabet
      },
      "baby-bottle": {
        component: BabyBottle
      },
      "baby-tummy": {
        component: BabyTummy
      },
      bath: {
        component: Bath
      },
      bowl: {
        component: Bowl
      },
      diaper: {
        component: Diaper
      },
      health: {
        component: Health
      },
      L: {
        component: L
      },
      "measuring-tape": {
        component: MeasuringTape
      },
      medication: {
        component: Medication
      },
      pee: {
        component: Pee
      },
      peepoo: {
        component: PeePoo
      },
      poo: {
        component: Poo
      },
      pump: {
        component: Pump
      },
      "pump-l": {
        component: PumpL
      },
      "pump-r": {
        component: PumpR
      },
      "pump-b": {
        component: PumpB
      },
      R: {
        component: R
      },
      ruler: {
        component: Ruler
      },
      stroller: {
        component: Stroller
      },
      syringe: {
        component: Syringe
      },
      thermometer: {
        component: Thermometer
      },
      weight: {
        component: Weight
      },
      "zzz-sleep": {
        component: ZzzSleep
      }
    }
  }
});

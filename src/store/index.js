import Vue from "vue";
import Vuex from "vuex";
import { nanoid } from "nanoid";
import moment from "moment";
import DatabaseService from "../services/Database";
import recordSchema from "../schemas/record";
import childSchema from "../schemas/child";

Vue.use(Vuex);

const BABY_TRACKER_ACTIVE_CHILD_ID = "BABY_TRACKER_ACTIVE_CHILD_ID";
const BABY_TRACKER_REMOTE_URL = "BABY_TRACKER_REMOTE_URL";
const BABY_TRACKER_UNITS = "BABY_TRACKER_UNITS";
const BABY_TRACKER_TYPES_ORDER = "BABY_TRACKER_TYPES_ORDER";

const default_units = {
  weight: "kg",
  length: "cm",
  volume: "ml",
  temperature: "°C"
};
let units = localStorage.getItem(BABY_TRACKER_UNITS) || {};
if (units) {
  try {
    units = JSON.parse(units);
  } catch (e) {
    units = {};
  }
}
units = Object.assign({}, default_units, units);

let typesOrder = localStorage.getItem(BABY_TRACKER_TYPES_ORDER);
try {
  typesOrder = JSON.parse(typesOrder || "[]");
} catch (e) {
  typesOrder = [];
}

const store = new Vuex.Store({
  state: {
    ui: {
      showTypeDialog: false,
      showRecordDialog: false,
      showAlarmDialog: false,
      dialogMaxWidth: 600,
      dialogFullscreenMaxWidth: 1024,
      unitsIcon: {
        weight: "mdi-weight",
        length: "mdi-ruler",
        volume: "mdi-water",
        temperature: "mdi-thermometer"
      }
    },
    user: {
      id: "logged in id?"
    },
    loaded: false,
    activeChildId: localStorage.getItem(BABY_TRACKER_ACTIVE_CHILD_ID),
    remoteURL: localStorage.getItem(BABY_TRACKER_REMOTE_URL),
    syncStatus: {
      records: false,
      children: false
    },
    children: [],
    alarms: [],
    records: [],
    timers: [],
    config: {
      units,
      unitsIncrements: {
        weight: 0.01,
        length: 0.5,
        volume: 5,
        temperature: 0.5
      },
      typesOrder,
      types: [
        {
          id: "FEEDING",
          name: "Feeding",
          icon: "$baby-bottle",
          color: "#fdb74d",
          colorLight: "#ffe0b2",
          colorDark: "#ec9d24",
          subtypes: [
            {
              id: "LEFT_BREAST",
              name: "Left",
              icon: "$L",
              withTimer: true
            },
            {
              id: "RIGHT_BREAST",
              name: "Right",
              icon: "$R",
              withTimer: true
            },
            {
              id: "BOTTLE",
              name: "Bottle",
              icon: "$baby-bottle",
              withTimer: true,
              withAmount: true,
              unit: "volume",
              defaultValue: 0,
              category: ["Breast milk", "Formula"] // TODO support?
            },
            {
              id: "MEAL",
              name: "Meal",
              icon: "$bowl",
              askDetail: true
            }
          ]
        },
        {
          id: "SLEEPING",
          name: "Sleep",
          icon: "$zzz-sleep",
          color: "#48a0dc",
          colorLight: "#9dcff2",
          colorDark: "#2789cf",
          subtypes: [
            {
              id: "SLEEPING",
              name: "Sleep",
              icon: "$zzz-sleep",
              withTimer: true
            }
          ]
        },
        {
          id: "DIAPERING",
          name: "Diapering",
          icon: "$diaper",
          color: "#7a62c9",
          colorLight: "#c3b9e4",
          colorDark: "#5d43b2",
          subtypes: [
            {
              id: "PEE",
              name: "Pee",
              icon: "$pee"
            },
            {
              id: "POO",
              name: "Poo",
              icon: "$poo"
            },
            {
              id: "PEEPOO",
              name: "Both",
              icon: "$peepoo"
            }
          ]
        },
        {
          id: "LEISURE",
          name: "Leisure",
          icon: "$alphabet",
          color: "#17c6cc",
          colorLight: "#c1f3f5",
          colorDark: "#129ea3",
          subtypes: [
            {
              id: "LEISURE_TUMMY",
              name: "Tummy time",
              icon: "$baby-tummy",
              withTimer: true
            },
            {
              id: "LEISURE_PLAY",
              name: "Play time",
              icon: "$alphabet",
              withTimer: true
            },
            {
              id: "LEISURE_WALK",
              name: "Outdoors",
              icon: "$stroller",
              withTimer: true
            },
            {
              id: "LEISURE_BATH",
              name: "Bath time",
              icon: "$bath",
              withTimer: true
            }
          ]
        },
        {
          id: "GROWTH",
          name: "Growth",
          icon: "$weight",
          color: "#52c772",
          colorLight: "#b2edc2",
          colorDark: "#42a15c",
          subtypes: [
            {
              id: "GROWTH_WEIGHT",
              name: "Weight",
              icon: "$weight",
              withAmount: true,
              unit: "weight"
            },
            {
              id: "GROWTH_HEIGHT",
              name: "Height",
              icon: "$ruler",
              withAmount: true,
              unit: "length"
            },
            {
              id: "GROWTH_HEAD",
              name: "Head",
              icon: "$measuring-tape",
              withAmount: true,
              unit: "length"
            }
          ]
        },
        {
          id: "PUMP",
          name: "Pumping",
          icon: "$pump",
          color: "#ff9259",
          colorLight: "#ffceb5",
          colorDark: "#db7e4d",
          subtypes: [
            {
              id: "PUMP_LEFT",
              name: "Left",
              icon: "$pump-l",
              withTimer: true,
              withAmount: true,
              unit: "volume"
            },
            {
              id: "PUMP_RIGHT",
              name: "Right",
              icon: "$pump-r",
              withTimer: true,
              withAmount: true,
              unit: "volume"
            },
            {
              id: "PUMP_BOTH",
              name: "Both",
              icon: "$pump-b",
              withTimer: true,
              withAmount: true,
              unit: "volume"
            }
          ]
        },
        {
          id: "HEALTH",
          name: "Health",
          icon: "$health",
          color: "#fd7059",
          colorLight: "#fdd4cd",
          colorDark: "#f15540",
          subtypes: [
            {
              id: "HEALTH_MEDICATIONS",
              name: "Medication",
              icon: "$medication",
              askDetail: true
            },
            {
              id: "HEALTH_TEMPERATURE",
              name: "Temperature",
              icon: "$thermometer",
              askDetail: true,
              withAmount: true,
              unit: "temperature"
            },
            {
              id: "HEALTH_VACCINATIONS",
              name: "Vaccination",
              icon: "$syringe",
              askDetail: true
            }
          ]
        }
      ]
    }
  },
  getters: {
    typeLookup(state) {
      return state.config.types.reduce((dict, type) => {
        dict[type.id] = type;
        return dict;
      }, {});
    },
    subtypeLookup(state) {
      return state.config.types.reduce((dict, type) => {
        type.subtypes.reduce((dict, subtype) => {
          dict[subtype.id] = subtype;
          return dict;
        }, dict);
        return dict;
      }, {});
    },
    typesSorted(state) {
      const typesSorted = [];
      const availableTypes = state.config.types.slice(0);
      state.config.typesOrder.forEach((typeId) => {
        const index = availableTypes.findIndex((type) => type.id === typeId);
        if (index >= 0) {
          typesSorted.push(availableTypes.splice(index, 1)[0]);
        }
      });
      availableTypes.forEach((type) => {
        typesSorted.push(type);
      });
      return typesSorted;
    },
    activeChild(state) {
      return state.children.find((child) => child.id === state.activeChildId);
    },
    timers(state) {
      return state.records.filter((record) => record && record.timer);
    },
    latestActivityByType(state) {
      // based on hypothesis that records is already sorted desc and filtered by active child
      // latest record foreach type, stop when found one of each
      const latestActivities = {};
      const notSeenTypes = state.config.types.map((type) => type.id);
      for (let i = 0; i < state.records.length; i++) {
        const record = state.records[i];
        if (!record || record.timer) continue;
        const index = notSeenTypes.indexOf(record.type);
        if (index >= 0) {
          latestActivities[record.type] = record;
          notSeenTypes.splice(index, 1);
          if (notSeenTypes.length === 0) {
            break;
          }
        }
      }
      return latestActivities;
    },
    latestActivityBySubtype(state, getters) {
      // based on hypothesis that records is already sorted desc and filtered by active child
      // latest record foreach type, stop when found one of each
      const latestActivities = {};
      const notSeenSubtypes = Object.keys(getters.subtypeLookup);
      for (let i = 0; i < state.records.length; i++) {
        const record = state.records[i];
        if (!record || record.timer) continue;
        const index = notSeenSubtypes.indexOf(record.subtype);
        if (index >= 0) {
          latestActivities[record.subtype] = record;
          notSeenSubtypes.splice(index, 1);
          if (notSeenSubtypes.length === 0) {
            break;
          }
        }
      }
      return latestActivities;
    },
    alarms(state, getters) {
      return (getters.activeChild && getters.activeChild.alarms) || [];
    },
    activeAlarms(state, getters) {
      return getters.alarms.reduce((activeAlarms, alarm) => {
        if (!alarm.enabled) {
          return activeAlarms;
        }
        let latest;
        if (alarm.subtype && alarm.details) {
          latest = state.records.find((record) => {
            return (
              record.subtype === alarm.subtype &&
              record.details === alarm.details
            );
          });
        } else if (alarm.subtype) {
          latest = getters.latestActivityBySubtype[alarm.subtype];
        } else {
          latest = getters.latestActivityByType[alarm.type];
        }
        if (!latest) {
          activeAlarms.push(alarm);
          return activeAlarms;
        }
        if (alarm.intervalType === "d") {
          const latestDay = new Date(latest.fromDate);
          latestDay.setHours(0, 0, 0, 0, 0);
          const todayDay = new Date();
          todayDay.setHours(0, 0, 0, 0, 0);
          const diffDays =
            (todayDay.getTime() - latestDay.getTime()) / (24 * 3600 * 1000);
          if (diffDays - alarm.intervalAmount >= 0) {
            activeAlarms.push(alarm);
          }
        }
        if (alarm.intervalType === "h") {
          const durationToNext =
            new Date(latest.fromDate).getTime() +
            alarm.intervalAmount * 3600 * 1000 -
            new Date().getTime();
          alarm.durationToNext = durationToNext;
          alarm.durationToNextText = moment
            .duration(durationToNext)
            .humanize(true);
          if (alarm.durationToNext < 0) {
            alarm.durationToNextText =
              "Late by " + moment.duration(durationToNext).humanize();
          }

          activeAlarms.push(alarm);
        }
        return activeAlarms;
      }, []);
    }
  },
  mutations: {
    updateUI(state, payload) {
      state.ui = Object.assign({}, state.ui, payload);
    },
    setRecords(state, records) {
      state.records = records;
    },
    setTimers(state, timers) {
      state.timers = timers;
    },
    setChildren(state, children) {
      state.children = children;
      if (
        children.length > 0 &&
        !children.map((child) => child.id).includes(state.activeChildId)
      ) {
        state.activeChildId = children[0].id;
      }
      state.loaded = true;
    },
    setActiveChildId(state, id) {
      state.activeChildId = id;
      localStorage.setItem(BABY_TRACKER_ACTIVE_CHILD_ID, id);
    },
    setRemoteURL(state, url) {
      state.remoteURL = url;
      localStorage.setItem(BABY_TRACKER_REMOTE_URL, url);
    },
    setSyncStatus(state, payload) {
      state.syncStatus = Object.assign({}, state.syncStatus, payload);
    },
    setUnits(state, payload) {
      state.config.units = Object.assign({}, state.config.units, payload);
      localStorage.setItem(
        BABY_TRACKER_UNITS,
        JSON.stringify(state.config.units)
      );
    },
    setTypesOrder(state, payload) {
      state.config.typesOrder = payload;
      localStorage.setItem(
        BABY_TRACKER_TYPES_ORDER,
        JSON.stringify(state.config.typesOrder)
      );
    }
  },
  actions: {
    async createRecord(context, data) {
      if (!data.fromDate) {
        data.fromDate = new Date().toISOString();
      }
      if (
        data.subtype &&
        !data.toDate &&
        context.getters.subtypeLookup[data.subtype].withTimer
      ) {
        data.timer = true;
      }

      const db = await DatabaseService.get();
      data.id = "id" + nanoid(); // because not allowed to start with _
      data.childId = context.state.activeChildId;
      return db.records.newDocument(data);
    },
    async upsertRecord(context, data) {
      const db = await DatabaseService.get();
      const filteredData = {};
      for (let key in data) {
        if (recordKeys.includes(key)) {
          filteredData[key] = data[key] ? data[key] : undefined;
        }
      }
      return db.records.atomicUpsert(filteredData);
    },
    async removeRecord(context, data) {
      const db = await DatabaseService.get();
      return db.records
        .findOne({
          selector: { id: data.id }
        })
        .remove();
    },
    async createChild(context, data) {
      const db = await DatabaseService.get();
      data.id = "id" + nanoid(); // because not allowed to start with _
      return db.children.newDocument(data);
    },
    async upsertChild(context, data) {
      const db = await DatabaseService.get();
      const filteredData = {};
      for (let key in data) {
        if (childKeys.includes(key)) {
          filteredData[key] = data[key] ? data[key] : undefined;
        }
      }
      context.dispatch("setActiveChildId", filteredData.id);
      return db.children.atomicUpsert(filteredData);
    },
    async removeChild(context, data) {
      const db = await DatabaseService.get();
      return db.children
        .findOne({
          selector: { id: data.id }
        })
        .remove();
      // TODO: #4 remove and purge records belonging to child
    },
    setActiveChildId(context, id) {
      context.commit("setActiveChildId", id);
      context.dispatch("subscribeDB");
    },
    async getRecordsOfDay(context, day) {
      const db = await DatabaseService.get();
      return db.records.find({
        selector: {
          childId: context.state.activeChildId,
          fromDate: { $regex: `${day.slice(0, 10)}.*` }
        },
        sort: [{ fromDate: "asc" }]
      });
    },
    async subscribeDB(context) {
      const db = await DatabaseService.get();
      if (subRecords) {
        subRecords.unsubscribe();
      }
      subRecords = db.records
        .find({
          selector: {
            childId: context.state.activeChildId
          },
          sort: [{ fromDate: "desc" }]
        })
        .$.subscribe((records) => {
          context.commit("setRecords", records);
        });

      if (subChildren) {
        subChildren.unsubscribe();
      }
      subChildren = db.children
        .find({
          selector: {},
          sort: [{ name: "asc" }]
        })
        .$.subscribe((children) => {
          context.commit("setChildren", children);
        });

      if (subTimers) {
        subTimers.unsubscribe();
      }
      subTimers = db.records
        .find({
          selector: {
            timer: true,
            childId: context.state.activeChildId
          },
          sort: [{ fromDate: "desc" }]
        })
        .$.subscribe((timers) => {
          context.commit("setTimers", timers);
        });
    },
    setRemoteURL(context, url) {
      context.commit("setRemoteURL", url);
      context.dispatch("sync");
    },
    async sync(context) {
      const db = await DatabaseService.get();
      if (syncChildren) {
        syncChildren.cancel();
      }
      if (context.state.remoteURL) {
        syncChildren = await db.children.sync({
          remote: `${context.state.remoteURL}-children`
        });
        syncChildren.alive$.subscribe((alive) => {
          context.commit("setSyncStatus", {
            children: alive
          });
        });
      }
      if (syncRecords) {
        syncRecords.cancel();
      }
      if (context.state.remoteURL) {
        syncRecords = await db.records.sync({
          remote: `${context.state.remoteURL}-records`
        });
        syncRecords.alive$.subscribe((alive) => {
          context.commit("setSyncStatus", {
            records: alive
          });
        });
      }
    }
  },
  modules: {}
});

const recordKeys = Object.keys(recordSchema.properties);
const childKeys = Object.keys(childSchema.properties);
let subChildren;
let subRecords;
let subTimers;
let syncChildren;
let syncRecords;
store.dispatch("subscribeDB");
if (store.state.remoteURL) {
  store.dispatch("sync");
}
export default store;

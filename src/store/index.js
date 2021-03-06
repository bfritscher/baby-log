import Vue from "vue";
import Vuex from "vuex";
import { nanoid } from "nanoid";
import chroma from "chroma-js";
import humanizeDuration from "humanize-duration";
import DatabaseService from "../services/Database";
import recordSchema from "../schemas/record";
import childSchema from "../schemas/child";
import * as Sentry from "@sentry/browser";
import {
  getFromDBServer,
  createProxyRecordObject
} from "../services/liteModeApi";

Vue.use(Vuex);

const BABY_TRACKER_ACTIVE_CHILD_ID = "BABY_TRACKER_ACTIVE_CHILD_ID";
const BABY_TRACKER_REMOTE_URL = "BABY_TRACKER_REMOTE_URL";
const BABY_TRACKER_UNITS = "BABY_TRACKER_UNITS";
const BABY_TRACKER_TYPES_ORDER = "BABY_TRACKER_TYPES_ORDER";
const BABY_TRACKER_DIALOG_TYPE = "BABY_TRACKER_DIALOG_TYPE";
const BABY_TRACKER_DARK_MODE = "BABY_TRACKER_DARK_MODE";
const BABY_TRACKER_LITE_MODE = "BABY_TRACKER_LITE_MODE";

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
      lastUpdate: new Date().getTime(),
      showTypeDialog: JSON.parse(
        localStorage.getItem(BABY_TRACKER_DIALOG_TYPE) || "false"
      ),
      darkMode: JSON.parse(
        localStorage.getItem(BABY_TRACKER_DARK_MODE) ||
          `${
            window.matchMedia
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
              : false
          }`
      ),
      liteMode: JSON.parse(
        localStorage.getItem(BABY_TRACKER_LITE_MODE) || "false"
      ),
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
    loadedRecords: false,
    loadedChildren: false,
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
            },
            {
              id: "HEALTH_CHECK",
              name: "Check",
              icon: "$stethoscope",
              askDetail: true
            }
          ]
        }
      ]
    }
  },
  getters: {
    subtypesColor(state) {
      return state.config.types.reduce((subtypesColor, type) => {
        const stopColor = chroma(
          chroma(type.color).get("lch.h"),
          24,
          35,
          "hcl"
        ).hex();
        const nb = type.subtypes.length;
        const colors = chroma
          .scale([type.color, stopColor])
          .mode("lch")
          .colors(nb);
        return type.subtypes.reduce((subtypesColor, subtype, i) => {
          subtypesColor[subtype.id] = colors[i];
          return subtypesColor;
        }, subtypesColor);
      }, {});
    },
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
      console.log("typesSorted");
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
      return (
        state.children.find((child) => child.id === state.activeChildId) || {}
      );
    },
    latestActivityByType(state) {
      console.log("latestActivityByType");
      const transaction = Sentry.startTransaction({
        name: "latestActivityByType"
      });
      const span = transaction.startChild({ op: "latestActivityByType" });
      // based on hypothesis that records is already sorted desc and filtered by active child
      // latest record foreach type, stop when found one of each
      const minDate = new Date(
        new Date().getTime() - 1000 * 3600 * 24 * 31
      ).toISOString();
      const latestActivities = {};
      const notSeenTypes = state.config.types.map((type) => type.id);
      for (let i = 0; i < state.records.length; i++) {
        const record = state.records[i];
        if (!record || record.timer) continue;
        if (record.fromDate < minDate) break;
        const index = notSeenTypes.indexOf(record.type);
        if (index >= 0) {
          latestActivities[record.type] = record;
          notSeenTypes.splice(index, 1);
          if (notSeenTypes.length === 0) {
            break;
          }
        }
      }
      span.finish();
      transaction.finish();
      return latestActivities;
    },
    latestActivityBySubtype(state, getters) {
      console.log("latestActivityBySubtype");
      const transaction = Sentry.startTransaction({
        name: "latestActivityBySubtype"
      });
      const span = transaction.startChild({ op: "latestActivityBySubtype" });
      // based on hypothesis that records is already sorted desc and filtered by active child
      // latest record foreach type, stop when found one of each
      const minDate = new Date(
        new Date().getTime() - 1000 * 3600 * 24 * 31
      ).toISOString();
      const latestActivities = {};
      const notSeenSubtypes = Object.keys(getters.subtypeLookup);
      for (let i = 0; i < state.records.length; i++) {
        const record = state.records[i];
        if (!record || record.timer) continue;
        if (record.fromDate < minDate) break;
        const index = notSeenSubtypes.indexOf(record.subtype);
        if (index >= 0) {
          latestActivities[record.subtype] = record;
          notSeenSubtypes.splice(index, 1);
          if (notSeenSubtypes.length === 0) {
            break;
          }
        }
      }
      span.finish();
      transaction.finish();
      return latestActivities;
    },
    alarms(state, getters) {
      return (getters.activeChild && getters.activeChild.alarms) || [];
    },
    activeAlarms(state, getters) {
      const transaction = Sentry.startTransaction({
        name: "activeAlarms"
      });
      const span = transaction.startChild({ op: "activeAlarms" });
      const activeAlarms = getters.alarms.reduce((activeAlarms, alarm) => {
        if (!alarm.enabled) {
          return activeAlarms;
        }
        let latest;
        if (alarm.subtype && alarm.details) {
          if (
            state.timers.find(
              (timer) =>
                timer.subtype === alarm.subtype &&
                timer.details === alarm.details
            )
          ) {
            return activeAlarms;
          }
          latest = state.records.find((record) => {
            return (
              record.subtype === alarm.subtype &&
              record.details === alarm.details
            );
          });
        } else if (alarm.subtype) {
          if (state.timers.find((timer) => timer.subtype === alarm.subtype)) {
            return activeAlarms;
          }
          latest = getters.latestActivityBySubtype[alarm.subtype];
        } else {
          if (state.timers.find((timer) => timer.type === alarm.type)) {
            return activeAlarms;
          }

          let latestActivity = null;
          for (let i = 0; i < state.records.length; i++) {
            const record = state.records[i];
            if (!record || record.timer) continue;
            if (record.type === alarm.type) {
              if (latestActivity) {
                const durationSinceEnd =
                  new Date(latestActivity.fromDate) - new Date(record.toDate);
                if (durationSinceEnd > 10 * 60 * 1000) {
                  break;
                }
              }
              latestActivity = record;
            }
          }
          latest = latestActivity;
        }
        if (!latest) {
          activeAlarms.push(alarm);
          return activeAlarms;
        }
        if (alarm.intervalType === "d") {
          const latestDay = new Date(latest.fromDate);
          latestDay.setHours(0, 0, 0, 0);
          const todayDay = new Date();
          todayDay.setHours(0, 0, 0, 0);
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
          alarm.durationToNextText =
            "in " +
            humanizeDuration(durationToNext, {
              units: ["y", "mo", "w", "d", "h", "m"],
              round: true
            });
          if (alarm.durationToNext < 0) {
            alarm.durationToNextText = "Late by " + alarm.durationToNextText;
          }

          activeAlarms.push(alarm);
        }
        return activeAlarms;
      }, []);

      span.finish();
      transaction.finish();
      return activeAlarms;
    }
  },
  mutations: {
    updateUI(state, payload) {
      state.ui = Object.assign({}, state.ui, payload);
      if (Object.prototype.hasOwnProperty.call(payload, "showTypeDialog")) {
        localStorage.setItem(
          BABY_TRACKER_DIALOG_TYPE,
          JSON.stringify(payload.showTypeDialog)
        );
      }
      if (Object.prototype.hasOwnProperty.call(payload, "liteMode")) {
        localStorage.setItem(
          BABY_TRACKER_LITE_MODE,
          JSON.stringify(payload.liteMode)
        );
      }
      if (Object.prototype.hasOwnProperty.call(payload, "darkMode")) {
        localStorage.setItem(
          BABY_TRACKER_DARK_MODE,
          JSON.stringify(payload.darkMode)
        );
      }
    },
    setRecords(state, records) {
      state.records = records;
      state.loadedRecords = true;
    },
    setTimers(state, timers) {
      state.timers = timers;
      navigator.setAppBadge(timers.length);
    },
    setChildren(state, children) {
      state.children = children;
      if (
        children.length > 0 &&
        !children.map((child) => child.id).includes(state.activeChildId)
      ) {
        state.activeChildId = children[0].id;
      }
      state.loadedChildren = true;
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
        context.getters.subtypeLookup[data.subtype].withTimer &&
        !Object.prototype.hasOwnProperty.call(data, "timer")
      ) {
        data.timer = true;
      }
      data.id = "id" + nanoid(); // because not allowed to start with _
      data.childId = context.state.activeChildId;
      if (context.state.ui.liteMode) {
        return createProxyRecordObject(context, data);
      } else {
        const db = await DatabaseService.get();
        return db.records.newDocument(data);
      }
    },
    async upsertRecord(context, data) {
      if (context.state.ui.liteMode) {
        return {}; // TODO: fix
      } else {
        const db = await DatabaseService.get();
        const filteredData = {};
        for (let key in data) {
          if (recordKeys.includes(key)) {
            filteredData[key] = data[key] ? data[key] : undefined;
          }
        }
        return db.records.atomicUpsert(filteredData);
      }
    },
    async removeRecord(context, data) {
      if (context.state.ui.liteMode) {
        return; // TODO fix;
      } else {
        const db = await DatabaseService.get();
        return db.records
          .findOne({
            selector: { id: data.id }
          })
          .remove();
      }
    },
    async createChild(context, data) {
      if (context.state.ui.liteMode) {
        return {}; // TODO fix;
      } else {
        const db = await DatabaseService.get();
        data.id = "id" + nanoid(); // because not allowed to start with _
        return db.children.newDocument(data);
      }
    },
    async upsertChild(context, data) {
      if (context.state.ui.liteMode) {
        return {}; // TODO fix;
      } else {
        const db = await DatabaseService.get();
        const filteredData = {};
        for (let key in data) {
          if (childKeys.includes(key)) {
            filteredData[key] = data[key] ? data[key] : undefined;
          }
        }
        context.dispatch("setActiveChildId", filteredData.id);
        return db.children.atomicUpsert(filteredData);
      }
    },
    async removeChild(context, data) {
      if (context.state.ui.liteMode) {
        return; // TODO fix;
      } else {
        const db = await DatabaseService.get();
        return db.children
          .findOne({
            selector: { id: data.id }
          })
          .remove();
        // TODO: #4 remove and purge records belonging to child
      }
    },
    setActiveChildId(context, id) {
      context.commit("setActiveChildId", id);
      context.dispatch("subscribeDB");
    },
    async getRecordsOfDay(context, day) {
      if (context.state.ui.liteMode) {
        const data = await getFromDBServer(
          context.state.remoteURL,
          "-records/_find",
          {
            selector: {
              childId: {
                $eq: context.state.activeChildId
              },
              fromDate: { $regex: `${day.slice(0, 10)}.*` }
            },
            limit: 99999,
            sort: [{ fromDate: "asc" }]
          }
        );
        return data.docs;
      } else {
        const db = await DatabaseService.get();
        return db.records.find({
          selector: {
            childId: context.state.activeChildId,
            fromDate: { $regex: `${day.slice(0, 10)}.*` }
          },
          sort: [{ fromDate: "asc" }]
        });
      }
    },
    async subscribeDB(context) {
      if (context.state.ui.liteMode) {
        context.dispatch("sync");
        return;
      }
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
      if (context.state.remoteURL) {
        context.dispatch("sync");
      }
    },
    setRemoteURL(context, url) {
      context.commit("setRemoteURL", url);
      context.dispatch("sync");
    },
    async sync(context) {
      if (context.state.ui.liteMode) {
        if (context.state.remoteURL) {
          // TODO: listen to changes for realtime? https://docs.couchdb.org/en/latest/api/database/changes.html#changes-eventsource
          getFromDBServer(context.state.remoteURL, "-records/_find", {
            selector: {
              childId: {
                $eq: context.state.activeChildId
              }
            },
            limit: 99999,
            sort: [{ fromDate: "desc" }]
          }).then((data) => {
            context.commit("setRecords", data.docs);
          });

          getFromDBServer(context.state.remoteURL, "-children/_find", {
            selector: {},
            sort: [{ name: "asc" }]
          }).then((data) => {
            context.commit(
              "setChildren",
              data.docs.map((c) => {
                c.id = c._id;
                return c;
              })
            );
          });

          getFromDBServer(context.state.remoteURL, "-records/_find", {
            selector: {
              childId: {
                $eq: context.state.activeChildId
              },
              timer: {
                $eq: true
              }
            },
            limit: 99999,
            sort: [{ fromDate: "desc" }],
            use_index: "_design/idx-timers"
          }).then((data) => {
            context.commit(
              "setTimers",
              data.docs.map((t) => createProxyRecordObject(context, t))
            );
          });
        }
        return;
      }
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
export default store;

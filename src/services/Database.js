import moment from "moment";

import { createRxDatabase, addRxPlugin } from "rxdb/plugins/core";

import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";

if (process.env.NODE_ENV === "development") {
  // in dev-mode we add the dev-mode plugin
  // which does many checks and adds full error messages
  addRxPlugin(RxDBDevModePlugin);
}

import * as PouchdbAdapterIdb from "pouchdb-adapter-idb";
addRxPlugin(PouchdbAdapterIdb);

import { RxDBValidatePlugin } from "rxdb/plugins/validate";
addRxPlugin(RxDBValidatePlugin);

import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
addRxPlugin(RxDBLeaderElectionPlugin);

import { RxDBReplicationPlugin } from "rxdb/plugins/replication";
addRxPlugin(RxDBReplicationPlugin);

import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
addRxPlugin(RxDBJsonDumpPlugin);

import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
addRxPlugin(RxDBMigrationPlugin);

// always needed for replication with the node-server

import * as PouchdbAdapterHttp from "pouchdb-adapter-http";
addRxPlugin(PouchdbAdapterHttp);

import recordSchema from "../schemas/record";
import childSchema from "../schemas/child";

async function _create() {
  const db = await createRxDatabase({
    name: "babytracker",
    adapter: "idb"
  });
  window.db = db; // write to window for debugging

  await db.addCollections({
    records: {
      schema: recordSchema,
      methods: {
        time() {
          return moment(this.fromDate).format("HH:mm");
        },
        durationRaw() {
          return moment(this.toDate).diff(this.fromDate);
        },
        duration() {
          if (!this.toDate) {
            return "";
          }
          return moment
            .duration(moment(this.toDate).diff(this.fromDate))
            .humanize();
        }
      }
    },
    children: {
      schema: childSchema
    }
  });
  return db;
}

const DatabaseService = {
  DB_CREATE_PROMISE: _create(),
  get() {
    return this.DB_CREATE_PROMISE;
  }
};

export default DatabaseService;

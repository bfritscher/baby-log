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
import { nanoid } from "nanoid";

async function _create() {
  const db = await createRxDatabase({
    name: "babytracker",
    adapter: "idb"
  });
  console.log("RXDB created");
  window.db = db; // write to window for debugging

  await db.addCollections({
    records: {
      schema: recordSchema,
      migrationStrategies: {
        1(d) {
          return d;
        }
      }
    },
    children: {
      schema: childSchema,
      migrationStrategies: {
        1(d) {
          return d;
        },
        2(d) {
          d.alarms.forEach((a) => {
            delete a.enable;
            if (!a.id) {
              a.id = nanoid();
            }
          });
          return d;
        }
      }
    }
  });
  return db;
}

const DatabaseService = {
  DB_CREATE_PROMISE: undefined,
  get() {
    if (!this.DB_CREATE_PROMISE) {
      this.DB_CREATE_PROMISE = _create();
    }
    return this.DB_CREATE_PROMISE;
  }
};

export default DatabaseService;

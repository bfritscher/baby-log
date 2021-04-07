function makeHeaders(remoteURL) {
  const authString = remoteURL.match(/\/\/(.*?)@/)[1];
  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(authString));
  headers.set("Content-Type", "application/json");
  return headers;
}

function makeUrl(remoteURL) {
  return remoteURL.replace(/\/\/(.*?)@/, "//");
}

export function getFromDBServer(remoteURL, urlPostfix, query) {
  const headers = makeHeaders(remoteURL);
  return fetch(`${makeUrl(remoteURL)}${urlPostfix}`, {
    method: "POST",
    headers,
    body: JSON.stringify(query)
  }).then((r) => r.json());
}

export function getFromApiServer(remoteURL, url) {
  const headers = makeHeaders(remoteURL);
  const dbUrl = makeUrl(remoteURL);
  headers.set("x-url", dbUrl);
  return fetch(url, {
    method: "GET",
    headers
  }).then((r) => r.json());
}

function sendToDbServer(remoteURL, urlPostfix, document) {
  const headers = makeHeaders(remoteURL);
  const dbUrl = makeUrl(remoteURL);
  return fetch(`${dbUrl}${urlPostfix}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(document)
  }).then((r) => r.json());
}

function fixId(data) {
  if (data.id) {
    data._id = data.id;
    delete data.id;
  }
}

export function createProxyRecordObject(store, originalData) {
  const record = Object.assign(
    {
      save() {
        const data = Object.assign({}, this);
        fixId(data);
        store.commit("setRecords", [this].concat(store.state.records));
        return sendToDbServer(
          store.state.remoteURL,
          `-records/${data._id}`,
          data
        ).then((r) => {
          this._rev = r.rev;
        });
      },
      atomicPatch(update) {
        const data = Object.assign({}, this, update);
        fixId(data);
        return sendToDbServer(
          store.state.remoteURL,
          `-records/${data._id}`,
          data
        ).then(() => {
          Object.assign(
            store.state.records.find(
              (r) => r.id === data._id || r._id === data._id
            ),
            update
          );
        });
      }
    },
    originalData
  );
  return record;
}

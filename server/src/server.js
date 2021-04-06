import express from "express";
import cors from "cors";
import createTimline from "../../src/services/timeline.mjs";
import fetch from "node-fetch";
const app = express();
const PORT = 80;

app.use(cors());

app.get("/timeline/:childId/:type/:nbDaysHistory", function (req, res, next) {
  console.log(req.headers, req.params);
  const url = req.headers["x-url"];
  // get records
  fetch(`${url}-records/_find`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization
    },
    body: JSON.stringify({
      selector: {
        childId: {
          $eq: req.params.childId
        }
      },
      limit: 99999, // TODO: adapt to page?
      sort: [{ fromDate: "desc" }]
    })
  })
    .then((r) => r.json())
    .then((data) => {
      const records = data.docs;
      const timelineRecordsPaged = createTimline(
        records,
        req.params.type,
        req.params.nbDaysHistory
      );
      res.json(timelineRecordsPaged);
    })
    .catch((err) => {
      next(err);
    });
});

app.listen(PORT, function () {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});

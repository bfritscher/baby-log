import { durationRaw } from "../filters/recordFilters";
import * as Sentry from "@sentry/browser";

function groupRecords(records) {
  console.log("groupRecords");
  const transaction = Sentry.startTransaction({
    name: "groupRecords"
  });
  const span = transaction.startChild({ op: "groupRecords" });
  const groupedRecords = records.reduce((group, record) => {
    if (!Object.prototype.hasOwnProperty.call(group, record.type)) {
      group[record.type] = {
        type: record.type,
        count: 0,
        totalDuration: 0,
        totalAmount: 0,
        subtypes: {}
      };
    }
    if (
      !Object.prototype.hasOwnProperty.call(
        group[record.type].subtypes,
        record.subtype
      )
    ) {
      group[record.type].subtypes[record.subtype] = {
        subtype: record.subtype,
        count: 0,
        totalDuration: 0,
        totalAmount: 0
      };
    }
    group[record.type].count += 1;
    group[record.type].subtypes[record.subtype].count += 1;
    if (record.toDate) {
      const duration = durationRaw(record);
      group[record.type].totalDuration += duration;
      group[record.type].subtypes[record.subtype].totalDuration += duration;
    }
    if (record.amount && record.unit === "ml") {
      group[record.type].totalAmount += record.amount;
      group[record.type].subtypes[record.subtype].amount += record.amount;
    }
    return group;
  }, {});
  span.finish();
  transaction.finish();
  return groupedRecords;
}

export default groupRecords;

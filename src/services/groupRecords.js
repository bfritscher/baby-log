function groupRecords(records) {
  return records.reduce((group, record) => {
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
      const duration = record.durationRaw();
      group[record.type].totalDuration += duration;
      group[record.type].subtypes[record.subtype].totalDuration += duration;
    }
    if (record.amount && record.unit === "ml") {
      group[record.type].totalAmount += record.amount;
      group[record.type].subtypes[record.subtype].amount += record.amount;
    }
    return group;
  }, {});
}

export default groupRecords;

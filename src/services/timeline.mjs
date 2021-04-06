import moment from "moment";
import humanizeDuration from "humanize-duration";

export default function createTimline(records, typeId, nbDaysHistory) {
  let lastDateTime = new Date();
  const today = new Date(new Date().toDateString());
  let dayRecords = [];
  const days = [
    {
      day: "Today",
      records: dayRecords
    }
  ];

  let dayNb = 0;
  for (let record of records) {
    // skip if not same type
    if (record.timer || record.type !== typeId) continue;

    let currentDateTime = new Date(record.fromDate);
    if (
      currentDateTime.getFullYear() !== lastDateTime.getFullYear() ||
      currentDateTime.getMonth() !== lastDateTime.getMonth() ||
      currentDateTime.getDate() !== lastDateTime.getDate()
    ) {
      dayNb++;
      if (dayNb > nbDaysHistory) break;
      const dateDiff = today - new Date(currentDateTime.toDateString());
      let dateFormat = "Do MMMM, dddd";
      if (today.getFullYear() !== currentDateTime.getFullYear()) {
        dateFormat += " YYYY";
      }
      let day = moment(currentDateTime).format(dateFormat);
      if (dateDiff === 24 * 3600 * 1000) {
        day = "Yesterday";
      }
      dayRecords = [];
      days.push({
        day,
        records: dayRecords
      });
    }
    let currentDateTimeEnd = currentDateTime;
    if (record.toDate) {
      currentDateTimeEnd = new Date(record.toDate);
    }
    const durationSinceEnd = lastDateTime - currentDateTimeEnd;
    const durationSinceStart = lastDateTime - currentDateTime;
    if (durationSinceEnd > 10 * 60 * 1000) {
      dayRecords.push({
        durationBetween: humanizeDuration(durationSinceStart, {
          units: ["y", "mo", "w", "d", "h", "m"],
          round: true
        })
      });
    }

    dayRecords.push(record);
    lastDateTime = currentDateTime;
  }
  const timelineRecordsPaged = days.filter((d) => d.records.length > 0);
  return timelineRecordsPaged;
}

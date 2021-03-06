import moment from "moment";
import humanizeDuration from "humanize-duration";

export function time(record) {
  return moment(record.fromDate).format("HH:mm");
}

export function durationRaw(record) {
  return (
    new Date(record.toDate).getTime() - new Date(record.fromDate).getTime()
  );
}

export function duration(record) {
  if (!record.toDate) {
    return "";
  }
  return humanizeDuration(durationRaw(record), {
    units: ["y", "mo", "w", "d", "h", "m"],
    round: true
  });
}

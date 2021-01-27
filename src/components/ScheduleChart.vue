<template>
  <div ref="chart"></div>
</template>
<script>
import * as d3 from "d3";
import { mapGetters } from "vuex";

function draw(node, records) {
  const data = records.map((r) => {
    r = r.toJSON();
    r.fromDate = new Date(r.fromDate);
    if (r.toDate) {
      r.toDate = new Date(r.toDate);
    }
    return r;
  });

  function startOfDaySeconds(date) {
    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  }

  const margin = { top: 70, right: 0, bottom: 0, left: 40 };

  const width = 954;

  const dateExtent = d3.extent(data, (d) => {
    const roundedDate = new Date(d.fromDate.getTime());
    roundedDate.setHours(0, 0, 0, 0, 0);
    return roundedDate;
  });

  dateExtent[1].setDate(dateExtent[1].getDate() + 1);
  const days = d3.timeDays(...dateExtent).reverse();

  const lineHeight = 12;
  const height = margin.top + margin.bottom + (days.length + 1) * lineHeight;

  const x = d3
    .scaleLinear()
    .domain([0, 24 * 60 * 60])
    .range([margin.left, width - margin.right]);
  const y = d3
    .scaleBand(days, [margin.top, height - margin.bottom])
    .round(true);

  function formatDay(d, i) {
    const formatMonth = d3.timeFormat("%b %-d");
    const formatDate = d3.timeFormat("%-d");
    return d.getDate() === 1 || i === 0 ? formatMonth(d) : formatDate(d);
  }
  function formatHour(d) {
    const hour = d / 3600;
    return hour;
    // TODO: #1 if locales US return hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : (hour % 12) + "";
  }

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${margin.top})`)
      .call(
        d3
          .axisTop(x)
          .tickFormat(formatHour)
          .tickValues(d3.range(24).map((t) => t * 3600))
      )
      .call((g) => g.select(".domain").remove());

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(formatDay))
      .call((g) => g.select(".domain").remove());

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("background", "white")
    .call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height]
        ])
        .scaleExtent([1, 8])
        .on("zoom", ({ transform }) => {
          g.attr("transform", transform);
        })
    );

  const g = svg.append("g").attr("cursor", "grab");

  g.append("g").call(xAxis);

  g.append("g").call(yAxis);

  // TODO: #1 us locale const formatDate = d3.timeFormat("%B %-d, %-I %p");
  const formatDate = d3.timeFormat("%-d %B, %H:%M");

  // TODO: #2 icons for events without duration
  // TODO: #3 legends
  g.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(startOfDaySeconds(d.fromDate)))
    .attr("y", (d) => y(d3.timeDay(d.fromDate)))
    .attr("width", (d) =>
      d.toDate
        ? Math.max(
            2,
            x(startOfDaySeconds(d.toDate)) - x(startOfDaySeconds(d.fromDate))
          ) - 1
        : 3
    )
    .attr("height", y.bandwidth() - 1)
    .attr("fill", (d) => this.typeLookup[d.type].color)
    .append("title")
    .text((d) => `${formatDate(d.fromDate)} ${d.type}`);
  node.innerHTML = "";
  node.append(svg.node());
}
export default {
  name: "ScheduleChart",
  props: ["type"],
  computed: {
    ...mapGetters(["typeLookup"]),
    records() {
      return this.$store.state.records.filter((r) =>
        this.type.id === "ALL" ? true : r.type === this.type.id
      );
    }
  },
  watch: {
    records() {
      this.draw(this.$refs.chart, this.records);
    }
  },
  mounted() {
    this.draw(this.$refs.chart, this.records);
  },
  methods: {
    draw
  }
};
</script>

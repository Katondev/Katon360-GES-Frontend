import React from "react"
import ReactApexChart from "react-apexcharts"

const StatasticsChart = () => {
  const series = [
    {
      name: "Active",
      data: [58, 74, 64, 50, 55, 60, 64, 74, 64, 68, 45, 34],
    },
    {
      name: "Inactive",
      data: [8, 6, 2, 8, 3, 6, 7, 9, 2, 5, 4, 5],
    },
  ]
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    colors: ["#34c38f", "#f46a6a"],
    xaxis: {
      categories: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ],
    },
    yaxis: {
      title: {
        text: "(students in numbers)",
      },
    },
    xaxis: {
      title: {
        text: "(standard)",
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        },
      },
    },
  }

  return (
    <ReactApexChart options={options} series={series} type="bar" height={400} />
  )
}

export default StatasticsChart

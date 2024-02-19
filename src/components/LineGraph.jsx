import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
const config = {
  legend: {
    display: false,
  },
  type: "line",
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "world Wide cases",
      },
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: true,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    x: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFomat: "ll",
        },
      },
    ],
    y: {
      display: true,
      gridLines: {
        display: false,
      },
      ticks: {
        //INclude a dollar sign in the ticks:
        callback: function (value, index, values) {
          return numeral(value).format("0a");
        },
      },
    },
  },
};
const LineGraph = ({ casesType }) => {
  const [data, setData] = useState({});
  const [data2, setData2] = useState({});
  const [data3, setData3] = useState({});

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data[casesType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      const url =
        "https://disease.sh/v3/covid-19/historical/all?lastdays=all?lastdays=120";
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          const chartData = buildChartData(data, "cases");
          const chartData2 = buildChartData(data, "recovered");
          const chartData3 = buildChartData(data, "deaths");
          setData2(chartData2);
          setData3(chartData3);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);
  return (
    <div>
      {data?.length > 0 &&
        (casesType === "cases" ? (
          <Line
            options={config}
            data={{
              datasets: [
                {
                  label: "Cases",
                  data: data,
                  backgroundColor: "rgba(5, 155, 247, 0.5)",
                  borderColor: "rgb(5, 155, 247)",
                  color: "#fff",
                },
              ],
            }}
          />
        ) : casesType === "deaths" ? (
          <Line
            options={config}
            data={{
              datasets: [
                {
                  label: "deaths",
                  data: data3,
                  backgroundColor: "rgba(204,16,52,0.5)",
                  borderColor: "#CC1034",
                },
              ],
            }}
          />
        ) : (
          <Line
            options={config}
            data={{
              datasets: [
                {
                  label: "Recovered",
                  data: data2,
                  backgroundColor: "rgba(53,211,156,0.5)",
                  borderColor: "rgb(53,211,156)",
                },
              ],
            }}
          />
        ))}
    </div>
  );
};
export default LineGraph;

import React from "react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  {
    symbol: "KO",
    date: "2021-04-01T04:00:00.000+00:00",
    open: 52.959999,
    low: 52.290001,
    high: 54.869999,
    close: 53.98,
    adjClose: 52.364948,
    volume: 270807700,
  },
  {
    symbol: "KO",
    date: "2021-05-01T04:00:00.000+00:00",
    open: 54.27,
    low: 53.610001,
    high: 55.709999,
    close: 55.290001,
    adjClose: 53.635757,
    volume: 309903200,
  },
  {
    symbol: "KO",
    date: "2021-06-01T04:00:00.000+00:00",
    open: 55.34,
    low: 53.720001,
    high: 56.48,
    close: 54.110001,
    adjClose: 52.491055,
    volume: 305857700,
  },
  {
    symbol: "KO",
    date: "2021-07-01T04:00:00.000+00:00",
    open: 54.34,
    low: 53.549999,
    high: 57.560001,
    close: 57.029999,
    adjClose: 55.740555,
    volume: 293385300,
  },
  {
    symbol: "KO",
    date: "2021-08-01T04:00:00.000+00:00",
    open: 57.200001,
    low: 55.450001,
    high: 57.560001,
    close: 56.310001,
    adjClose: 55.036842,
    volume: 220335000,
  },
  {
    symbol: "KO",
    date: "2021-09-01T04:00:00.000+00:00",
    open: 56.380001,
    low: 52.43,
    high: 57.029999,
    close: 52.470001,
    adjClose: 51.283661,
    volume: 334494700,
  },
  {
    symbol: "KO",
    date: "2021-10-01T04:00:00.000+00:00",
    open: 52.779999,
    low: 52.400002,
    high: 56.470001,
    close: 56.369999,
    adjClose: 55.511295,
    volume: 331812000,
  },
  {
    symbol: "KO",
    date: "2021-11-01T04:00:00.000+00:00",
    open: 56.389999,
    low: 52.439999,
    high: 57.16,
    close: 52.450001,
    adjClose: 51.651012,
    volume: 286683400,
  },
  {
    symbol: "KO",
    date: "2021-12-01T05:00:00.000+00:00",
    open: 52.98,
    low: 52.279999,
    high: 59.349998,
    close: 59.209999,
    adjClose: 58.760201,
    volume: 426786000,
  },
  {
    symbol: "KO",
    date: "2022-01-01T05:00:00.000+00:00",
    open: 58.82,
    low: 58.380001,
    high: 61.450001,
    close: 61.009998,
    adjClose: 60.546524,
    volume: 407891700,
  },
  {
    symbol: "KO",
    date: "2022-02-01T05:00:00.000+00:00",
    open: 60.91,
    low: 59.220001,
    high: 62.900002,
    close: 62.240002,
    adjClose: 61.767185,
    volume: 395999700,
  },
  {
    symbol: "KO",
    date: "2022-03-01T05:00:00.000+00:00",
    open: 62.139999,
    low: 57.5,
    high: 63.02,
    close: 62.16,
    adjClose: 61.68779,
    volume: 396376400,
  },
  {
    symbol: "KO",
    date: "2022-03-30T04:00:00.000+00:00",
    open: 62.009998,
    low: 61.555,
    high: 62.209999,
    close: 62.209999,
    adjClose: 62.209999,
    volume: 13193577,
  },
];
const month = [
  "Jan",
  "Feb",
  "Ma",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const newData = data.map((element) => {
  return { ...element, date: month[new Date(element.date).getMonth()] };
});

const Graph = () => {
  return (
    <React.Fragment>
      <h1>The Coca-Cola Company</h1>
      <LineChart width={700} height={400} data={newData}>
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis dataKey="close" />
        <Tooltip />
      </LineChart>
    </React.Fragment>
  );
};

export default Graph;

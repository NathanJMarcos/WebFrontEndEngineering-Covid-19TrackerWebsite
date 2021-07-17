import React, { useEffect, useState } from "react";
import axios from 'axios';
import ReactApexChart from "react-apexcharts";
import Layout from 'components/Layout';

function processData(data) {
  const csv = require('csv-string');
  const parsedCsv = csv.parse(data);
  
  var jsonData = {
    'date': [],
    'cases': [],
    'recovered': [],
    'deaths': []
  }
  for (var i = 1; i < parsedCsv.length; i++) {
    jsonData['date'].push(parsedCsv[i][0]);
    jsonData['cases'].push(parsedCsv[i][1]);
    jsonData['recovered'].push(parsedCsv[i][2]);
    jsonData['deaths'].push(parsedCsv[i][3]);
  }

  return jsonData;
}

function Graph() {
  const [globalData, setGlobalData] = useState([]);
  
  useEffect(() => {
    axios
      .get('https://raw.githubusercontent.com/datasets/covid-19/main/data/worldwide-aggregate.csv')
      .then((response) => {
        setGlobalData(processData(response.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  const series = [
    {
      name: "Cases",
      data: globalData['cases'] || [],
    },
    {
      name: "Recovered",
      data: globalData['recovered'] || [],
    },
    {
      name: "Deaths",
      data: globalData['deaths'] || [],
    },
  ];

  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: globalData['date'] || [],
    },
    tooltip: {
      x: {
        format: "MMM dd yyyy",
      },
    },
  };

  return (
    <Layout pageName="graph">
        <div
            style={{
                backgroundColor: "white",
                textAlign: "center",
            }}
        >
            <br />
            <h2>COVID-19 Global Graphs</h2>
            <br />
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
            />
            <br />
            <h4>Source</h4>
            <a href='https://github.com/datasets/covid-19/'>https://github.com/datasets/covid-19/</a>
            <p><i>This data is sourced from John Hopkins University Center for Systems Science and Engineering</i></p>
        </div>
    </Layout>
  );
}

export default Graph;

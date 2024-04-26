import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./chart.scss"

const Chart = ({ aspect, title }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/count-by-creation-date",
          {
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNDE1MzAwMywianRpIjoiOGZiMWZkYWQtNWU3Yi00NWU5LThkMDAtOWM1YzQ2MTE3NDJhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImJlbGsiLCJuYmYiOjE3MTQxNTMwMDMsImNzcmYiOiJlOTZmMjY5YS0wZTIwLTRlODUtYmJmMy0wYjhlYjY1YWNhZjAiLCJleHAiOjE3MTQxNjAyMDN9.Hte8o_QqcoFCRNHpJ77tgDZ4SLt1SaxsVD9z-vssqdw",
            },
          }
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730} // Vous pouvez augmenter cette valeur pour augmenter la largeur
          height={400} // Vous pouvez augmenter cette valeur pour augmenter la hauteur
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

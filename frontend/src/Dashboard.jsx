import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register ALL required elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [chartType, setChartType] = useState("bar");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/chart/sales");
      setData(res.data);
    };
    fetchData();
  }, []);

  // Filter logic
const getFilteredData = () => {
  return data || [];
};

  const filteredData = getFilteredData();
const values = filteredData.map(d => d.value);
const max = Math.max(...values);
const min = Math.min(...values);
const defaultColors = ["red", "blue", "green", "orange"];
  //  Chart data
  const chartData = {
    labels: filteredData.map(d => d.label),
    datasets: [
      {
        label: "Sales Data",
        data: filteredData.map(d => d.value),


      backgroundColor: filteredData.map((d, index) => {
  //  ALL → keep original colors
  if (filter === "all") return defaultColors[index];

  //  MAX → highlight only max, others grey
  if (filter === "max") {
    return d.value === max
      ? defaultColors[index]   // keep original color
      : "rgba(200,200,200,0.5)";
  }

  // MIN → highlight only min, others grey
  if (filter === "min") {
    return d.value === min
      ? defaultColors[index]
      : "rgba(200,200,200,0.5)";
  }
})
    }
  ]
};
      

  //  Fix chart sizing
  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ width: "80%", margin: "auto", marginTop: "20px" }}>
      <h2>Dashboard - Dynamic Chart</h2>

      {/* Filter buttons */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("max")}>Max</button>
        <button onClick={() => setFilter("min")}>Min</button>
        <p><b>Selected:</b> {filter}</p>
      </div>

      {/* Chart type buttons */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => setChartType("bar")}>Bar</button>
        <button onClick={() => setChartType("pie")}>Pie</button>
        <button onClick={() => setChartType("line")}>Line</button>
        <button onClick={() => setChartType("doughnut")}>Doughnut</button>
      </div>

      {/* Chart container (FIXED SIZE) */}
      <div style={{ width: "500px", height: "400px", margin: "auto" }}>
        {chartType === "bar" && <Bar data={chartData} options={options} />}
        {chartType === "pie" && <Pie data={chartData} options={options} />}
        {chartType === "line" && <Line data={chartData} options={options} />}
        {chartType === "doughnut" && <Doughnut data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default Dashboard;
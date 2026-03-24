import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");

  //  Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/chart/sales");
      setData(res.data);
    };

    fetchData();
  }, []);

  //  Dynamic filter logic
 const getFilteredData = () => {
  if (!data || data.length === 0) return [];

  if (filter === "all") return data;

  const values = data.map(d => d.value);

  if (filter === "max") {
    const max = Math.max(...values);
    return data.map(d => ({
      ...d,
      value: d.value === max ? d.value : 0
    }));
  }

  if (filter === "min") {
    const min = Math.min(...values);
    return data.map(d => ({
      ...d,
      value: d.value === min ? d.value : 0
    }));
  }

  return data; //  fallback
};

  const filteredData = getFilteredData();

  const chartData = {
    labels: filteredData.map(d => d.label),
    datasets: [
      {
        label: "Sales Data",
        data: filteredData.map(d => d.value),
        backgroundColor: filteredData.map(d => {
  if (filter === "max" && d.value > 0) return "green";
  if (filter === "min" && d.value > 0) return "red";
  return "rgba(75,192,192,0.6)";
})
      }
    ]
  };

  return (
    <div style={{ width: "80%", margin: "auto", marginTop: "10px" }}>
      <h2>Dashboard - Dynamic Chart</h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => setFilter("all")}>All </button>
        <button onClick={() => setFilter("max")}>Max </button>
        <button onClick={() => setFilter("min")}>Min</button>
        <p>Selected: {filter}</p>
      </div>

      {/* Chart */}
      <Bar data={chartData} />
    </div>
  );
};

export default Dashboard;
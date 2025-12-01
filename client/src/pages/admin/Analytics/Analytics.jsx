

import React, { useEffect, useState } from "react";
import "./Analytics.css";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const API_URL = import.meta.env.VITE_API_URL + "/api/analytics";


const Analytics = () => {
  const [stats, setStats] = useState({
    missedChats: [0, 0, 0, 0, 0, 0, 0],
    chartLabels: [],
    avgReplySeconds: 0,
    resolvedPercent: 0,
    totalChats: 0
  });

  const [loading, setLoading] = useState(true);

  // ---------------- Format Seconds ----------------
  const formatSeconds = (sec) => {
    if (!sec || sec === 0) return "0 secs";

    const mins = Math.floor(sec / 60);
    const seconds = sec % 60;

    if (mins === 0) return `${seconds} secs`;
    if (seconds === 0) return `${mins} mins`;
    return `${mins} mins ${seconds} secs`;
  };


  const getLast7Days = () => {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(d.toISOString().slice(0, 10));
    }
    return arr;
  };


  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/overview`);
      const data = await res.json();

      if (data) {
        setStats({
          missedChats: data.missedChats || [0,0,0,0,0,0,0],
          chartLabels: getLast7Days(),
          avgReplySeconds: data.avgReplySeconds || 0,
          resolvedPercent: data.resolvedPercent || 0,
          totalChats: data.totalChats || 0
        });
      }

      setLoading(false);
    } catch (err) {
      console.log("Analytics fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen">Loading Analytics...</div>;

 
  const lineData = {
    labels: stats.chartLabels,
    datasets: [
      {
        label: "Chats",
        data: stats.missedChats,
        borderColor: "#00E05D",
        backgroundColor: "transparent",
        tension: 0.45,
        borderWidth: 3,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#000000",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#000",
        displayColors: false,
        callbacks: {
          title: () => "Chats",
          label: (context) => `${context.raw}`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  
  const donutData = {
    datasets: [
      {
        data: [stats.resolvedPercent, 100 - stats.resolvedPercent],
        backgroundColor: ["#00E05D", "#EDEDED"],
        borderWidth: 0,
        cutout: "80%"
      }
    ]
  };


  return (
    <div className="analytics-page">

      <h3 className="page-header">Analytics</h3>

   
      <div className="analytics-section">
        <div className="section-header">
          <h2 className="green-title">Missed Chats</h2>
        </div>
        <div className="chart-container-large">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

 
      <div className="metrics-grid">

        {/* Avg Reply Time */}
        <div className="metric-item">
          <h2 className="green-title">Average Reply time</h2>
          <p className="metric-desc">
           For highest customer satisfaction rates you should aim to reply to an incoming customer's message in 15 seconds or less . Quick responses will get you more conversations, help you earn customers trust and make more sales.
          </p>
        </div>
        <div className="metric-value-container">
          <span className="green-large-value">{formatSeconds(stats.avgReplySeconds)}</span>
        </div>

        {/* Resolved Tickets */}
        <div className="metric-item">
          <h2 className="green-title">Resolved Tickets</h2>
          <p className="metric-desc">
            A callback system on a website, as well as proactive invitations, help to attract even more customers. A separate round button for ordering a call with a small animation helps to motivate more customers to make calls.
          </p>
        </div>
        <div className="metric-value-container">
          <div className="donut-wrapper">
            <Doughnut data={donutData} />
            <div className="donut-text">{stats.resolvedPercent}%</div>
          </div>
        </div>

        {/* Total Chats */}
        <div className="metric-item">
          <h2 className="black-title">Total Chats</h2>
          <p className="metric-desc">
           This metric Shows the total number of chats for all Channels for the selected the selected period
          </p>
        </div>
        <div className="metric-value-container">
          <span className="green-large-value">{stats.totalChats} Chats</span>
        </div>

      </div>
    </div>
  );
};

export default Analytics;


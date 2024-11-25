// import React from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

// // Register the required Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// const Graph = () => {
//   const BarChart = () => {
//     // Sample data for the chart
//     const data = {
//       labels: ["MCQ", "Subjective", "Formula", "Diagram"],
//       datasets: [
//         {
//           label: "Accuracy %",
//           data: [99, 98, 76, 76],
//           backgroundColor: [
//             "rgba(255, 99, 132, 0.7)", // Red
//             "rgba(54, 162, 235, 0.7)", // Blue
//             "rgba(255, 206, 86, 0.7)", // Yellow
//             "rgba(75, 192, 192, 0.7)", // Green
//           ],
//           borderColor: [
//             "rgba(255, 99, 132, 1)",
//             "rgba(54, 162, 235, 1)",
//             "rgba(255, 206, 86, 1)",
//             "rgba(75, 192, 192, 1)",
//           ],
//           borderWidth: 1,
//         },
//       ],
//     };
  
//     // Chart options
//     const options = {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: "top",
//         },
//         tooltip: {
//           enabled: true,
//         },
//       },
//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: "Types of Questions",
//             color: "white", // X-axis title color
//           },
//           grid: {
//             color: "rgba(255, 255, 255, 0.2)", // White grid lines for X-axis
//           },
//           ticks: {
//             color: "white", // X-axis tick labels color
//           },
//         },
//         y: {
//           title: {
//             display: true,
//             text: "Accuracy %",
//             color: "white", // Y-axis title color
//           },
//           grid: {
//             color: "rgba(255, 255, 255, 0.2)", // White grid lines for Y-axis
//           },
//           ticks: {
//             color: "white", // Y-axis tick labels color
//           },
//           beginAtZero: true,
//         },
//       },
//     };
  
//   return (
//     <div className="bg-stone-900 text-white p-4 rounded-lg h-40">
//       <h2 className="text-xl text-stone-400 ml-4 mt-2 font-bold mb-4">Viewing History</h2>
//       <div className="flex justify-center items-center h-full">
//       <div
//       style={{
//         width: "90%",
//         margin: "0 auto",
//         padding: "20px",
//         borderRadius: "8px",
//       }}
//     >
//       <h3 style={{ color: "white" }}>Performance Metrics</h3>
//       <Bar data={data} options={options} />
//     </div>
//       </div>
//     </div>
//   );
// };
// }

// export default Graph;




import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MonthlyExpenseDashboard() {
  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#ef4444"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
    },
    yaxis: {
      labels: {
        formatter: (val) => `₹${val}`,
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (val) => `₹${val}`,
      },
    },
  };

  const series = [
    {
      name: "Expense",
      data: [18000, 22000, 19000, 25000, 21000, 27000, 30000, 28000, 24000, 26000, 29000, 31000],
    },
  ];

  const totalExpense = series[0].data.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Monthly Expense
          </h2>
          <p className="text-gray-500 text-sm">
            Expense overview for the year
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-red-500">
            ₹{totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <Chart options={options} series={series} type="area" height={320} />

      {/* Bottom Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Highest Month</p>
          <p className="font-semibold text-red-600">December</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Expense</p>
          <p className="font-semibold text-blue-600">
            ₹{Math.round(totalExpense / 12).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Lowest Month</p>
          <p className="font-semibold text-green-600">January</p>
        </div>
      </div>
    </div>
  );
}
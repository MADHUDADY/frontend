import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiRefreshCw, FiPrinter, FiCalendar } from "react-icons/fi";
import { FaCoins, FaSackDollar } from "react-icons/fa6";
import { MdOutlineShoppingCart, MdOutlinePayments } from "react-icons/md";
import { IoWallet } from "react-icons/io5";

export default function EcommerceMetrics() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  return (
    <div className="w-full space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-sm border border-gray-200 rounded-xl px-6 py-4">

        <h2 className="text-lg font-bold text-red-500">SUMMARY</h2>

        {/* Date Range + Actions */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">

          {/* Modern Date Range Picker */}
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl border border-gray-300">

            <FiCalendar className="text-gray-500" size={18} />

            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd MMM yyyy"
              className="bg-transparent text-sm font-medium outline-none w-[120px] cursor-pointer"
            />

            <span className="text-gray-400">–</span>

            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate ?? undefined}
              dateFormat="dd MMM yyyy"
              className="bg-transparent text-sm font-medium outline-none w-[120px] cursor-pointer"
            />
          </div>

          {/* Refresh */}
          <button className="border border-gray-300 bg-white p-2 rounded-lg hover:bg-gray-100 transition">
            <FiRefreshCw className="text-green-600" size={18} />
          </button>

          {/* Print */}
          <button className="border border-gray-300 bg-white p-2 rounded-lg hover:bg-gray-100 transition">
            <FiPrinter size={18} />
          </button>
        </div>
      </div>

      {/* ================= METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

        {/* Sale */}
        <MetricCard
          icon={<FaCoins size={26} />}
          title="Sale"
          amount="123,450.00"
          color="text-blue-500"
        />

        {/* Purchase */}
        <MetricCard
          icon={<MdOutlineShoppingCart size={26} />}
          title="Purchase"
          amount="123,450.00"
          color="text-orange-500"
        />

        {/* Expense */}
        <MetricCard
          icon={<IoWallet size={26} />}
          title="Expense"
          amount="123,450.00"
          color="text-red-500"
        />

        {/* Income */}
        <MetricCard
          icon={<FaSackDollar size={26} />}
          title="Income"
          amount="123,450.00"
          color="text-green-500"
        />

        {/* Payment */}
        <MetricCard
          icon={<MdOutlinePayments size={26} />}
          title="Payment"
          amount="123,450.00"
          color="text-purple-500"
        />
      </div>
    </div>
  );
}

/* ================= REUSABLE METRIC CARD ================= */

type MetricCardProps = {
  icon: React.ReactNode;
  title: string;
  amount: string;
  color: string;
};

function MetricCard({ icon, title, amount, color }: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300">

      <div className="flex justify-center mb-4">
        <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gray-100 ${color}`}>
          {icon}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <h4 className="mt-2 text-lg font-bold text-gray-800">
          ₹{amount}
        </h4>
      </div>
    </div>
  );
}
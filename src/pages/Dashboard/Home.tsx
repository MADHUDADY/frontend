
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";


// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import Homepage from "../../pages/Dashboard/hompage";
export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-2 gap-4 md:gap-6">
<Homepage />
        {/* <div className="col-span-2 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

        </div>

        <div className="col-span-2 xl:col-span-12 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <MonthlySalesChart />
          <Piechart />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
         <div className="col-span-12">
          <Expense />
        </div>
        </div> */}
{/* 
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
      {/* <MonthlyTarget /> */}
    </>
  );
}
// #D3AF37
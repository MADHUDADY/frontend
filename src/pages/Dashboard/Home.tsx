import PageMeta from "../../components/common/PageMeta";
import Homepage from "../../pages/Dashboard/hompage";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Admin Dashboard | QMS Clinic"
        description="QMS Clinic Admin Dashboard"
      />
      {/* ✅ FIXED: removed grid wrapper that was causing overlap */}
      <Homepage />
    </>
  );
}
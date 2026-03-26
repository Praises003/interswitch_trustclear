import Header from "../components/dashboard/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      <Header />
      
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
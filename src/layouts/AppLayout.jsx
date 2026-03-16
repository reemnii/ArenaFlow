import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="grow p-6 pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
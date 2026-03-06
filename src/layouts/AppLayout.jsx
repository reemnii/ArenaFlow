import { Outlet } from "react-router-dom";
<<<<<<< HEAD

export default function AppLayout() {
  return (
    <div>
      <header>
        <h2>Navbar Placeholder</h2>
      </header>

      <main>
=======
import Navbar from "../components/Navbar";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="p-6">
>>>>>>> 1b17e1d54f68da41ea21469efc6c0dc1169dc57f
        <Outlet />
      </main>
    </>
  );
}

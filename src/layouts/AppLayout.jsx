import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <header>
        <h2>Navbar Placeholder</h2>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>Footer Placeholder</p>
      </footer>
    </div>
  );
}
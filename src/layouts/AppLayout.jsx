export default function AppLayout({ children }) {
  return (
    <div>
      <header>
        <h2>Navbar Placeholder</h2>
      </header>

      <main>
        {children}
      </main>

      <footer>
        <p>Footer Placeholder</p>
      </footer>
    </div>
  );
}
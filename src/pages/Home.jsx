import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#222" }}>
      
      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "15px 30px",
          borderBottom: "1px solid #ddd",
          alignItems: "center"
        }}
      >
        <h2>VolleyHub</h2>

        <div style={{ display: "flex", gap: "15px" }}>
          <Link to="/login">
            <button>Sign In</button>
          </Link>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
          color: "white",
          padding: "80px 20px",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          Welcome to VolleyHub
        </h1>

        <p style={{ fontSize: "20px", marginBottom: "30px" }}>
          The ultimate platform to create, manage, and explore volleyball tournaments.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
          <Link to="/register">
            <button
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Get Started
            </button>
          </Link>

          <Link to="/login">
            <button
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Sign In
            </button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2>What You Can Do</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "30px" }}>
          <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h3>Create Tournaments</h3>
            <p>Organize your own volleyball events easily.</p>
          </div>

          <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h3>Manage Teams</h3>
            <p>Add teams and players with full control.</p>
          </div>

          <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h3>Track Players</h3>
            <p>Keep stats and player information organized.</p>
          </div>

          <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h3>Explore Tournaments</h3>
            <p>Find and join tournaments near you.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 20px", textAlign: "center", background: "#f8fafc" }}>
        <h2>Join VolleyHub Today</h2>
        <p style={{ marginBottom: "20px" }}>
          Create an account and start managing tournaments like a pro.
        </p>

        <Link to="/register">
          <button style={{ padding: "12px 24px", fontSize: "16px" }}>
            Register Now
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "20px", textAlign: "center", borderTop: "1px solid #ddd" }}>
        <p>© 2026 VolleyHub</p>
        <Link to="/contact">Contact Us</Link>
      </footer>
    </div>
  );
}

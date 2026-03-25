import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const defaultTournament = {
  name: "",
  location: "",
  venue: "",
  startDate: "",
  endDate: "",
  format: "",
  maxTeams: "",
  skillLevel: "",
  genderCategory: "",
  visibility: "",
  bestOf: "",
  pointsPerSet: "",
  finalSetPoints: "",
  description: "",
  additionalRules: ""
};

export default function TournamentDetails() {
  const [tournament, setTournament] = useState(defaultTournament);

  useEffect(() => {
    const savedTournament = localStorage.getItem("selectedTournament");

    if (savedTournament) {
      setTournament({ ...defaultTournament, ...JSON.parse(savedTournament) });
    }
  }, []);

  const hasTournamentData = tournament.name || tournament.location || tournament.startDate;

  if (!hasTournamentData) {
    return (
      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1>Tournament Details</h1>
        <p>No tournament selected.</p>

        <div style={{ marginTop: "20px" }}>
          <Link to="/tournaments">
            <button style={buttonStyle}>Back to Tournaments</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "14px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
            color: "white",
            padding: "30px"
          }}
        >
          <h1 style={{ margin: 0, fontSize: "36px" }}>{tournament.name}</h1>
          <p style={{ marginTop: "10px", fontSize: "18px" }}>
            {tournament.location} {tournament.venue ? `• ${tournament.venue}` : ""}
          </p>
        </div>

        <div style={{ padding: "30px" }}>
          <section style={{ marginBottom: "30px" }}>
            <h2 style={sectionTitle}>Tournament Information</h2>
            <div style={gridStyle}>
              <InfoCard label="Start Date" value={tournament.startDate} />
              <InfoCard label="End Date" value={tournament.endDate} />
              <InfoCard label="Format" value={tournament.format} />
              <InfoCard label="Max Teams" value={tournament.maxTeams} />
              <InfoCard label="Skill Level" value={tournament.skillLevel} />
              <InfoCard label="Gender Category" value={tournament.genderCategory} />
              <InfoCard label="Visibility" value={tournament.visibility} />
            </div>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={sectionTitle}>Match Rules</h2>
            <div style={gridStyle}>
              <InfoCard label="Match Type" value={tournament.bestOf} />
              <InfoCard label="Points Per Set" value={tournament.pointsPerSet} />
              <InfoCard label="Final Set Points" value={tournament.finalSetPoints} />
            </div>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={sectionTitle}>Description</h2>
            <div style={boxStyle}>
              {tournament.description || "No description provided."}
            </div>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={sectionTitle}>Additional Rules</h2>
            <div style={boxStyle}>
              {tournament.additionalRules || "No additional rules provided."}
            </div>
          </section>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <Link to="/tournaments">
              <button style={buttonStyle}>Back to Tournaments</button>
            </Link>

            <Link to="/edit">
              <button style={secondaryButtonStyle}>Edit Tournament</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "18px",
        backgroundColor: "#fff"
      }}
    >
      <h4 style={{ margin: "0 0 8px 0", color: "#1e3a8a" }}>{label}</h4>
      <p style={{ margin: 0, color: "#333" }}>{value || "N/A"}</p>
    </div>
  );
}

const sectionTitle = {
  fontSize: "24px",
  marginBottom: "16px",
  color: "#0f172a"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px"
};

const boxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "18px",
  backgroundColor: "#fff",
  lineHeight: "1.6",
  color: "#333"
};

const buttonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#1e3a8a",
  color: "white",
  cursor: "pointer",
  fontSize: "15px"
};

const secondaryButtonStyle = {
  padding: "12px 20px",
  border: "1px solid #1e3a8a",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#1e3a8a",
  cursor: "pointer",
  fontSize: "15px"
};

import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import Home from "./pages/Home";
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import CreateTournaments from "./pages/CreateTournaments";
import EditTournaments from "./pages/EditTournaments";
import Dashboard from "./pages/Dashboard";
import ManageTeams from "./pages/ManageTeams";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="tournaments" element={<Tournaments />} />
        <Route path="tournaments/:id" element={<TournamentDetails />} />
        <Route path="create" element={<CreateTournaments />} />
        <Route path="edit/:id" element={<EditTournaments />} />
        <Route path="participants" element={<ManageTeams />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
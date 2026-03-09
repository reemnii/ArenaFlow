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
import ForgotPassword from "./pages/ForgotPassword";
import Contact from "./pages/ContactUs";
import Terms from "./pages/TermsOfService"
import Privacy from "./pages/PrivacyPolicy"
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
        <Route path="contact" element={<Contact />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />}/>
      <Route path="*" element={<NotFound />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;

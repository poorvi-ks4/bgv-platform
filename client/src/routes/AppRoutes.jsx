import { Routes, Route } from "react-router-dom";
import Login from "../pages/authz/Login";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import HRDashboard from "../pages/hr/HRDashboard";
import VerifierDashboard from "../pages/verifier/VerifierDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/candidate" element={<CandidateDashboard />} />
      <Route path="/hr" element={<HRDashboard />} />
      <Route path="/verifier" element={<VerifierDashboard />} />
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import VerifierDashboard from "../pages/verifier/VerifierDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/candidate" element={<CandidateDashboard />} />
      <Route path="/recruiter" element={<RecruiterDashboard />} />
      <Route path="/verifier" element={<VerifierDashboard />} />
    </Routes>
  );
}

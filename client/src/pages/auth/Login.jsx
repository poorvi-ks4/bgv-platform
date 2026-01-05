import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../auth/googleAuth";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function Login() {
  const [role, setRole] = useState("candidate");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      // 1. Google Auth
      const { user, token } = await googleLogin();

      // 2. Send to backend
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 3. Backend user
      setUser(res.data.user);

      // 4. Redirect
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>BGV Platform</h1>

      <label>Select Role</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      >
        <option value="candidate">Candidate</option>
        <option value="recruiter">Recruiter / HR</option>
        <option value="verifier">Verifier</option>
      </select>

      <button onClick={handleLogin} style={{ width: "100%", padding: 10 }}>
        🔐 Sign in with Google
      </button>
    </div>
  );
}

import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
//import "../../config/firebase"; // Initialize Firebase
import '../../auth/firebase'; // Initialize Firebase from auth folder

const Login = () => {
  const [role, setRole] = useState("candidate");
  const auth = getAuth(); // Now Firebase is initialized
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (role) => {
    try {
      console.log("🔐 Attempting login as:", role);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      console.log("✅ Google login successful");
      console.log("📧 Email:", result.user.email);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      console.log("📨 Response status:", res.status);
      const data = await res.json();
      console.log("✅ Login response:", data);

      // Redirect based on role
      if (role === "hr" || role === "recruiter") {
        console.log("🎯 Redirecting to /hr");
        window.location.href = "/hr";
      } else if (role === "candidate") {
        console.log("🎯 Redirecting to /candidate");
        window.location.href = "/candidate";
      } else if (role === "verifier") {
        console.log("🎯 Redirecting to /verifier");
        window.location.href = "/verifier";
      }
    } catch (err) {
      console.error("❌ Login error:", err.message);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>BGV Platform</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Select your role to login
        </p>

        <button
          onClick={() => handleLogin("candidate")}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          👤 Login as Candidate
        </button>

        <button
          onClick={() => handleLogin("hr")}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          👔 Login as HR
        </button>

        <button
          onClick={() => handleLogin("verifier")}
          style={{
            width: "100%",
            padding: "12px",
            background: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          ✓ Login as Verifier
        </button>
      </div>
    </div>
  );
};

export default Login;

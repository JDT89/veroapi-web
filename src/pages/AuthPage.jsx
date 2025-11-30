import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "../config";
import "./AuthPage.css";

function AuthPage() {
  // ... (keep existing state)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const path = mode === "login" ? "/v1/auth/login" : "/v1/auth/signup";
      const res = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      const token = data.token;
      if (typeof window !== "undefined" && token) {
        window.localStorage.setItem("veroapi_token", token);
      }

      const successMessage =
        mode === "signup"
          ? "Account created successfully!"
          : "Welcome back!";
      
      setSuccess(successMessage + " Redirecting...");
      toast.success(successMessage);

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (err) {
      const message = err.message || "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of component remains the same)
}

export default AuthPage;


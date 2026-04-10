import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

function AuthPage() {
  const [tab, setTab] = useState("login");

  return (
    <section className="mx-auto max-w-md rounded-xl border border-cardBorder bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold text-textPrimary">Welcome to FlipEarn</h1>
      <p className="mb-6 text-sm text-textSecondary">Login or create an account to buy and sell profiles.</p>

      <div className="mb-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
        <button
          className={`rounded-md px-3 py-2 text-sm font-semibold ${tab === "login" ? "bg-white text-primary shadow" : "text-textSecondary"}`}
          onClick={() => setTab("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={`rounded-md px-3 py-2 text-sm font-semibold ${tab === "register" ? "bg-white text-primary shadow" : "text-textSecondary"}`}
          onClick={() => setTab("register")}
          type="button"
        >
          Register
        </button>
      </div>

      {tab === "login" ? <LoginForm /> : <RegisterForm />}
      <p className="mt-4 text-xs text-textSecondary">
        Demo account (after seeding DB): <strong>alice@flippearn.dev</strong> / <strong>Demo@123</strong>
      </p>
    </section>
  );
}

export default AuthPage;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const onSubmit = async (values) => {
    setApiError("");
    try {
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      navigate("/marketplace");
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Username</label>
        <input
          className="w-full rounded-lg border border-cardBorder px-3 py-2"
          placeholder="mohak"
          {...register("username", { required: "Username is required", minLength: 3 })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full rounded-lg border border-cardBorder px-3 py-2"
          placeholder="you@example.com"
          {...register("email", { required: "Email is required" })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full rounded-lg border border-cardBorder px-3 py-2"
          placeholder="Create password"
          {...register("password", { required: "Password is required", minLength: 6 })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          className="w-full rounded-lg border border-cardBorder px-3 py-2"
          placeholder="Confirm password"
          {...register("confirmPassword", {
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>
      {apiError && <p className="text-sm text-red-600">{apiError}</p>}
      <button
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white disabled:opacity-60"
        type="submit"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}

export default RegisterForm;

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import "../css/sign-in-up-form.css";
import Logo from "./Logo";
import { useFetch, HttpError } from "@/hooks/useFetch";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Toast from "@/components/Toast/Toast";

type SignInForm = {
  email: string;
  password: string;
};

const API_AUTH_SIGNIN =
  "https://authservice8-fvgjaehwh5f8d9dq.swedencentral-01.azurewebsites.net/api/Auth/signin";

const LoginCard: React.FC = () => {
  const { post } = useFetch<unknown>(API_AUTH_SIGNIN, { method: "POST" });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInForm>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (formData: SignInForm) => {
    try {
      const payload = {
        Email: formData.email.trim(),
        Password: formData.password,
      };

      const res = await post<string | { email: string }>(payload);

      const email =
        typeof res === "string"
          ? res
          : res && typeof res === "object"
          ? (res as { email?: string }).email
          : undefined;

      if (!email) throw new Error("Unexpected sign-in response.");

      sessionStorage.setItem("loggedInUserEmail", email);
      toast.success("Signed in successfully!");
      navigate("/workouts");
    } catch (err: unknown) {
      console.error("Sign-in error:", err);

      if (err instanceof HttpError) {
        if (err.status === 400 || err.status === 401) {
          setError("password", { message: "Invalid email or password." });
          toast.error("Invalid email or password.");
          return;
        }
        if (err.status >= 500) {
          toast.error("Server error (500). Please try again later.");
          return;
        }

        toast.error(`Request failed (${err.status}). Please try again later.`);
        return;
      }

      const msg =
        err instanceof Error && err.message && err.message !== "Failed to fetch"
          ? err.message
          : "Network error. Please check your connection or try again later.";
      toast.error(msg);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-frame">
        {/* Toast */}
        <Toast />

        {/* IMAGE SECTION */}
        <div className="image-section">
          <img
            src="/images/register-image.png"
            alt="Gym workout"
            className="image"
          />
          <div className="image-overlay">
            <h1 className="image-title text-4xl text-right font-bold italic">
              CoreGymClub
            </h1>
            <p className="image-tagline font-bold text-2xl">
              Transform Your Body. Elevate Your Life.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="form-section">
          <div className="welcome-container">
            <Logo />
            <h2>Welcome back</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          <form
            className="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-busy={isSubmitting}
          >
            <span className="sr-only" role="status" aria-live="polite">
              {isSubmitting ? "Authorizing..." : ""}
            </span>

            {/* Email */}
            <div className="form-group">
              <Label className="form-label text-sm font-bold" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                className="form-input"
                placeholder="your@email.com"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                  validate: (v) =>
                    v.trim().length > 0 || "Email cannot be empty",
                })}
              />
              {errors.email && (
                <p className="form-error text-sm" aria-live="polite">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <Label
                className="form-label text-sm font-bold"
                htmlFor="password"
              >
                Password
              </Label>
              <Input
                id="password"
                className="form-input"
                placeholder="*********"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Min 8 characters" },
                })}
              />
              {errors.password && (
                <p className="form-error text-sm" aria-live="polite">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="form-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Authorizing..." : "Log in"}
            </Button>

            <p className="form-signin">
              Don't have an account? <a href="/Register">Register</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;

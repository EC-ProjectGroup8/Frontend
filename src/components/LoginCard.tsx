import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import "../css/sign-in-up-form.css";
import Logo from "./Logo";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const LoginCard: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm<FormData>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const onSubmit = async (formData: FormData) => {
    const email = formData.email.trim().toLowerCase();

    const takenEmails = ["taken@example.com"];
    if (takenEmails.includes(email)) {
      setError("email", { message: "Email already in use" });
      return;
    }

    // TEMP: simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="registration-container">
      <div className="registration-frame">
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
              {isSubmitting ? "Submitting your registration..." : ""}
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
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Min 8 characters" },
                  validate: (v) =>
                    passwordRegex.test(v) ||
                    "Need one uppercase, one lowercase and one digit",
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

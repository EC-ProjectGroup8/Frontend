import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import "../css/sign-in-up-form.css";

import { toast } from "sonner";
import Toast from "@/components/Toast/Toast";
import type { RegistrationFormData } from "@/types/authTypes";
import { useFetch, HttpError } from "@/hooks/useFetch";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useNavigate } from "react-router-dom";

const API_AUTH_ENDPOINT =
  "https://authservice8-fvgjaehwh5f8d9dq.swedencentral-01.azurewebsites.net/api/Auth/register";

const RegistrationForm: React.FC = () => {
  const { post } = useFetch<unknown>(API_AUTH_ENDPOINT, { method: "POST" });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
    reset,
  } = useForm<RegistrationFormData>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const onSubmit = async (formData: RegistrationFormData) => {
    try {
      const payload = {
        FirstName: formData.FirstName.trim(),
        LastName: formData.LastName.trim(),
        Email: formData.Email.trim(),
        Password: formData.Password,
        ConfirmPassword: formData.confirmPassword, 
      };

      await post(payload);

      toast.success("Registration successful!");
      reset(); 
      navigate("/signin");
    } catch (err: unknown) {

      if (err instanceof HttpError && err.status === 409) {
        setError("Email", { message: "This email is already registered." });
        toast.error("Email is already in use.");
        return;
      }


      const message =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast.error(message);
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
        <form
          className="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-busy={isSubmitting}
        >
          <h2 className="form-title text-3xl font-bold">Join Core Gym Club</h2>
          <p className="form-subtitle text-lg">
            Create your account to unlock your fitness journey.
          </p>

          {/* Screen-reader för submit-status */}
          <span className="sr-only" role="status" aria-live="polite">
            {isSubmitting ? "Submitting your registration..." : ""}
          </span>

          {/* First Name */}
          <div className="form-group">
            <Label className="form-label text-sm font-bold" htmlFor="FirstName">
              First Name
            </Label>
            <Input
              id="FirstName"
              className="form-input"
              placeholder="Enter your first name"
              type="text"
              autoComplete="given-name"
              aria-invalid={!!errors.FirstName}
              {...register("FirstName", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
                validate: (value) =>
                  value.trim().length > 0 || "First name cannot be empty",
              })}
            />
            {errors.FirstName && (
              <p className="form-error text-sm" aria-live="polite">
                {errors.FirstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <Label className="form-label text-sm font-bold" htmlFor="LastName">
              Last Name
            </Label>
            <Input
              id="LastName"
              className="form-input"
              placeholder="Enter your Last name"
              type="text"
              aria-invalid={!!errors.LastName}
              autoComplete="family-name"
              {...register("LastName", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
                validate: (value) =>
                  value.trim().length > 0 || "Last name cannot be empty",
              })}
            />
            {errors.LastName && (
              <p className="form-error text-sm" aria-live="polite">
                {errors.LastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <Label className="form-label text-sm font-bold" htmlFor="email">
              Email Address
            </Label>
            <Input
              id="email"
              className="form-input"
              placeholder="your@email.com"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.Email}
              {...register("Email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
                validate: (value) =>
                  value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.Email && (
              <p className="form-error text-sm" aria-live="polite">
                {errors.Email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <Label className="form-label text-sm font-bold" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              className="form-input"
              placeholder="*********"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.Password}
              {...register("Password", {
                required: "Password is required",
                minLength: { value: 8, message: "Min 8 characters" },
                validate: (value) =>
                  passwordRegex.test(value) ||
                  "Need one uppercase, one lowercase and one digit",
              })}
            />
            {errors.Password && (
              <p className="form-error text-sm" aria-live="polite">
                {errors.Password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <Label
              className="form-label text-sm font-bold"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              className="form-input"
              placeholder="*********"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === getValues("Password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="form-error text-sm" aria-live="polite">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="form-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>

          {/* Sign in */}
          <p className="form-signin">
            Already have an account? <a href="/signin">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

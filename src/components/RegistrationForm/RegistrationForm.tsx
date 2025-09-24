import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import "./RegistrationForm.css";
import { toast } from "sonner";
import Toast from "@/components/Toast/Toast";
import type { RegistrationFormData } from "@/types/authTypes";
import { useFetch } from "@/hooks/useFetch";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

// Setting API Endpoint
const API_AUTH_ENDPOINT = "http://localhost:3000/User";

const RegistrationForm: React.FC = () => {
  // useFetch is an React Hook, we are calling it on top level
  // Get user data for email validation
  const {
    data: existingUserData,
    error: fetchError,
    refetch: refetchExistingUserData,
  } = useFetch<RegistrationFormData[]>(API_AUTH_ENDPOINT);

  // Post user data to API
  const { post, error: postError } = useFetch<RegistrationFormData>(
    API_AUTH_ENDPOINT,
    {
      method: "POST",
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
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

  // Regex and dummy data
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Submit-funktion (fake API-call)
  const onSubmit = async (formData: RegistrationFormData) => {
    // Best practise using Try catch regarding Async tasks
    try {
      // ---- Some validation before post --- //
      // Check if existingUserData is available and no fetch error
      if (fetchError || !existingUserData) {
        toast.error("Failed to fetch existing user data");
        return;
      }

      // Check if email already exists
      const emailExists = existingUserData.some(
        (item: RegistrationFormData) =>
          item.Email.toLowerCase() === formData.Email.trim().toLowerCase()
      );

      // If email exists, set error and return
      if (emailExists) {
        setError("Email", { message: "This email is already registered." });
        toast.error("Registration failed: Email is already in use.");
        return;
      }

      // If post error, set error and return
      if (postError) {
        toast.error("Registration failed: " + postError);
        return;
      }
      // ---- Some validation before post --- END //

      // Post user data to API
      await post(formData);
      // Refetch existing user data
      toast.success("Registration successful!");
      // Reset form and update existing user data, to avoid Stale
      // data
      refetchExistingUserData();
    } catch (postError) {
      toast.error(
        (postError as string) || "Something went wrong. Please try again later."
      );
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

          {/* Screen-reader for submitting */}
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

          {/* NO TERMS YET */}
          {/* Terms */}
          {/* <div className="form-group form-legal">
            <div className="checkbox-container">
            <input
               id="acceptTerms"
               type="checkbox"
               className="checkbox-input"
               aria-invalid={!!errors.acceptTerms}
               {...register("acceptTerms", {
               validate: v => v === true || "You must accept the terms",
               })}
            />

            <label htmlFor="acceptTerms" className="checkbox-label text-sm">
               By clicking Register, you agree to our{" "}
               <a className="checkbox-link underline" href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
               {" "}and{" "}
               <a className="checkbox-link underline" href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
            </label>
            </div>

            {errors.acceptTerms && (
            <p className="form-error text-sm" aria-live="polite">{errors.acceptTerms.message}</p>
            )}
        </div> */}

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

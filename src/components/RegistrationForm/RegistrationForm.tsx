import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import "./RegistrationForm.css";

type FormData = {
   fullName: string;
   email: string;
   password: string;
   confirmPassword: string;
   acceptTerms: boolean;
};

const RegistrationForm: React.FC = () => {
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setError,
      getValues,
   } = useForm<FormData>({
      mode: "onSubmit",
      reValidateMode: "onChange",
      defaultValues: {
         fullName: "",
         email: "",
         password: "",
         confirmPassword: "",
         acceptTerms: false,
      },
   });

   // Regex and dummy data
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   const takenEmails = ["taken@example.com"];

   // Submit-funktion (fake API-call)
   const onSubmit = async (formData: FormData) => {
      if (takenEmails.includes(formData.email.trim().toLowerCase())) {
         setError("email", { message: "Email already in use" });
         return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake delay
   };

   return (
      <div className="registration-container">
         <div className="registration-frame">
            {/* IMAGE SECTION */}
            <div className="image-section">
               <img
                  src="/src/assets/images/register-image.png"
                  alt="Gym workout"
                  className="image"
               />
               <div className="image-overlay">
                  <h1 className="image-title text-4xl text-right font-bold italic">CoreGymClub</h1>
                  <p className="image-tagline font-bold text-2xl">
                     Transform Your Body. Elevate Your Life.
                  </p>
               </div>
            </div>

            {/* FORM */}
            <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
               <h2 className="form-title text-3xl font-bold">Join Core Gym Club</h2>
               <p className="form-subtitle text-lg">
                  Create your account to unlock your fitness journey.
               </p>

               {/* Full Name */}
               <div className="form-group">
                  <Label className="form-label text-sm font-bold" htmlFor="fullName">
                     Full Name
                  </Label>
                  <Input
                     id="fullName"
                     className="form-input"
                     placeholder="Enter your full name"
                     type="text"
                     aria-invalid={!!errors.fullName}
                     {...register("fullName", {
                        required: "Full name is required",
                        minLength: {
                           value: 2,
                           message: "Full name must be at least 2 characters",
                        },
                        validate: (value) =>
                           value.trim().length > 0 ||
                           "Full name cannot be empty",
                     })}
                  />
                  {errors.fullName && (
                     <p className="form-error text-sm" aria-live="polite">
                        {errors.fullName.message}
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
                     aria-invalid={!!errors.email}
                     {...register("email", {
                        required: "Email is required",
                        pattern: {
                           value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                           message: "Invalid email format",
                        },
                        validate: (value) =>
                           value.trim().length > 0 || "Email cannot be empty",
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
                  <Label className="form-label text-sm font-bold" htmlFor="password">
                     Password
                  </Label>
                  <Input
                     id="password"
                     className="form-input"
                     placeholder="*********"
                     type="password"
                     aria-invalid={!!errors.password}
                     {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Min 8 characters" },
                        validate: (value) =>
                           passwordRegex.test(value) ||
                           "Need one uppercase, one lowercase and one digit",
                     })}
                  />
                  {errors.password && (
                     <p className="form-error text-sm" aria-live="polite">
                        {errors.password.message}
                     </p>
                  )}
               </div>

               {/* Confirm Password */}
               <div className="form-group">
                  <Label className="form-label text-sm font-bold" htmlFor="confirmPassword">
                     Confirm Password
                  </Label>
                  <Input
                     id="confirmPassword"
                     className="form-input"
                     placeholder="*********"
                     type="password"
                     aria-invalid={!!errors.confirmPassword}
                     {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                           value === getValues("password") ||
                           "Passwords do not match",
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
               <Button
                  type="submit"
                  className="form-button"
                  disabled={isSubmitting}
               >
                  {isSubmitting ? "Registering..." : "Register"}
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
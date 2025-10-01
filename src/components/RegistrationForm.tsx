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

      toast.success("Registreringen lyckades!");
      reset();
      navigate("/signin");
    } catch (err: unknown) {
      if (err instanceof HttpError && err.status === 409) {
        setError("Email", {
          message: "Den här e-postadressen är redan registrerad.",
        });
        toast.error("E-postadressen används redan.");
        return;
      }

      const message =
        err instanceof Error
          ? err.message
          : "Registreringen misslyckades. Försök igen.";
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
              Din hälsa, ditt välmående, din styrka.
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
          <h2 className="form-title text-3xl font-bold">
            Bli medlem hos Core Gym Club
          </h2>
          <p className="form-subtitle text-lg">
            Börja din träningsresa med ett konto hos oss.
          </p>

          {/* Screen-reader för submit-status */}
          <span className="sr-only" role="status" aria-live="polite">
            {isSubmitting ? "Skickar din registrering..." : ""}
          </span>

          {/* First Name */}
          <div className="form-group">
            <Label className="form-label text-sm font-bold" htmlFor="FirstName">
              Förnamn
            </Label>
            <Input
              id="FirstName"
              className="form-input"
              placeholder="Ange ditt förnamn"
              type="text"
              autoComplete="given-name"
              aria-invalid={!!errors.FirstName}
              {...register("FirstName", {
                required: "Förnamn krävs",
                minLength: {
                  value: 2,
                  message: "Förnamnet måste vara minst 2 tecken",
                },
                validate: (value) =>
                  value.trim().length > 0 || "Förnamnet får inte vara tomt",
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
              Efternamn
            </Label>
            <Input
              id="LastName"
              className="form-input"
              placeholder="Ange ditt efternamn"
              type="text"
              aria-invalid={!!errors.LastName}
              autoComplete="family-name"
              {...register("LastName", {
                required: "Efternamn krävs",
                minLength: {
                  value: 2,
                  message: "Efternamnet måste vara minst 2 tecken",
                },
                validate: (value) =>
                  value.trim().length > 0 || "Efternamnet får inte vara tomt",
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
              E-postadress
            </Label>
            <Input
              id="email"
              className="form-input"
              placeholder="din@epost.se"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.Email}
              {...register("Email", {
                required: "Du måste ange en e-postadress",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ogiltigt e-postformat",
                },
                validate: (value) =>
                  value.trim().length > 0 || "E-postadressen får inte vara tom",
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
              Lösenord
            </Label>
            <Input
              id="password"
              className="form-input"
              placeholder="*********"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.Password}
              {...register("Password", {
                required: "Lösenord krävs",
                minLength: { value: 8, message: "Minst 8 tecken." },
                validate: (value) =>
                  passwordRegex.test(value) ||
                  "Lösenordet måste innehålla minst en stor bokstav, en liten bokstav, en siffra och ett specialtecken.",
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
              Bekräfta lösenord
            </Label>
            <Input
              id="confirmPassword"
              className="form-input"
              placeholder="*********"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword", {
                required: "Vänligen bekräfta ditt lösenord",
                validate: (value) =>
                  value === getValues("Password") || "Lösenorden matchar inte",
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
                Skapar konto...
              </>
            ) : (
              "Skapa konto"
            )}
          </Button>

          {/* Sign in */}
          <p className="form-signin">
            Har du redan ett konto? <a href="/logga-in">Logga in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

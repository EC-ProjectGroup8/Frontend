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

      if (!email) throw new Error("Oväntat inloggning fel. Försök igen.");

      sessionStorage.setItem("loggedInUserEmail", email);
      toast.success("Inloggning lyckades!");
      navigate("/workouts");
    } catch (err: unknown) {
      console.error("Sign-in error:", err);

      if (err instanceof HttpError) {
        if (err.status === 400 || err.status === 401) {
          setError("password", {
            message: "Ogiltig e-postadress eller lösenord.",
          });
          toast.error("Ogiltig e-postadress eller lösenord.");
          return;
        }
        if (err.status >= 500) {
          toast.error("Serverfel (500). Försök igen senare.");
          return;
        }

        toast.error(
          `Begäran misslyckades (${err.status}). Försök igen senare.`
        );
        return;
      }

      const msg =
        err instanceof Error &&
        err.message &&
        err.message !== "Kunde inte hämta data."
          ? err.message
          : "Nätverksfel. Kontrollera din anslutning och försök igen.";
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
              Din hälsa, ditt välmående, din styrka.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="form-section">
          <div className="welcome-container">
            <Logo />
            <h2>Välkommen tillbaka</h2>
            <p>Fyll i dina uppgifter för att logga in.</p>
          </div>

          <form
            className="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-busy={isSubmitting}
          >
            <span className="sr-only" role="status" aria-live="polite">
              {isSubmitting ? "Verifierar..." : ""}
            </span>

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
                aria-invalid={!!errors.email}
                {...register("email", {
                  required: "Du måste ange en e-postadress",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ogiltigt e-postformat",
                  },
                  validate: (v) =>
                    v.trim().length > 0 || "E-postadressen får inte vara tom",
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
                Lösenord
              </Label>
              <Input
                id="password"
                className="form-input"
                placeholder="*********"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password", {
                  required: "Lösenord krävs",
                  minLength: { value: 8, message: "Minst 8 tecken." },
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
              {isSubmitting ? "Verifierar..." : "Logga in"}
            </Button>

            <p className="form-signin">
              Har du inget konto? <a href="/skapa-konto">Skapa konto</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;

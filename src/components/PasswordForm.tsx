import { HttpError, useFetch } from "@/hooks/useFetch";
import Toast from "./Toast/Toast";

import { useForm } from "react-hook-form";
import type { RegistrationFormData } from "@/types/authTypes";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/shadcn-io/spinner";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_AUTH_ENDPOINT =
  "https://authservice8-fvgjaehwh5f8d9dq.swedencentral-01.azurewebsites.net/api/Auth/reset-password";

const PasswordForm: React.FC = () => {
  const { post } = useFetch<unknown>(API_AUTH_ENDPOINT, { method: "POST" });
  const [searchParams] = useSearchParams();
  const emailUrl = searchParams.get("email");
  const userTokenUrl = searchParams.get("token");
  const navigate = useNavigate();

  // State for userToken and userEmail
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Set userToken and userEmail from url
  // Don't worry if Toast and Useffect triggers two time
  // this is because Strick mode is enabled
  useEffect(() => {
    // If userToken and email is in url, set userToken and userEmail
    // Else, toast error
    if ((userTokenUrl && emailUrl && userTokenUrl) || emailUrl) {
      setUserToken(userTokenUrl);
      setUserEmail(emailUrl);
    } else {
      toast.error("Hej, nu har du väl hamnat fel. Stick, dra åt pipan");
    }
  }, [emailUrl, searchParams, userToken, userTokenUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm<RegistrationFormData>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      Password: "",
      confirmPassword: "",
    },
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const onSubmit = async (formData: RegistrationFormData) => {
    // Lets check if password match
    let passwordMatch = "";

    // If password match, set passwordMatch to formData.Password
    if (formData.Password === formData.confirmPassword) {
      passwordMatch = formData.Password;
    }
    try {
      const payload = {
        Email: userEmail,
        newPassword: passwordMatch,
        ResetCode: userToken,
      };

      await post(payload);
      toast.success(
        "Lösenordet har ändrats!, du redigeras nu till inloggnings sidan."
      );

      // Reset form
      reset();

      // Redirect to sign in page, waiting 5 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 5000);
    } catch (err: unknown) {
      if (
        err instanceof HttpError &&
        err.status !== 200 &&
        err.status !== 201
      ) {
        // If token is invalid
        
        if (err instanceof HttpError && err.status === 400) {
          toast.error(
            "Lösenord token är ogiltig, skapa en ny återställnings länk"
          );
          // Redirect to create new reset link
          setTimeout(() => {
            navigate("/glomt-losenord");
          }, 5000);
          return;
        }

        // If something else went wrong return error message
        toast.error("Något gick fel, försök igen.");
        return;
      }

      // If something else went wrong return error message
      toast.error("Något gick fel, försök igen. ");
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-frame">
        {/* Toast */}
        <Toast />

        {/* FORM */}
        <form
          className="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-busy={isSubmitting}
        >
          <h2 className="form-title text-3xl font-bold">
            Lösenord Återställning
          </h2>
          <p className="form-subtitle text-lg">Fyll i ditt nya lösenord.</p>

          {/* Screen-reader för submit-status */}
          <span className="sr-only" role="status" aria-live="polite">
            {isSubmitting ? "Skickar..." : ""}
          </span>

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
                Vänta...
              </>
            ) : (
              "Återställ lösenord"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordForm;

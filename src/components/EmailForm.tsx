import { HttpError, useFetch } from "@/hooks/useFetch";
import Toast from "./Toast/Toast";

import { useForm } from "react-hook-form";
import type { RegistrationFormData } from "@/types/authTypes";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/shadcn-io/spinner";



const API_AUTH_ENDPOINT =
  "https://authservice8-fvgjaehwh5f8d9dq.swedencentral-01.azurewebsites.net/api/Auth/forgot-password";




const EmailForm: React.FC = () => {
  const { post } = useFetch<unknown>(API_AUTH_ENDPOINT, { method: "POST" });


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,

    reset,
  } = useForm<RegistrationFormData>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      Email: "",
    },
  });



  const onSubmit = async (formData: RegistrationFormData) => {
    try {
      const payload = {

        Email: formData.Email.trim(),

      };

      await post(payload);

      toast.success("Epost har skickats med dig återställniongslänk.");
      reset();

    } catch (err: unknown) {

      if (err instanceof HttpError && err.status !== 200 && err.status !== 201) {
        setError("Email", { message: "Något gick fel, försök igen" });
        toast.error("Något gick fel, försök igen.");
        return;
      }


      const message =
        err instanceof Error ? err.message : "Något gick fel, försök igen.";
      toast.error(message);
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
          <h2 className="form-title text-3xl font-bold">Password Reset Form</h2>
          <p className="form-subtitle text-lg">
            Enter your email to reset your password. You will receive a link to create a new password via email.
          </p>

          {/* Screen-reader för submit-status */}
          <span className="sr-only" role="status" aria-live="polite">
            {isSubmitting ? "Submitting your registration..." : ""}
          </span>





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



          {/* Submit */}
          <Button type="submit" className="form-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                Vänta...
              </>
            ) : (
              "Skicka Epost (Återställningslänk)"
            )}
          </Button>


        </form>
      </div>
    </div>
  );
};


export default EmailForm;





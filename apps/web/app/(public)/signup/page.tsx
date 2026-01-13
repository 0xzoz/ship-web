import Link from "next/link";
import { AuthShell } from "../../../components/layout/AuthShell";
import { SignupForm } from "../../../components/forms/SignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      title="Your crew is ready."
      subtitle="Create your Ship account and start your first voyage in minutes."
      footer={
        <div>
          Already have an account?{" "}
          <Link className="text-beacon-amber hover:text-warm-white" href="/login">
            Log in
          </Link>
        </div>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}

import Link from "next/link";
import { AuthShell } from "../../../components/layout/AuthShell";
import { SignupForm } from "../../../components/forms/SignupForm";
import { OAuthButtons } from "../../../components/forms/OAuthButtons";

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
      <OAuthButtons />
      <div className="flex items-center gap-4 text-xs text-slate-600">
        <span className="h-px flex-1 bg-slate-700" />
        <span>or</span>
        <span className="h-px flex-1 bg-slate-700" />
      </div>
      <SignupForm />
    </AuthShell>
  );
}

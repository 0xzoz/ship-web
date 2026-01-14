import Link from "next/link";
import { AuthShell } from "../../../components/layout/AuthShell";
import { LoginForm } from "../../../components/forms/LoginForm";
import { OAuthButtons } from "../../../components/forms/OAuthButtons";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back, captain."
      subtitle="Log in to resume your voyage and check every ship in the harbor."
      footer={
        <div className="flex flex-col gap-3">
          <Link className="text-beacon-amber hover:text-warm-white" href="#">
            Forgot password?
          </Link>
          <div>
            Don&apos;t have an account?{" "}
            <Link className="text-beacon-amber hover:text-warm-white" href="/signup">
              Sign up
            </Link>
          </div>
        </div>
      }
    >
      <OAuthButtons />
      <div className="flex items-center gap-4 text-xs text-slate-600">
        <span className="h-px flex-1 bg-slate-700" />
        <span>or</span>
        <span className="h-px flex-1 bg-slate-700" />
      </div>
      <LoginForm />
    </AuthShell>
  );
}

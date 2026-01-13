type FormErrorProps = {
  message?: string | null;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
      {message}
    </p>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  updateUserSchema,
  type ChangePasswordInput,
  type UpdateUserInput,
} from "@ship/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Toast, ToastProvider } from "../ui/Toast";
import { Modal } from "../ui/Modal";
import {
  changePassword,
  deleteAccount,
  fetchUserProfile,
  updateUserProfile,
} from "../../lib/users";
import { getErrorMessage } from "../../lib/error-handler";

export function AccountForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    variant?: "success" | "error";
  } | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["me"],
    queryFn: fetchUserProfile,
  });

  const updateForm = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setToast({
        title: "Profile updated",
        description: "Your account details are saved.",
        variant: "success",
      });
    },
    onError: (error) => {
      setToast({
        title: "Update failed",
        description: getErrorMessage(error, "Try again."),
        variant: "error",
      });
    },
  });

  useEffect(() => {
    if (profile) {
      updateForm.reset({
        name: profile.name ?? "",
        email: profile.email ?? "",
      });
    }
  }, [profile, updateForm]);

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      passwordForm.reset();
      setToast({
        title: "Password updated",
        description: "Your new password is active.",
        variant: "success",
      });
    },
    onError: (error) => {
      setToast({
        title: "Password update failed",
        description: getErrorMessage(error, "Try again."),
        variant: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      setIsDeleteOpen(false);
      router.push("/");
      setToast({
        title: "Account deleted",
        description: "Your account has been removed.",
        variant: "success",
      });
    },
    onError: (error) => {
      setToast({
        title: "Delete failed",
        description: getErrorMessage(error, "Try again."),
        variant: "error",
      });
    },
  });

  return (
    <ToastProvider>
      <div className="space-y-10">
        <section className="rounded-3xl border border-slate-700 bg-slate-800/60 p-8">
          <h2 className="font-display text-2xl font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-slate-400">
            Update your profile details and contact email.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={updateForm.handleSubmit((values) =>
              updateMutation.mutate(values)
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="account-name">Name</Label>
              <Input id="account-name" {...updateForm.register("name")} />
              {updateForm.formState.errors.name?.message && (
                <p className="text-xs text-error">
                  {updateForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-email">Email</Label>
              <Input
                id="account-email"
                type="email"
                {...updateForm.register("email")}
              />
              {updateForm.formState.errors.email?.message && (
                <p className="text-xs text-error">
                  {updateForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" isLoading={updateMutation.isPending}>
              Save changes
            </Button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-800/60 p-8">
          <h2 className="font-display text-2xl font-semibold">Change password</h2>
          <form
            className="mt-6 space-y-4"
            onSubmit={passwordForm.handleSubmit((values) =>
              passwordMutation.mutate(values)
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                {...passwordForm.register("currentPassword")}
              />
              {passwordForm.formState.errors.currentPassword?.message && (
                <p className="text-xs text-error">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword?.message && (
                <p className="text-xs text-error">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword?.message && (
                <p className="text-xs text-error">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" isLoading={passwordMutation.isPending}>
              Update password
            </Button>
          </form>
        </section>

        <section className="rounded-3xl border border-error/60 bg-error/10 p-8">
          <h2 className="font-display text-2xl font-semibold">Danger zone</h2>
          <p className="mt-2 text-sm text-slate-200">
            Deleting your account removes all projects and sessions.
          </p>
          <Button
            variant="secondary"
            className="mt-6 border-error text-error hover:border-error"
            onClick={() => setIsDeleteOpen(true)}
            type="button"
          >
            Delete account
          </Button>
        </section>
      </div>

      <Modal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete your account?"
        description="Are you sure? All projects will be deleted."
      >
        <div className="space-y-4">
          <FormError
            message={
              deleteMutation.error instanceof Error
                ? deleteMutation.error.message
                : null
            }
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => deleteMutation.mutate()}
              isLoading={deleteMutation.isPending}
            >
              Confirm delete
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        open={Boolean(toast)}
        onOpenChange={(open) => {
          if (!open) {
            setToast(null);
          }
        }}
        title={toast?.title ?? ""}
        description={toast?.description}
        variant={toast?.variant}
      />
    </ToastProvider>
  );
}

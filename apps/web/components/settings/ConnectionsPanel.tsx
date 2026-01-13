"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ConnectionService } from "@ship/shared";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Modal } from "../ui/Modal";
import { Toast, ToastProvider } from "../ui/Toast";
import {
  connectService,
  disconnectService,
  fetchConnections,
  testService,
} from "../../lib/connections";
import { getErrorMessage } from "../../lib/error-handler";

const SERVICES: { id: ConnectionService; name: string; blurb: string }[] = [
  {
    id: "claude",
    name: "Claude",
    blurb: "Planning and discovery partner.",
  },
  {
    id: "codex",
    name: "Codex",
    blurb: "Build and execution engine.",
  },
];

export function ConnectionsPanel() {
  const queryClient = useQueryClient();
  const [activeService, setActiveService] = useState<ConnectionService | null>(
    null
  );
  const [apiKey, setApiKey] = useState("");
  const [testingService, setTestingService] =
    useState<ConnectionService | null>(null);
  const [disconnectingService, setDisconnectingService] =
    useState<ConnectionService | null>(null);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    variant?: "success" | "error";
  } | null>(null);

  const { data = [], error, isLoading } = useQuery({
    queryKey: ["connections"],
    queryFn: fetchConnections,
  });

  const connectionMap = useMemo(() => {
    return new Map(data.map((item) => [item.service, item]));
  }, [data]);

  const connectMutation = useMutation({
    mutationFn: (service: ConnectionService) =>
      connectService(service, { apiKey }),
    onSuccess: () => {
      setApiKey("");
      setActiveService(null);
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      setToast({
        title: "Connection saved",
        description: "API key stored securely.",
        variant: "success",
      });
    },
    onError: (err) => {
      setToast({
        title: "Connection failed",
        description: getErrorMessage(err, "Try again."),
        variant: "error",
      });
    },
  });

  const testMutation = useMutation({
    mutationFn: (service: ConnectionService) => testService(service),
    onSuccess: (success) => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      setTestingService(null);
      setToast({
        title: success ? "Connection OK" : "Connection failed",
        description: success
          ? "We can reach the provider."
          : "Provider rejected the key.",
        variant: success ? "success" : "error",
      });
    },
    onError: (err) => {
      setTestingService(null);
      setToast({
        title: "Test failed",
        description: getErrorMessage(err, "Try again."),
        variant: "error",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: (service: ConnectionService) => disconnectService(service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      setDisconnectingService(null);
      setToast({
        title: "Disconnected",
        description: "API key removed.",
        variant: "success",
      });
    },
    onError: (err) => {
      setDisconnectingService(null);
      setToast({
        title: "Disconnect failed",
        description: getErrorMessage(err, "Try again."),
        variant: "error",
      });
    },
  });

  return (
    <ToastProvider>
      <div className="space-y-6">
        {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
        {error && (
          <FormError message={getErrorMessage(error, "Failed to load")} />
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {SERVICES.map((service) => {
            const status = connectionMap.get(service.id);
            return (
              <div
                key={service.id}
                className="rounded-3xl border border-slate-700 bg-slate-800/60 p-6"
              >
                <div className="space-y-2">
                  <p className="font-display text-2xl font-semibold">
                    {service.name}
                  </p>
                  <p className="text-sm text-slate-400">{service.blurb}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="rounded-full border border-slate-700 px-3 py-1">
                    Status: {status?.status ?? "not connected"}
                  </span>
                  {status?.lastTestedAt && (
                    <span className="rounded-full border border-slate-700 px-3 py-1">
                      Tested: {new Date(status.lastTestedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setActiveService(service.id)}
                  >
                    {status ? "Update key" : "Connect"}
                  </Button>
                  {status && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTestingService(service.id);
                          testMutation.mutate(service.id);
                        }}
                        isLoading={testingService === service.id}
                      >
                        Test
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDisconnectingService(service.id);
                          disconnectMutation.mutate(service.id);
                        }}
                        isLoading={disconnectingService === service.id}
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        open={Boolean(activeService)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveService(null);
            setApiKey("");
          }
        }}
        title="Connect API key"
        description="Your key is encrypted and stored securely."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (activeService) {
              connectMutation.mutate(activeService);
            }
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="api-key">API key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Paste your API key"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setActiveService(null);
                setApiKey("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={connectMutation.isPending}
              disabled={!apiKey}
            >
              Save key
            </Button>
          </div>
        </form>
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

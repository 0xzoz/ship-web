"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProjectSchema, type CreateProjectInput } from "@ship/shared";
import {
  createProject,
  deleteProject,
  fetchProjects,
  type Project,
} from "../../lib/projects";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

export function DashboardView() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const sortedProjects = useMemo(() => {
    return [...data].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [data]);

  const onSubmit = form.handleSubmit(async (values) => {
    await createMutation.mutateAsync(values);
    form.reset();
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Your harbor
          </p>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">
            Voyages at a glance
          </h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>New project</Button>
      </div>

      {isLoading && <p className="text-sm text-slate-400">Loading...</p>}

      {error && (
        <FormError
          message={error instanceof Error ? error.message : "Failed to load"}
        />
      )}

      {!isLoading && sortedProjects.length === 0 && (
        <div className="rounded-3xl border border-slate-700 bg-slate-800/60 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Calm waters
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold">
            No voyages yet
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
            Your harbor is empty. Launch your first project and let Ship guide
            the course.
          </p>
          <Button className="mt-6" onClick={() => setIsModalOpen(true)}>
            Start a new voyage
          </Button>
        </div>
      )}

      {sortedProjects.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => deleteMutation.mutate(project.id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-deep-navy/70 px-6">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold">
                Name your voyage
              </h3>
              <button
                className="text-slate-400 hover:text-warm-white"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="project-name">Project name</Label>
                <Input id="project-name" {...form.register("name")} />
                {form.formState.errors.name?.message && (
                  <p className="text-xs text-error">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Input
                  id="project-description"
                  {...form.register("description")}
                />
                {form.formState.errors.description?.message && (
                  <p className="text-xs text-error">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
              {createMutation.error && (
                <FormError
                  message={
                    createMutation.error instanceof Error
                      ? createMutation.error.message
                      : "Failed to create"
                  }
                />
              )}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={createMutation.isPending}>
                  Create project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

type ProjectCardProps = {
  project: Project;
  onDelete: () => void;
  isDeleting: boolean;
};

function ProjectCard({ project, onDelete, isDeleting }: ProjectCardProps) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800/60 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="font-display text-2xl font-semibold">{project.name}</p>
          <p className="text-sm text-slate-400">
            {project.description || "No description yet."}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          isLoading={isDeleting}
        >
          Delete
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <span className="rounded-full border border-slate-700 px-3 py-1">
          Phase: {project.currentPhase}
        </span>
        <span className="rounded-full border border-slate-700 px-3 py-1">
          Status: {project.status}
        </span>
      </div>
    </div>
  );
}

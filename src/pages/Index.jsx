import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddDomainForm from "@/components/AddDomainForm";
import PerspectiveManager from "@/components/PerspectiveManager";
import DomainCard from "@/components/DomainCard";
import { useParticleValues } from "@/hooks/useParticleValues";
import { buildDescription, DEFAULT_PERSPECTIVE } from "@/lib/domains";
import {
  useDomains,
  useAddDomain,
  useDeleteDomain,
  usePerspectives,
  useAddPerspective,
  useDeletePerspective,
} from "@/integrations/supabase";

const Index = () => {
  const { data: domains, isLoading, isError } = useDomains();
  const { data: perspectiveRows } = usePerspectives();
  const addDomain = useAddDomain();
  const deleteDomain = useDeleteDomain();
  const addPerspective = useAddPerspective();
  const deletePerspective = useDeletePerspective();

  const [selectedPerspective, setSelectedPerspective] =
    useState(DEFAULT_PERSPECTIVE);
  const { getValues, saveValues, removeDomain } = useParticleValues();

  const perspectives = useMemo(() => {
    const names = (perspectiveRows ?? []).map((row) => row.perspective_name);
    return [DEFAULT_PERSPECTIVE, ...names.filter((n) => n !== DEFAULT_PERSPECTIVE)];
  }, [perspectiveRows]);

  const handleAddDomain = async ({ name, type }) => {
    try {
      await addDomain.mutateAsync({
        domain_name: name,
        description: buildDescription(type),
      });
      toast.success(`${name} has been added.`);
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to add domain.");
      return false;
    }
  };

  const handleDeleteDomain = async (id) => {
    try {
      await deleteDomain.mutateAsync(id);
      removeDomain(id);
      toast.success("Domain deleted.");
    } catch (error) {
      toast.error(error.message || "Failed to delete domain.");
    }
  };

  const handleAddPerspective = async (name) => {
    try {
      await addPerspective.mutateAsync({ perspective_name: name });
      toast.success(`Perspective "${name}" added.`);
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to add perspective.");
      return false;
    }
  };

  const handleRemovePerspective = async (name) => {
    const row = (perspectiveRows ?? []).find((p) => p.perspective_name === name);
    if (!row) return;
    try {
      await deletePerspective.mutateAsync(row.id);
      if (selectedPerspective === name) {
        setSelectedPerspective(DEFAULT_PERSPECTIVE);
      }
      toast.success(`Perspective "${name}" removed.`);
    } catch (error) {
      toast.error(error.message || "Failed to remove perspective.");
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">Domain Navigator</h1>

        <AddDomainForm
          onAdd={handleAddDomain}
          isSubmitting={addDomain.isPending}
        />

        <PerspectiveManager
          perspectives={perspectives}
          onAdd={handleAddPerspective}
          onRemove={handleRemovePerspective}
          isSubmitting={addPerspective.isPending}
        />

        <div className="mb-4">
          <Select
            value={selectedPerspective}
            onValueChange={setSelectedPerspective}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a perspective" />
            </SelectTrigger>
            <SelectContent>
              {perspectives.map((perspective) => (
                <SelectItem key={perspective} value={perspective}>
                  {perspective}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {isError && (
          <p className="mt-8 text-center text-destructive">
            Error loading domains.
          </p>
        )}

        {!isLoading && !isError && (domains?.length ?? 0) === 0 && (
          <p className="mt-8 text-center text-muted-foreground">
            No domains found. Add a new domain to get started.
          </p>
        )}

        {!isLoading && !isError && (domains?.length ?? 0) > 0 && (
          <Accordion type="single" collapsible className="w-full">
            {domains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                perspective={selectedPerspective}
                values={getValues(domain.id, selectedPerspective)}
                onSaveValues={(next) =>
                  saveValues(domain.id, selectedPerspective, next)
                }
                onDelete={handleDeleteDomain}
                isDeleting={deleteDomain.isPending}
              />
            ))}
          </Accordion>
        )}
      </div>
    </main>
  );
};

export default Index;

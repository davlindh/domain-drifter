import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import { getDomainIcon, getParticles } from "@/lib/domains";

const NOT_CONFIGURED = "Not configured";

const DomainCard = ({
  domain,
  perspective,
  values,
  onSaveValues,
  onDelete,
  isDeleting,
}) => {
  const DomainIcon = getDomainIcon(domain);
  const particles = getParticles(domain);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(values);

  useEffect(() => {
    if (isEditing) setDraft(values);
  }, [isEditing, values]);

  const handleSave = () => {
    onSaveValues(draft);
    setIsEditing(false);
  };

  return (
    <AccordionItem value={`domain-${domain.id}`} className="border-none">
      <AccordionTrigger className="py-2 hover:no-underline">
        <Card className="w-full transition-shadow hover:shadow-lg">
          <CardContent className="flex items-center p-4">
            <DomainIcon className="mr-2 h-6 w-6 text-primary" />
            <span className="text-lg font-medium">{domain.domain_name}</span>
          </CardContent>
        </Card>
      </AccordionTrigger>
      <AccordionContent>
        <div className="rounded-lg bg-muted/50 p-4">
          {particles.length > 0 ? (
            <dl className="space-y-1">
              {particles.map((particle) => (
                <div key={particle} className="flex gap-2 text-sm">
                  <dt className="font-semibold">{particle}:</dt>
                  <dd>{values[particle] || NOT_CONFIGURED}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              This domain has no known type, so it has no particles to show.
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={particles.length === 0}
              onClick={() => setIsEditing(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={() => onDelete(domain.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </AccordionContent>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {domain.domain_name} — {perspective}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {particles.map((particle) => (
              <div key={particle} className="grid gap-2">
                <label htmlFor={`${domain.id}-${particle}`} className="text-sm">
                  {particle}
                </label>
                <Input
                  id={`${domain.id}-${particle}`}
                  value={draft[particle] ?? ""}
                  placeholder={NOT_CONFIGURED}
                  onChange={(event) =>
                    setDraft({ ...draft, [particle]: event.target.value })
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
};

export default DomainCard;

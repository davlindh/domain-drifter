import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { DEFAULT_PERSPECTIVE } from "@/lib/domains";

const PerspectiveManager = ({ perspectives, onAdd, onRemove, isSubmitting }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed === "" || perspectives.includes(trimmed)) return;
    const created = await onAdd(trimmed);
    if (created) setName("");
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Manage Perspectives</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <Input
            type="text"
            placeholder="New perspective name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isSubmitting || name.trim() === ""}>
            Add
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {perspectives.map((perspective) => (
            <div
              key={perspective}
              className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
            >
              <span>{perspective}</span>
              {perspective !== DEFAULT_PERSPECTIVE && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0"
                  aria-label={`Remove ${perspective}`}
                  onClick={() => onRemove(perspective)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerspectiveManager;

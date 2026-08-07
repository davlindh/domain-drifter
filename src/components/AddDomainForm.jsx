import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { domainTypes } from "@/lib/domains";

const AddDomainForm = ({ onAdd, isSubmitting }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const canSubmit = name.trim() !== "" && type !== "" && !isSubmitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    const created = await onAdd({ name: name.trim(), type });
    if (created) {
      setName("");
      setType("");
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Domain</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <Input
            type="text"
            placeholder="Enter domain name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-grow"
          />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {domainTypes.map((domainType) => (
                <SelectItem key={domainType.name} value={domainType.name}>
                  {domainType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Adding..." : "Add Domain"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDomainForm;

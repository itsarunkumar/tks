import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ContainerFormProps {
  handleContainerSubmit: (e: React.FormEvent) => void;
  newContainerName: string;
  setNewContainerName: (name: string) => void;
}

export function ContainerForm({
  handleContainerSubmit,
  newContainerName,
  setNewContainerName,
}: ContainerFormProps) {
  return (
    <form
      className="flex gap-3 justify-center"
      onSubmit={handleContainerSubmit}
    >
      <Input
        type="text"
        value={newContainerName}
        onChange={(e) => setNewContainerName(e.target.value)}
        placeholder="Enter container name"
        className="w-fit"
      />
      <Button type="submit">
        <PlusIcon className="w-5 h-5" /> Add
      </Button>
    </form>
  );
}

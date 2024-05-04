import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import type { Container } from "@/lib/types";

interface ContainerTitleProps {
  container: Container;
  handleItemSubmit: (containerId: string) => (e: React.FormEvent) => void;
  newItemName: string;
  setNewItemName: (name: string) => void;
  newItemContent: string;
  setNewItemContent: (content: string) => void;
  handleDeleteContainer: (containerId: string) => void;
}

export function ContainerTitle({
  container,
  handleItemSubmit,
  newItemName,
  setNewItemName,
  newItemContent,
  setNewItemContent,
  handleDeleteContainer,
}: ContainerTitleProps) {
  return (
    <div className="flex items-center justify-between w-full bg-slate-900 dark:bg-slate-600 text-slate-200 dark:text-slate-100 px-1 py-1 rounded-md">
      <h1 className="text-lg px-2 capitalize">{container.name}</h1>
      <div className="flex gap-2 ">
        <Popover>
          <PopoverTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <PlusIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <form
              className="flex gap-3 items-start flex-col w-full"
              onSubmit={handleItemSubmit(container.id)}
            >
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter item name"
              />
              <Label htmlFor="item-content">Item Description</Label>
              <Textarea
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                id="item-content"
                placeholder="Enter your item description"
              />
              <Button type="submit" className="self-end">
                Add Item
              </Button>
            </form>
          </PopoverContent>
        </Popover>

        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => handleDeleteContainer(container.id)}
        >
          <TrashIcon className="h-5 w-5 text-rose-500" />
        </Button>
      </div>
    </div>
  );
}

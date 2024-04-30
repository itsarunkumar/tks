import { useState, useEffect } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";

import { Droppable } from "@/Droppable";
import { Draggable } from "@/Draggable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Item {
  id: string;
  name: string;
  content: string;
  containerId: string;
}

interface Container {
  id: string;
  name: string;
  items: Item[];
}

const getInitialContainers = (): Container[] => {
  const savedState = localStorage.getItem("containersState");
  if (savedState) {
    return JSON.parse(savedState);
  } else {
    return [
      {
        id: "container1",
        name: "Container 1",
        items: [
          {
            id: "item1",
            name: "Item 1",
            containerId: "container1",
            content: "Item 1 content",
          },
          {
            id: "item2",
            name: "Item 2",
            containerId: "container1",
            content: "Item 2 content",
          },
        ],
      },
      {
        id: "container2",
        name: "Container 2",
        items: [
          {
            id: "item3",
            name: "Item 3",
            containerId: "container2",
            content: "Item 3 content",
          },
        ],
      },
    ];
  }
};

const DNDcontext = () => {
  const [containersState, setContainersState] = useState<Container[]>(
    getInitialContainers()
  );
  const [newContainerName, setNewContainerName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemContent, setNewItemContent] = useState("");

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    localStorage.setItem("containersState", JSON.stringify(containersState));
  }, [containersState]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    let sourceContainerId: string | undefined;

    containersState.map((container) => {
      if (container.items.some((item) => item.id === active.id)) {
        sourceContainerId = container.id;
      }
    });
    const targetContainerId = over.id;

    if (sourceContainerId !== targetContainerId) {
      const updatedContainers = containersState.map((container) => {
        if (container.id === sourceContainerId) {
          const updatedItems = container.items.filter(
            (item) => item.id !== active.id
          );
          return { ...container, items: updatedItems };
        }
        if (container.id === targetContainerId) {
          const draggedItem = containersState
            .find((container) =>
              container.items.some((item) => item.id === active.id)
            )
            ?.items.find((item) => item.id === active.id);

          if (draggedItem) {
            return { ...container, items: [...container.items, draggedItem] };
          }
        }
        return container;
      });

      setContainersState(updatedContainers);
    }
  };

  const handleContainerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContainerName.trim() === "") return;

    const newContainer: Container = {
      id: `container${containersState.length + 1}`,
      name: newContainerName.trim(),
      items: [],
    };

    setContainersState([...containersState, newContainer]);
    setNewContainerName("");
    setNewItemContent("");
    setNewItemName("");
  };

  const handleItemSubmit = (containerId: string) => (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() === "") return;

    const newItem: Item = {
      id: `item${Date.now()}`,
      name: newItemName.trim(),
      content: newItemContent,
      containerId,
    };

    const updatedContainers = containersState.map((container) =>
      container.id === containerId
        ? { ...container, items: [...container.items, newItem] }
        : container
    );

    setContainersState(updatedContainers);
    setNewItemName("");
  };

  const handleDeleteContainer = (containerId: string) => {
    const updatedContainers = containersState.filter(
      (container) => container.id !== containerId
    );
    setContainersState(updatedContainers);
  };

  return (
    <div className="w-full h-full p-5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToFirstScrollableAncestor]}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full h-full flex ">
          {containersState.map((container) => (
            <div key={container.id} className="h-full mx-4 ">
              <Droppable
                id={container.id}
                className=" w-80 h-full space-y-3 px-5 rounded-md shrink-0 select-none "
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="flex items-center justify-between w-full bg-slate-900 text-slate-200 px-1 py-1 rounded-md">
                    <h1 className="text-lg px-2 capitalize">
                      {container.name}
                    </h1>
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
                            <Label htmlFor="item-content">
                              Item Description
                            </Label>
                            <Textarea
                              value={newItemContent}
                              onChange={(e) =>
                                setNewItemContent(e.target.value)
                              }
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
                </div>
                {container.items.map((item) => (
                  <Draggable
                    key={item.id}
                    id={item.id}
                    className="bg-slate-100 px-4 py-4 text-slate-900 border border-slate-600 border-opacity-20 shadow-md rounded-md my-1"
                  >
                    {/* {item.name}
                    {item.content} */}
                    <Dialog>
                      <DialogTrigger className="w-full h-full text-start">
                        {item.name}
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          {/* <DialogTitle></DialogTitle> */}
                          <DialogDescription className="text-slate-900 text-lg">
                            {item.content}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </Draggable>
                ))}
              </Droppable>
            </div>
          ))}

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
        </div>
      </DndContext>
    </div>
  );
};

export default DNDcontext;

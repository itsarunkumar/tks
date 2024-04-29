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
import { TrashIcon } from "@radix-ui/react-icons";

interface Item {
  id: string;
  name: string;
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
          { id: "item1", name: "Item 1", containerId: "container1" },
          { id: "item2", name: "Item 2", containerId: "container1" },
        ],
      },
      {
        id: "container2",
        name: "Container 2",
        items: [{ id: "item3", name: "Item 3", containerId: "container2" }],
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
  };

  const handleItemSubmit = (containerId: string) => (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() === "") return;

    const newItem: Item = {
      id: `item${Date.now()}`,
      name: newItemName.trim(),
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
    <div className="w-full h-full mx-4 my-5 ">
      {/* <form onSubmit={handleContainerSubmit}>
        <input
          type="text"
          value={newContainerName}
          onChange={(e) => setNewContainerName(e.target.value)}
          placeholder="Enter container name"
        />
        <button type="submit">Add Container</button>
      </form> */}

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
                className=" w-80 h-full space-y-3 px-5 rounded-md shrink-0 select-none border-r-2 border-slate-800 border-opacity-20"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="flex items-center justify-between w-full bg-slate-900 text-slate-200 px-2 py-1 rounded-md">
                    <h1 className="text-lg">{container.name}</h1>
                    <Button
                      size={"default"}
                      variant={"ghost"}
                      onClick={() => handleDeleteContainer(container.id)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
                {container.items.map((item) => (
                  <Draggable
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    containerId={container.id}
                    className="bg-slate-100 px-4 py-4 text-slate-900 border border-slate-600 border-opacity-20 shadow-md rounded-md my-1"
                  >
                    {item.name}
                  </Draggable>
                ))}
                <form
                  className="flex gap-3 items-center"
                  onSubmit={handleItemSubmit(container.id)}
                >
                  <Input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Enter item name"
                  />
                  <Button type="submit">Add Item</Button>
                </form>
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
            />
            <Button type="submit">Add Container</Button>
          </form>
        </div>
      </DndContext>
    </div>
  );
};

export default DNDcontext;

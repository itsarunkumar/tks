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

import { Droppable } from "@/dnd/Droppable";
import { Draggable } from "@/dnd/Draggable";

import { Description } from "@/components/main/description";
import { ContainerForm } from "@/components/main/container-form";
import { ContainerTitle } from "@/components/main/container-title";

import type { Container, Item } from "@/lib/types";

const getInitialContainers = (): Container[] => {
  const savedState = localStorage.getItem("containersState");
  if (savedState) {
    return JSON.parse(savedState);
  } else {
    return [];
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
    <div className="min-h-screen overflow-hidden p-5">
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
                  <ContainerTitle
                    container={container}
                    newItemName={newItemName}
                    handleDeleteContainer={handleDeleteContainer}
                    handleItemSubmit={handleItemSubmit}
                    newItemContent={newItemContent}
                    setNewItemContent={setNewItemContent}
                    setNewItemName={setNewItemName}
                  />
                </div>
                {container.items.map((item) => (
                  <Draggable
                    key={item.id}
                    id={item.id}
                    className="bg-slate-200 px-4 py-4 text-slate-800 border border-slate-600 border-opacity-20 shadow-md rounded-md my-1"
                  >
                    <Description name={item.name} description={item.content} />
                  </Draggable>
                ))}
              </Droppable>
            </div>
          ))}
          <ContainerForm
            handleContainerSubmit={handleContainerSubmit}
            newContainerName={newContainerName}
            setNewContainerName={setNewContainerName}
          />
        </div>
      </DndContext>
    </div>
  );
};

export default DNDcontext;

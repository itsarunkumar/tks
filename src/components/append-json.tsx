import React, { useState, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { Container } from "@/lib/types";

const AppendJsonToLocalStorage: React.FC = () => {
  const [mergedData, setMergedData] = useState<Container[]>([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      console.error("No file selected");
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(
          event.target?.result as string
        ) as Container[];
        appendDataToLocalStorage(jsonData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };

    reader.readAsText(file);
  };

  const appendDataToLocalStorage = (newData: Container[]) => {
    try {
      const localStorageData = localStorage.getItem("containersState");
      let existingData: Container[] = [];

      if (localStorageData) {
        existingData = JSON.parse(localStorageData) as Container[];
      }

      const updatedData = [...existingData, ...newData];
      localStorage.setItem("containersState", JSON.stringify(updatedData));
      setMergedData(updatedData);
    } catch (error) {
      console.error("Error appending data to localStorage:", error);
    }
  };

  const importIt = () => {
    localStorage.setItem("containersState", JSON.stringify(mergedData));
    location.reload();
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <span className="self-start  text-bold text-slate-900 dark:text-slate-200">
        Import your data:
      </span>
      <div className="flex gap-2 items-center my-2 mx-1">
        <Input type="file" accept=".json" onChange={handleFileChange} />
        <Button onClick={importIt}>Import</Button>
      </div>
    </div>
  );
};

export default AppendJsonToLocalStorage;

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GearIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "../moon-toggle";
import { downloadJsonData } from "@/utils/download-json";
import { Button } from "../ui/button";
import AppendJsonToLocalStorage from "../append-json";

export default function SidebarOptions() {
  const handleDownload = () => {
    // Retrieve data from localStorage
    const localStorageData = localStorage.getItem("containersState");

    if (localStorageData) {
      try {
        // Parse the JSON data
        const parsedData = JSON.parse(localStorageData);

        // Download the JSON data
        downloadJsonData(parsedData, "tasker-data.json");
      } catch (error) {
        console.error("Error parsing or downloading JSON data:", error);
      }
    } else {
      console.warn('No data found in localStorage with key "containersState"');
    }
  };

  const handleClearData = () => {
    localStorage.setItem("containersState", JSON.stringify([]));
    location.reload();
  };

  return (
    <Sheet>
      <SheetTrigger className="absolute top-3 left-4">
        <GearIcon className=" w-5 h-5 p-0.5 rounded-md text-slate-900 dark:text-slate-200" />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between px-5 gap-4">
            <span>Options</span> <ModeToggle />
          </SheetTitle>
          <SheetDescription>
            <div className="my-4">
              <div className="flex items-center justify-between gap-4">
                <span className="self-start  text-bold text-slate-900 dark:text-slate-200">
                  Export your data
                </span>
                <Button variant={"default"} onClick={handleDownload}>
                  Export Data
                </Button>
              </div>
              <AppendJsonToLocalStorage />
              <div>
                <Button variant={"destructive"} onClick={handleClearData}>
                  Clear Data
                </Button>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

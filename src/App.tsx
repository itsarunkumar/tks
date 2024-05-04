import SidebarOptions from "./components/main/sidebar-options";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { ThemeProvider } from "./components/theme-provider";
import DNDcontext from "./dnd/dnd-context";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ScrollArea className="p-5 min-h-screen w-screen">
        <SidebarOptions />
        <DNDcontext />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </ThemeProvider>
  );
}

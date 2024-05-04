import { Drawer } from "vaul";

interface DescriptionProps {
  name: string;
  description: string;
}

export function Description({ name, description }: DescriptionProps) {
  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>
        <button className="w-full h-full text-start">{name}</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-zinc-100 dark:bg-slate-800 flex flex-col rounded-t-[10px] h-[56%] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-slate-200 mb-8" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium mb-4 text-2xl text-center">
                {name}
              </Drawer.Title>
            </div>
            <Drawer.Description className="text-center">
              {description}
            </Drawer.Description>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

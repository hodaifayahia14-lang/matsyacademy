import { useState, useMemo } from "react";
import { icons } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const iconNames = Object.keys(icons);

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return iconNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 120);
  }, [search]);

  const SelectedIcon = value ? icons[value] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2 font-normal">
          {SelectedIcon ? <SelectedIcon className="h-4 w-4" /> : null}
          {value || "Select icon…"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="start">
        <Input
          placeholder="Search icons…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
          autoFocus
        />
        <ScrollArea className="h-64">
          <div className="grid grid-cols-8 gap-1">
            {filtered.map((name) => {
              const LucideIcon = icons[name];
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => { onChange(name); setOpen(false); setSearch(""); }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent",
                    value === name && "bg-primary text-primary-foreground"
                  )}
                >
                  <LucideIcon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
          {!filtered.length && (
            <p className="py-6 text-center text-sm text-muted-foreground">No icons found</p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

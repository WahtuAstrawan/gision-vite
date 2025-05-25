import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { AlignJustify } from "lucide-react";
import ListRegion from "../molecules/ListRegion";
import { ScrollArea } from "../ui/scroll-area";

export default function MenuSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button className="absolute z-2" size={"sm"}>
          <AlignJustify></AlignJustify>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <ScrollArea className="w-full h-[750px] relative">
            <p className="font-bold text-3xl sticky top-0">All Region</p>
            <ListRegion />
          </ScrollArea>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

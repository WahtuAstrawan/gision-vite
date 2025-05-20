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

export default function InfoSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button className="absolute z-1" size={"sm"}>
          <AlignJustify></AlignJustify>
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <ScrollArea className="w-full h-[750px] relative">
            <p className="font-bold text-3xl sticky top-0 bg-background">
              All Region
            </p>
            <ListRegion />
          </ScrollArea>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

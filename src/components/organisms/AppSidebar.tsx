import * as React from "react";
import { LocateFixed, Map, Waypoints } from "lucide-react";
import TeamSwitcher from "@/components/molecules/TeamSwitcher";
import NavUser from "@/components/molecules/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import NavSections from "@/components/molecules/NavSections";

const sidebarConst = {
  teams: [
    {
      name: "Gision",
      logo: LocateFixed,
      plan: "Explore the world!",
    },
  ],
  sections: [
    {
      name: "Maps",
      url: "#",
      icon: Map,
    },
    {
      name: "Roads",
      url: "#",
      icon: Waypoints,
    },
  ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarConst.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavSections sections={sidebarConst.sections} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

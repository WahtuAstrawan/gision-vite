"use client";

import * as React from "react";
import { LocateFixed, Map, Earth, Waypoints } from "lucide-react";

import TeamSwitcher from "@/components/molecules/TeamSwitcher";
import NavProjects from "@/components/molecules/NavProjects";
import NavUser from "@/components/molecules/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { getUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import type { User, UserResponse } from "@/lib/types";
import { toast } from "sonner";

const sidebarConst = {
  teams: [
    {
      name: "Gision",
      logo: LocateFixed,
      plan: "Explore the world!",
    },
  ],
  projects: [
    {
      name: "Maps",
      url: "#",
      icon: Map,
    },
    {
      name: "All Region",
      url: "#",
      icon: Earth,
    },
    {
      name: "Streets",
      url: "#",
      icon: Waypoints,
    },
  ],
};

const defaultUser: User = {
  id: 0,
  name: "User",
  email: "default@example.com",
  email_verified_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<UserResponse | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await getUser(localStorage.getItem("token") || "");
        if (response.code === 200) {
          setUser(response);
        } else if (response.code >= 400 && response.code < 500) {
          console.error("Forbidden to get user info.");
          toast.error(`Cannot get user info: ${response.message}`);
          localStorage.clear();
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (err) {
        console.error("An error occurred while fetching data:", err);
        toast.error("Something went wrong when getting user info");
      }
    };

    getUserInfo();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarConst.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={sidebarConst.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user?.data.user || defaultUser} />
      </SidebarFooter>
    </Sidebar>
  );
}

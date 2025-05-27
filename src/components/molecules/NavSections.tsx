import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMenuStore, type MenuType } from "@/stores/menuStore";

export default function NavSections({
  sections,
}: {
  sections: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { setCurrentMenu, currentMenu } = useMenuStore();

  const handleSectionChanges = (name: string) => {
    setCurrentMenu(name as MenuType);
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
      <SidebarMenu>
        {sections.map((item) => (
          <SidebarMenuItem
            key={item.name}
            className={
              currentMenu === item.name ? "bg-muted font-semibold" : ""
            }
          >
            <SidebarMenuButton asChild>
              <a
                href={item.url}
                onClick={() => handleSectionChanges(item.name)}
              >
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

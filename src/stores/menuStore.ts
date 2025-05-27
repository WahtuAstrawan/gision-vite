import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type MenuType = "Maps" | "Roads";

interface MenuState {
  currentMenu: MenuType;
  setCurrentMenu: (menu: MenuType) => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      currentMenu: "Maps",
      setCurrentMenu: (menu: MenuType) => set({ currentMenu: menu }),
    }),
    {
      name: "menu",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

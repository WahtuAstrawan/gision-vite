import * as React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import ConfirmDialog from "@/components/atoms/ConfirmDialog";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { token, clearAuth } = useAuthStore();
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const handleLogOut = async () => {
    try {
      const response = await logout(token || "");

      if (response.meta.code === 200) {
        toast.success(response.meta.message || "Logout successfully");
        clearAuth();
        navigate("/");
      } else {
        toast.error(response.meta?.message || "Logout failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong when logout");
    }
  };

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenConfirm(true);
  };

  return (
    <>
      <div
        onClick={handleOpenDialog}
        className="flex items-center cursor-pointer px-2 py-1 w-full"
      >
        <LogOut className="mr-2" />
        Logout
      </div>

      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Logout Confirmation"
        description="Are you sure you want to logout?"
        onConfirm={() => {
          setOpenConfirm(false);
          handleLogOut();
        }}
      />
    </>
  );
}

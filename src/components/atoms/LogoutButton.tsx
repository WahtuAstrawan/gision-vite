import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/api";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await logout(token || "");

      if (response.meta?.code === 200) {
        toast.success(response.meta.message || "Logout successfully");
        localStorage.clear();
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(response.meta?.message || "Logout failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong when logout");
    }
  };

  return (
    <div onClick={handleLogOut} className="flex items-center">
      <LogOut className="mr-2" />
      Logout
    </div>
  );
}

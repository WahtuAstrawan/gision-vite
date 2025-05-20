import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { logout } from "@/lib/api";

export default function ProfileButton() {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await logout(token || "");

      if (response.meta?.code === 200) {
        toast.success(response.meta.message || "Logout successfully");
        localStorage.clear();
        navigate("/");
      } else {
        toast.error(response.meta?.message || "Logout failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong when logout");
    }
  };

  return <Button onClick={handleLogOut}>Logout</Button>;
}

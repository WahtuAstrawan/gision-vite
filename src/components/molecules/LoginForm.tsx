import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators";
import type { LoginRequest } from "@/lib/types";
import { loginUser } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { UserResponse } from "@/lib/types";
import { getUser } from "@/lib/api";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useMenuStore } from "@/stores/menuStore";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuth, clearAuth } = useAuthStore();

  const getUserInfo = async (token: string) => {
    try {
      const response: UserResponse = await getUser(token);
      if (response.meta.code === 200) {
        return response;
      } else if (response.meta.code >= 400 && response.meta.code < 500) {
        console.error("Forbidden to get user info.");
        toast.error(`Cannot get user info: ${response.meta.message}`);
        clearAuth();
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      console.error("An error occurred while fetching data:", err);
      toast.error("Something went wrong when getting user info");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setError(null);
    try {
      const response = await loginUser(data);
      if (response.meta.status === "failed") {
        setError(response.meta.message);
        return;
      }
      const token = response.meta.token;
      const user = await getUserInfo(token);

      setAuth(
        token,
        user?.data.user.name || "User",
        user?.data.user.email || "you@example.com"
      );
      useMenuStore.getState().setCurrentMenu("Maps");
      navigate("/home");
    } catch (err) {
      console.warn(err);
      setError("Login failed. Please check your email and password.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 rounded-lg"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-sm text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 rounded-lg"
          {...register("password")}
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <p className="text-sm text-red-500" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-lg font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;

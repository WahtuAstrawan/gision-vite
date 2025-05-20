import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators";
import type { LoginRequest } from "@/lib/types";
import { loginUser } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
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
      localStorage.clear();
      localStorage.setItem("token", response.meta.token);
      navigate("/home");
    } catch (err) {
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
          placeholder="password"
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
            Processing...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4 pt-8">
          <CardTitle className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            GISION
          </CardTitle>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 py-6">
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-600 pb-8">
          <p>
            Don't have an account?{" "}
            <span
              className="ml-1 text-blue-600 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

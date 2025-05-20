import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validators";
import type { RegisterRequest } from "@/lib/types";
import { registerUser } from "@/lib/api";
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

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    setError(null);
    try {
      const response = await registerUser(data);
      if (response.meta.status === "failed") {
        setError(response.meta.message);
        return;
      }
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="John Doe"
          className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 rounded-lg"
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="text-sm text-red-500" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

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
            Creating account...
          </span>
        ) : (
          "Sign Up"
        )}
      </Button>
    </form>
  );
};

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4 pt-8">
          <CardTitle className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            GISION
          </CardTitle>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 py-6">
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-600 pb-8">
          <p>
            Already have an account?{" "}
            <span
              className="ml-1 text-blue-600 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Sign In
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
export default Register;

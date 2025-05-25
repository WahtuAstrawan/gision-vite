import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/molecules/LoginForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
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
              className="ml-1 text-blue-600 cursor-pointer hover:underline"
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

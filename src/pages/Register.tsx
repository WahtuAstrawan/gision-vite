import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/molecules/RegisterForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
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
              className="ml-1 text-blue-600 cursor-pointer hover:underline"
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

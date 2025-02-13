
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("Invalid email or password. Please check your credentials or register if you don't have an account.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        // Check if email is admin
        if (data.user.email?.includes('@farmconnect.com')) {
          navigate("/admin");
          toast.success("Welcome back, Admin!");
        } else {
          navigate("/dashboard");
          toast.success("Welcome back!");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/90 border-green-600"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/90 border-green-600"
            required
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-hover"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      
      <div className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;

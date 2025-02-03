import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    if (email === "admin@farm.com" && password === "admin") {
      navigate("/admin");
      toast.success("Welcome back, Admin!");
    } else if (email && password) {
      navigate("/dashboard");
      toast.success("Welcome back, Farmer!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm animate-fade-in">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/90 border-green-600"
          required
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
        />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary-hover">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual registration
    toast.success("Registration successful! Please login.");
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm animate-fade-in">
      <Input
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="bg-white/90 border-green-600"
        required
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="bg-white/90 border-green-600"
        required
      />
      <Input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="bg-white/90 border-green-600"
        required
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="bg-white/90 border-green-600"
        required
      />
      <Button type="submit" className="w-full bg-primary hover:bg-primary-hover">
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
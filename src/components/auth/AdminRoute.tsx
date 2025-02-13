
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          toast.error("Please login to access the admin dashboard");
          navigate("/login");
          return;
        }

        const { data: isAdminData, error: adminError } = await supabase
          .rpc('is_admin', { user_id: session.user.id });

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          toast.error("Error verifying admin status");
          navigate("/login");
          return;
        }

        setIsAdmin(isAdminData);
      } catch (error) {
        console.error('Admin check error:', error);
        toast.error("Error checking admin status");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;

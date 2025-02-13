
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin } from "lucide-react";

const RecentUploads = () => {
  const { data: uploads, isLoading, error } = useQuery({
    queryKey: ['recent-uploads'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('crop_images')
        .select('*')
        .eq('farmer_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Error loading recent uploads</p>
      </Card>
    );
  }

  if (!uploads?.length) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 text-center">No uploads yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {uploads.map((upload) => (
        <Card key={upload.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <img
              src={upload.image_url}
              alt="Crop"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {upload.latitude.toFixed(6)}, {upload.longitude.toFixed(6)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Uploaded on {new Date(upload.created_at).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecentUploads;

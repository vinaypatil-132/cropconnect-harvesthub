import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Phone, MapPin, Image as ImageIcon } from "lucide-react";

interface FarmerData {
  id: string;
  name: string;
  phone: string;
  cropImages: {
    imageUrl: string;
    location: {
      latitude: number;
      longitude: number;
    };
    timestamp: string;
  }[];
}

const AdminDashboard = () => {
  const { data: farmers, isLoading, error } = useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      // This will be replaced with actual Supabase query once connected
      return [] as FarmerData[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Error loading farmer data</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold text-primary">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {farmers?.map((farmer) => (
          <Card key={farmer.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{farmer.name}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{farmer.phone}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {farmer.cropImages.map((crop, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(crop.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <img
                      src={crop.imageUrl}
                      alt="Crop"
                      className="mb-2 h-48 w-full rounded-md object-cover"
                    />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {crop.location.latitude.toFixed(6)}, {crop.location.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
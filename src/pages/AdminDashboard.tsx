
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Phone, MapPin, Image as ImageIcon, Search } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FarmerData {
  id: string;
  full_name: string;
  phone: string;
  crop_images: {
    id: string;
    image_url: string;
    latitude: number;
    longitude: number;
    created_at: string;
  }[];
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: farmers, isLoading, error } = useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone,
          crop_images (
            id,
            image_url,
            latitude,
            longitude,
            created_at
          )
        `)
        .order('full_name');

      if (profilesError) throw profilesError;
      return profiles as FarmerData[];
    },
  });

  const filteredFarmers = farmers?.filter(farmer => 
    farmer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.phone?.includes(searchTerm)
  );

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
        <p className="text-red-500">Error loading farmer data: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search farmers by name or phone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFarmers?.map((farmer) => (
          <Card key={farmer.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{farmer.full_name}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{farmer.phone}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {farmer.crop_images?.map((crop) => (
                  <div key={crop.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(crop.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <img
                      src={crop.image_url}
                      alt={`Crop from ${farmer.full_name}`}
                      className="mb-2 h-48 w-full rounded-md object-cover"
                      loading="lazy"
                    />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {crop.latitude.toFixed(6)}, {crop.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                ))}
                {(!farmer.crop_images || farmer.crop_images.length === 0) && (
                  <p className="text-center text-sm text-muted-foreground">
                    No crop images uploaded yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredFarmers?.length === 0 && (
        <div className="mt-8 text-center text-muted-foreground">
          No farmers found matching your search criteria
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

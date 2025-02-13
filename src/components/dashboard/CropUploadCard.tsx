
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CropUploadCard = () => {
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      setImage(file);
      toast.success("Image selected successfully");
    }
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    console.log("Starting location capture...");
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location captured:", position);
        setLocation(position);
        toast.success("Location captured successfully");
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Unable to get location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Please allow location access in your browser settings";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        toast.error(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  const handleUpload = async () => {
    if (!image || !location) {
      toast.error("Please select an image and capture location");
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload image to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('crop_images')
        .upload(fileName, image);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('crop_images')
        .getPublicUrl(fileName);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Insert the crop image record
      const { error: insertError } = await supabase
        .from('crop_images')
        .insert({
          farmer_id: user?.id,
          image_url: publicUrl,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

      if (insertError) throw insertError;

      toast.success("Crop image uploaded successfully!");
      setImage(null);
      setLocation(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow duration-300">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-primary">Upload Crop Image</h3>
        <p className="text-sm text-gray-600">Share your crop's progress</p>
      </div>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-primary/50 rounded-lg p-4 text-center hover:border-primary transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="crop-image"
          />
          <label
            htmlFor="crop-image"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="h-8 w-8 text-primary" />
            <span className="text-sm text-gray-600">
              {image ? image.name : "Click to upload image"}
            </span>
          </label>
        </div>

        <Button
          type="button"
          onClick={getLocation}
          variant="outline"
          className="w-full"
          disabled={isGettingLocation}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {isGettingLocation 
            ? "Getting Location..." 
            : location 
              ? "Location Captured" 
              : "Get Location"
          }
        </Button>

        <Button
          onClick={handleUpload}
          className="w-full bg-primary hover:bg-primary/90 transition-colors"
          disabled={!image || !location || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Crop Image"}
        </Button>
      </div>
    </Card>
  );
};

export default CropUploadCard;

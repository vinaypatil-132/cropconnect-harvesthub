import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, MapPin } from "lucide-react";
import { toast } from "sonner";

const CropUploadCard = () => {
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
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
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        toast.success("Location captured successfully");
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to get location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Please allow location access to continue";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
        }
        
        toast.error(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleUpload = () => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }
    
    if (!location) {
      toast.error("Please capture your location");
      return;
    }

    // TODO: Implement actual upload
    console.log("Uploading image:", image);
    console.log("Location:", {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
    
    toast.success("Crop image uploaded successfully!");
    setImage(null);
    setLocation(null);
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
          disabled={!image || !location}
        >
          Upload Crop Image
        </Button>
      </div>
    </Card>
  );
};

export default CropUploadCard;
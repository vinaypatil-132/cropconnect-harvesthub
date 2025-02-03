import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, MapPin } from "lucide-react";
import { toast } from "sonner";

const CropUploadCard = () => {
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        (error) => toast.error("Unable to get location")
      );
    }
  };

  const handleUpload = () => {
    if (!image || !location) {
      toast.error("Please select an image and allow location access");
      return;
    }
    // TODO: Implement actual upload
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
        <div className="border-2 border-dashed border-primary/50 rounded-lg p-4 text-center">
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
        >
          <MapPin className="mr-2 h-4 w-4" />
          {location ? "Location Captured" : "Get Location"}
        </Button>

        <Button
          onClick={handleUpload}
          className="w-full bg-primary hover:bg-primary-hover"
          disabled={!image || !location}
        >
          Upload Crop Image
        </Button>
      </div>
    </Card>
  );
};

export default CropUploadCard;
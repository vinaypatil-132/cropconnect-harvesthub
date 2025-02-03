import CropUploadCard from "@/components/dashboard/CropUploadCard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Farmer Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <CropUploadCard />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Recent Uploads</h2>
            <p className="text-gray-600">Your recent crop uploads will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
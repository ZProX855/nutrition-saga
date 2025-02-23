
import { FoodComparison } from "@/components/FoodComparison";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F2FCE2] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Logo container */}
        <div className="flex justify-center mb-8">
          <img 
            src="/logo.svg" 
            alt="Wellness Tracker Logo" 
            className="w-24 h-24 md:w-32 md:h-32"
          />
        </div>
        
        {/* Main content container */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-lg p-4 md:p-6">
          <FoodComparison />
        </Card>
      </div>
    </div>
  );
};

export default Index;

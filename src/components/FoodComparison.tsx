
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NutritionCard } from "./NutritionCard";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

// This would be replaced with real AI API calls
const mockGetNutrition = (food: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        calories: Math.floor(Math.random() * 500),
        protein: Math.floor(Math.random() * 30),
        carbs: Math.floor(Math.random() * 50),
        fat: Math.floor(Math.random() * 20),
        fiber: Math.floor(Math.random() * 10),
      });
    }, 1500);
  });
};

export const FoodComparison = () => {
  const [food1, setFood1] = useState("");
  const [food2, setFood2] = useState("");
  const [loading, setLoading] = useState(false);
  const [nutrition1, setNutrition1] = useState(null);
  const [nutrition2, setNutrition2] = useState(null);
  const { toast } = useToast();

  const handleCompare = async () => {
    if (!food1 || !food2) {
      toast({
        title: "Please enter both foods",
        description: "Both food items are required for comparison",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const [result1, result2] = await Promise.all([
        mockGetNutrition(food1),
        mockGetNutrition(food2),
      ]);
      setNutrition1(result1);
      setNutrition2(result2);
    } catch (error) {
      toast({
        title: "Error fetching nutrition data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Food Comparison</h1>
          <p className="text-lg text-gray-600">
            Compare the nutritional value of any two foods
          </p>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Enter first food (e.g., Apple)"
                value={food1}
                onChange={(e) => setFood1(e.target.value)}
                className="bg-white"
              />
              <Input
                placeholder="Enter second food (e.g., Banana)"
                value={food2}
                onChange={(e) => setFood2(e.target.value)}
                className="bg-white"
              />
            </div>
            <Button
              onClick={handleCompare}
              className="w-full mt-4 bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Comparing..." : "Compare Foods"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <NutritionCard
            foodName={food1}
            nutrition={nutrition1}
            isLoading={loading}
          />
          <NutritionCard
            foodName={food2}
            nutrition={nutrition2}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

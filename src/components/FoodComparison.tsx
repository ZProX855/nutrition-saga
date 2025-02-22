
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NutritionCard } from "./NutritionCard";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { searchFood } from "@/services/foodApi";

interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export const FoodComparison = () => {
  const [food1, setFood1] = useState("");
  const [food2, setFood2] = useState("");
  const [loading, setLoading] = useState(false);
  const [nutrition1, setNutrition1] = useState<NutritionFacts | null>(null);
  const [nutrition2, setNutrition2] = useState<NutritionFacts | null>(null);
  const [foodName1, setFoodName1] = useState("");
  const [foodName2, setFoodName2] = useState("");
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
        searchFood(food1),
        searchFood(food2),
      ]);
      
      setFoodName1(result1.name);
      setFoodName2(result2.name);
      
      const { name: _, ...nutrition1 } = result1;
      const { name: __, ...nutrition2 } = result2;
      
      setNutrition1(nutrition1);
      setNutrition2(nutrition2);
    } catch (error) {
      toast({
        title: "Error fetching nutrition data",
        description: error instanceof Error ? error.message : "Please try again later",
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
            foodName={foodName1}
            nutrition={nutrition1}
            isLoading={loading}
          />
          <NutritionCard
            foodName={foodName2}
            nutrition={nutrition2}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

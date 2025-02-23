
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NutritionCard } from "./NutritionCard";
import { NutritionAIChat } from "./NutritionAIChat";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { searchFood, fetchFoodCategories, type FoodCategory } from "@/services/foodApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [amount1, setAmount1] = useState("100");
  const [amount2, setAmount2] = useState("100");
  const [loading, setLoading] = useState(false);
  const [nutrition1, setNutrition1] = useState<NutritionFacts | null>(null);
  const [nutrition2, setNutrition2] = useState<NutritionFacts | null>(null);
  const [foodName1, setFoodName1] = useState("");
  const [foodName2, setFoodName2] = useState("");
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [isManualInput1, setIsManualInput1] = useState(false);
  const [isManualInput2, setIsManualInput2] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchFoodCategories();
        setCategories(data);
      } catch (error) {
        toast({
          title: "Error loading food categories",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    loadCategories();
  }, [toast]);

  const handleCompare = async () => {
    if (!food1 || !food2) {
      toast({
        title: "Please select both foods",
        description: "Both food items are required for comparison",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const [result1, result2] = await Promise.all([
        searchFood(food1, parseFloat(amount1)),
        searchFood(food2, parseFloat(amount2)),
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
    <div className="min-h-screen bg-[#FFF9F0] bg-gradient-to-br from-secondary to-white p-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <img src="/logo.svg" alt="Wellness Tracker" className="w-12 h-12" />
            <h1 className="text-4xl font-bold text-primary">Wellness Tracker</h1>
          </div>
          <p className="text-lg text-gray-600">
            Compare the nutritional value of any two foods
          </p>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsManualInput1(!isManualInput1)}
                    className="w-40"
                  >
                    {isManualInput1 ? "Select from List" : "Manual Input"}
                  </Button>
                </div>
                {isManualInput1 ? (
                  <Input
                    placeholder="Enter first food (e.g., Apple)"
                    value={food1}
                    onChange={(e) => setFood1(e.target.value)}
                    className="bg-white"
                  />
                ) : (
                  <Select onValueChange={setFood1}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select first food" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectGroup key={category.name}>
                          <SelectLabel>{category.name}</SelectLabel>
                          {category.foods.map((food) => (
                            <SelectItem key={food.id} value={food.name}>
                              {food.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                    className="w-24 bg-white"
                    min="1"
                  />
                  <span>grams</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsManualInput2(!isManualInput2)}
                    className="w-40"
                  >
                    {isManualInput2 ? "Select from List" : "Manual Input"}
                  </Button>
                </div>
                {isManualInput2 ? (
                  <Input
                    placeholder="Enter second food (e.g., Banana)"
                    value={food2}
                    onChange={(e) => setFood2(e.target.value)}
                    className="bg-white"
                  />
                ) : (
                  <Select onValueChange={setFood2}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select second food" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectGroup key={category.name}>
                          <SelectLabel>{category.name}</SelectLabel>
                          {category.foods.map((food) => (
                            <SelectItem key={food.id} value={food.name}>
                              {food.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={amount2}
                    onChange={(e) => setAmount2(e.target.value)}
                    className="w-24 bg-white"
                    min="1"
                  />
                  <span>grams</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleCompare}
              className="w-full mt-4 bg-primary hover:bg-primary/90 transition-colors"
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

        <NutritionAIChat />
      </div>
    </div>
  );
};

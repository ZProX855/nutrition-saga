
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
import { Heart, MessageSquare, Apple } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-secondary/80 to-white p-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="relative group">
              <img 
                src="lovable-uploads/f12da3fd-e1a0-4908-acef-a99f086b91e9.png" 
                alt="Wellness Tracker" 
                className="w-16 h-16 transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-fade-in">
              Wellness Tracker
            </h1>
          </div>
          <p className="text-lg text-gray-600 animate-fade-in flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-accent animate-pulse" />
            Compare the nutritional value of any two foods
          </p>
        </div>

        <Card className="bg-white/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Food Selection Column 1 */}
              <div className="space-y-4 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsManualInput1(!isManualInput1)}
                    className="w-40 hover:bg-primary/10 transition-all duration-300"
                  >
                    {isManualInput1 ? "Select from List" : "Manual Input"}
                  </Button>
                </div>
                {isManualInput1 ? (
                  <Input
                    placeholder="Enter first food (e.g., Apple)"
                    value={food1}
                    onChange={(e) => setFood1(e.target.value)}
                    className="bg-white hover:ring-2 hover:ring-primary/20 transition-all duration-300"
                  />
                ) : (
                  <Select onValueChange={setFood1}>
                    <SelectTrigger className="bg-white hover:bg-primary/5 transition-all duration-300">
                      <SelectValue placeholder="Select first food" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md">
                      {categories.map((category) => (
                        <SelectGroup key={category.name}>
                          <SelectLabel className="text-primary font-semibold">{category.name}</SelectLabel>
                          {category.foods.map((food) => (
                            <SelectItem
                              key={food.id}
                              value={food.name}
                              className="hover:bg-primary/5 transition-colors cursor-pointer"
                            >
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
                    className="w-24 bg-white hover:ring-2 hover:ring-primary/20 transition-all duration-300"
                    min="1"
                  />
                  <span>grams</span>
                </div>
              </div>

              {/* Food Selection Column 2 */}
              <div className="space-y-4 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsManualInput2(!isManualInput2)}
                    className="w-40 hover:bg-primary/10 transition-all duration-300"
                  >
                    {isManualInput2 ? "Select from List" : "Manual Input"}
                  </Button>
                </div>
                {isManualInput2 ? (
                  <Input
                    placeholder="Enter second food (e.g., Banana)"
                    value={food2}
                    onChange={(e) => setFood2(e.target.value)}
                    className="bg-white hover:ring-2 hover:ring-primary/20 transition-all duration-300"
                  />
                ) : (
                  <Select onValueChange={setFood2}>
                    <SelectTrigger className="bg-white hover:bg-primary/5 transition-all duration-300">
                      <SelectValue placeholder="Select second food" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md">
                      {categories.map((category) => (
                        <SelectGroup key={category.name}>
                          <SelectLabel className="text-primary font-semibold">{category.name}</SelectLabel>
                          {category.foods.map((food) => (
                            <SelectItem
                              key={food.id}
                              value={food.name}
                              className="hover:bg-primary/5 transition-colors cursor-pointer"
                            >
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
                    className="w-24 bg-white hover:ring-2 hover:ring-primary/20 transition-all duration-300"
                    min="1"
                  />
                  <span>grams</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleCompare}
              className="w-full mt-6 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
              disabled={loading}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Apple className="w-5 h-5 animate-pulse" />
                {loading ? "Comparing..." : "Compare Foods"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur"></div>
          <NutritionAIChat />
        </div>
      </div>
    </div>
  );
};

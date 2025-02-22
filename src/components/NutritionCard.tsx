
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface NutritionCardProps {
  foodName: string;
  nutrition: NutritionFacts | null;
  isLoading?: boolean;
}

export const NutritionCard = ({ foodName, nutrition, isLoading }: NutritionCardProps) => {
  const maxValues = {
    calories: 800,
    protein: 50,
    carbs: 100,
    fat: 50,
    fiber: 30,
  };

  const getPercentage = (value: number, max: number) => (value / max) * 100;

  const renderNutritionItem = (label: string, value: number | undefined, maxValue: number) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="outline">{value ?? 0}{label === "Calories" ? " kcal" : "g"}</Badge>
      </div>
      <Progress value={value ? getPercentage(value, maxValue) : 0} />
    </div>
  );

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          {isLoading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
          ) : (
            foodName || "Enter a food"
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))
        ) : (
          <>
            {renderNutritionItem("Calories", nutrition?.calories, maxValues.calories)}
            {renderNutritionItem("Protein", nutrition?.protein, maxValues.protein)}
            {renderNutritionItem("Carbs", nutrition?.carbs, maxValues.carbs)}
            {renderNutritionItem("Fat", nutrition?.fat, maxValues.fat)}
            {renderNutritionItem("Fiber", nutrition?.fiber, maxValues.fiber)}
          </>
        )}
      </CardContent>
    </Card>
  );
};

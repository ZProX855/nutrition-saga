
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
  nutrition: NutritionFacts;
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

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          {isLoading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
          ) : (
            foodName
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
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Calories</span>
                <Badge variant="outline">{nutrition.calories} kcal</Badge>
              </div>
              <Progress value={getPercentage(nutrition.calories, maxValues.calories)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Protein</span>
                <Badge variant="outline">{nutrition.protein}g</Badge>
              </div>
              <Progress value={getPercentage(nutrition.protein, maxValues.protein)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Carbs</span>
                <Badge variant="outline">{nutrition.carbs}g</Badge>
              </div>
              <Progress value={getPercentage(nutrition.carbs, maxValues.carbs)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Fat</span>
                <Badge variant="outline">{nutrition.fat}g</Badge>
              </div>
              <Progress value={getPercentage(nutrition.fat, maxValues.fat)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Fiber</span>
                <Badge variant="outline">{nutrition.fiber}g</Badge>
              </div>
              <Progress value={getPercentage(nutrition.fiber, maxValues.fiber)} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

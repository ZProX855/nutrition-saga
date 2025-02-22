
interface NutritionResponse {
  foods: Array<{
    fdcId: number;
    description: string;
    foodNutrients: Array<{
      nutrientId: number;
      value: number;
    }>;
  }>;
}

const NUTRIENT_IDS = {
  calories: 1008, // Energy (kcal)
  protein: 1003, // Protein
  carbs: 1005,   // Carbohydrates
  fat: 1004,     // Total fat
  fiber: 1079,   // Fiber
};

export const searchFood = async (query: string) => {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${import.meta.env.VITE_USDA_API_KEY}&query=${encodeURIComponent(
      query
    )}&pageSize=1&dataType=Survey%20%28FNDDS%29`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch food data');
  }

  const data: NutritionResponse = await response.json();
  
  if (!data.foods || data.foods.length === 0) {
    throw new Error('No food found');
  }

  const food = data.foods[0];
  const nutrients = food.foodNutrients.reduce((acc, nutrient) => {
    const value = nutrient.value || 0;
    switch (nutrient.nutrientId) {
      case NUTRIENT_IDS.calories:
        acc.calories = Math.round(value);
        break;
      case NUTRIENT_IDS.protein:
        acc.protein = Math.round(value);
        break;
      case NUTRIENT_IDS.carbs:
        acc.carbs = Math.round(value);
        break;
      case NUTRIENT_IDS.fat:
        acc.fat = Math.round(value);
        break;
      case NUTRIENT_IDS.fiber:
        acc.fiber = Math.round(value);
        break;
    }
    return acc;
  }, {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });

  return {
    name: food.description,
    ...nutrients,
  };
};

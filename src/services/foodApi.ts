interface NutritionResponse {
  foods: Array<{
    fdcId: number;
    description: string;
    foodNutrients: Array<{
      nutrientId: number;
      value: number;
    }>;
    foodCategory: string;
  }>;
}

export interface FoodCategory {
  name: string;
  foods: Array<{ id: number; name: string }>;
}

const NUTRIENT_IDS = {
  calories: 1008,
  protein: 1003,
  carbs: 1005,
  fat: 1004,
  fiber: 1079,
};

const FOOD_CATEGORIES = {
  Protein: [
    'Chicken Breast',
    'Salmon',
    'Beef Steak',
    'Eggs',
    'Tofu',
    'Turkey Breast',
    'Shrimp',
    'Tuna',
    'Pork Chop',
    'Greek Yogurt'
  ],
  Carbs: [
    'White Rice',
    'Brown Rice',
    'Bread',
    'Pasta',
    'Potato',
    'Sweet Potato',
    'Quinoa',
    'Oats',
    'Corn',
    'Black Beans'
  ],
  Fat: [
    'Avocado',
    'Olive Oil',
    'Almonds',
    'Peanut Butter',
    'Walnuts',
    'Coconut Oil',
    'Chia Seeds',
    'Flax Seeds',
    'Cashews',
    'Macadamia Nuts'
  ],
  Fruit: [
    'Apple',
    'Banana',
    'Orange',
    'Strawberry',
    'Blueberry',
    'Mango',
    'Pineapple',
    'Grapes',
    'Watermelon',
    'Peach'
  ],
  Dairy: [
    'Milk',
    'Yogurt',
    'Cheese',
    'Cottage Cheese',
    'Mozzarella',
    'Butter',
    'Cream Cheese',
    'Sour Cream',
    'Ice Cream',
    'Whey Protein'
  ],
  Vegetables: [
    'Broccoli',
    'Spinach',
    'Carrot',
    'Bell Pepper',
    'Tomato',
    'Cucumber',
    'Lettuce',
    'Zucchini',
    'Asparagus',
    'Green Beans'
  ]
};

const USDA_API_KEY = '5clelL7NN1oTh4FgfzaIDjcaa8yj7NL8oJHV4GSu';

export const fetchFoodCategories = async (): Promise<FoodCategory[]> => {
  const categories: FoodCategory[] = [];
  
  for (const [category, foods] of Object.entries(FOOD_CATEGORIES)) {
    const foodList = await Promise.all(
      foods.map(async (food) => {
        try {
          const response = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
              food
            )}&pageSize=1&dataType=Survey%20%28FNDDS%29`
          );
          
          if (!response.ok) return null;
          
          const data: NutritionResponse = await response.json();
          if (data.foods && data.foods.length > 0) {
            return {
              id: data.foods[0].fdcId,
              name: data.foods[0].description,
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching food: ${food}`, error);
          return null;
        }
      })
    );

    categories.push({
      name: category,
      foods: foodList.filter((food): food is { id: number; name: string } => food !== null),
    });
  }

  return categories;
};

export const searchFood = async (query: string, amount: number = 100) => {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
      query
    )}&pageSize=5&dataType=Survey%20%28FNDDS%29`,
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
    const value = (nutrient.value || 0) * (amount / 100);
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

export const generateAIResponse = async (prompt: string) => {
  const formattedPrompt = `As a friendly nutrition doctor, I'll help you with your question. Please respond with organized bullet points, using emojis, and maintain an engaging conversation: ${prompt}`;
  
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDmoumroXhKpFdcPBqhrw6W6F_PZp--LMI',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: formattedPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to generate AI response');
  }

  const data = await response.json();
  
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid response format from AI');
  }

  return data.candidates[0].content.parts[0].text;
};

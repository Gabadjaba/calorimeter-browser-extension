export interface FoodItem {
  name: string | null
  weight: number | null
  calories: number | null
  quantity: number | null
}

export interface CalculatedFoodItem extends FoodItem {
  fullCalories: number | null
}

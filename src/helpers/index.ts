import { CalculatedFoodItem, FoodItem } from './indexDB/types'

const UNITS: { [key: string]: number } = {
  'кг': 1000,
  'л': 1000,
  'г': 1,
  'мл': 1
}

export const calcCalories = (
  products: FoodItem[]
): {
  calculatedItems: CalculatedFoodItem[]
  totalCalories: number // сумма калорий по всем элементам
} => {
  let total = 0

  const calculatedItems = products.map((item) => {
    let fullCals: number | null = null

    if (item.weight !== null && item.calories !== null) {
      fullCals = ((item.calories * item.weight) / 100) * (item.quantity || 1)
      total += fullCals
    }

    const calculatedItem: CalculatedFoodItem = {
      ...item,
      fullCalories: fullCals
    }
    return calculatedItem
  })

  return {
    calculatedItems,
    totalCalories: total
  }
}

export const convertToGram = (value: string): number => {
  const unitsPattern = Object.keys(UNITS).join('|') // "л|г|мл"
  const match = value.match(
    new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(${unitsPattern})`, 'i')
  )

  if (!match) {
    console.warn('Не удалось распарсить:', value)
    return 0
  }

  const number = parseFloat(match[1].replace(',', '.')) // Заменяем запятую на точку
  const unit = match[2].toLowerCase()

  return number * UNITS[unit]
}

// const isNull = (value: any) => {
//   return value == null || value === '' || Number.isNaN(value)
// }

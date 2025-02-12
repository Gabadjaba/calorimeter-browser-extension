import { Database } from '../../../helpers/indexDB'

export interface FoodCardProps {
  cardDivName: string
  headerDivName: string
  productValueDivName: string
  productWeightDivName: string
  calEnergyDivName: string
  calEnergyTypeDivName: string
  calEnergyValueDivName: string
  db: Database
}

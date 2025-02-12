import { Database } from '../../../helpers/indexDB'
import { VueAppCartCalories } from '../../../components/cart-calories'

export interface CartProps {
  cartRoot: string
  cartItem: string
  cartItemName: string
  cartQuantity: string
  cartCaloriesApp: VueAppCartCalories
  db: Database
}

export interface ProductList {
  productName: string
  productQuantity: string
}

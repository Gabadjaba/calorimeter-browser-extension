import { CartProps, ProductList } from './types'
import { Database } from '../../../helpers/indexDB'
import { VueAppCartCalories } from '../../../components/cart-calories'
import { calcCalories } from '../../../helpers'

export class Cart {
  cartRoot: string
  cartItem: string
  cartItemName: string
  cartQuantity: string
  cartCaloriesApp: VueAppCartCalories

  private _db: Database

  constructor({
    cartRoot,
    cartItem,
    cartItemName,
    cartQuantity,
    cartCaloriesApp,
    db
  }: CartProps) {
    this.cartRoot = cartRoot
    this.cartItem = cartItem
    this.cartItemName = cartItemName
    this.cartQuantity = cartQuantity
    this.cartCaloriesApp = cartCaloriesApp

    this._db = db
  }

  private get _cartRootContainer() {
    if (!this.cartRoot) return null
    return document.querySelector(this.cartRoot)
  }

  private get _cartItems() {
    if (!this.cartItem || !this._cartRootContainer) return null
    return this._cartRootContainer.querySelectorAll(this.cartItem)
  }

  get products() {
    if (!this._cartItems) {
      return []
    }
    const list: ProductList[] = []

    this._cartItems.forEach((item) => {
      const productName = item.querySelector(this.cartItemName)
      const productQuantity = item.querySelector(this.cartQuantity)

      if (productName?.textContent && productQuantity?.textContent) {
        list.push({
          productName: productName.textContent,
          productQuantity: productQuantity.textContent
        })
      }
    })

    return list
  }

  private _clearCart() {
    this.cartCaloriesApp.componentData.items = []
    this.cartCaloriesApp.componentData.sum = 0
  }

  private _updateCurrentCart() {
    const mappedProducts = this.products.map((product) => product.productName)

    if (mappedProducts.length) {
      this._db.getMultipleData(mappedProducts).then((e) => {
        const { calculatedItems, totalCalories } = calcCalories(e)

        if (this.cartCaloriesApp) {
          this.cartCaloriesApp.componentData.items = calculatedItems
          this.cartCaloriesApp.componentData.sum = totalCalories
        }
      })
    } else {
      this._clearCart()
    }
  }

  update() {
    if (!this.products || !this.products.length) {
      console.warn('No products found')
      this._clearCart()
      return
    }

    this.products.forEach((item) => {
      this._db
        .updateField(item.productName, 'quantity', item.productQuantity)
        .then(() => {
          this._updateCurrentCart()
        })
    })
  }
}

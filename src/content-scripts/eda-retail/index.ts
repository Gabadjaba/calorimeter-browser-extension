import { FoodCard } from './foodCard'
import { Database } from '../../helpers/indexDB'
import { VueAppCartCalories } from '../../components/cart-calories'
import { Cart } from './cart'

export const DB_STORE_NAME = 'VKUSVILL'

const FOOD_CARD_CLASSES = {
  cardDivName: '.fullCard_fqhmegd',
  headerDivName: '.UiKitProductFullCard_header',
  productValueDivName: '.ProductFullCardName_cardName',
  productWeightDivName: '.ProductFullCardName_weight',
  calEnergyDivName: '.UiKitProductCardEnergyValues_item',
  calEnergyTypeDivName: '.UiKitProductCardEnergyValues_name',
  calEnergyValueDivName: '.UiKitProductCardEnergyValues_value'
}

const FOOD_CARD_CLASSES_TO_WATCH = [
  'UiKitProductCardEnergyValues_root',
  'UiKitProductFullCard_header'
]

const CART_CLASSES = {
  cartRoot: '.NewCart_root',
  cartItem: '.NewCartContent_item',
  cartItemName: '.UiKitProductCardRow_name',
  cartQuantity: '.UiKitCounter_valueContainer'
}

const CART_CLASSES_TO_WATCH = [
  'UiKitProductCardRow_name',
  'UiKitCounter_valueContainer'
]

const WHITE_LIST = ['retail']

const init = () => {
  const db = new Database(DB_STORE_NAME)

  const cartCalories = new VueAppCartCalories(document.body)
  cartCalories.bindApp()
  cartCalories.componentData.show = false

  const foodCard = new FoodCard({
    ...FOOD_CARD_CLASSES,
    db
  })

  const cart = new Cart({
    ...CART_CLASSES,
    cartCaloriesApp: cartCalories,
    db
  })

  const targetNode = document.querySelector('body')
  const config = {
    childList: true,
    attributes: false,
    characterData: true,
    subtree: true
  }

  const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
    if (!WHITE_LIST.some((site) => window.location.href.includes(site))) {
      return
    }

    cartCalories.componentData.show = true

    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement

            const divs = element.querySelectorAll('div')

            // Food Card
            divs.forEach((div) => {
              FOOD_CARD_CLASSES_TO_WATCH.forEach((className) => {
                if (div.classList.contains(className)) {
                  foodCard.saveData()
                  cart.update()
                }
              })

              CART_CLASSES_TO_WATCH.forEach((className) => {
                if (div.classList.contains(className)) {
                  cart.update()
                }
              })
            })
          }
        })

        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement

            const divs = element.querySelectorAll('div')
            divs.forEach((div) => {
              CART_CLASSES_TO_WATCH.forEach((className) => {
                if (div.classList.contains(className)) {
                  cart.update()
                }
              })
            })
          }
        })
      } else if (
        mutation.type === 'characterData' &&
        mutation.target.parentElement
      ) {
        const span = mutation.target.parentElement.closest(
          '.UiKitCounter_valueContainer'
        )
        if (span) {
          cart.update()
        }
      }
    }
  })

  if (targetNode) {
    observer.observe(targetNode, config)
  } else {
    console.warn('Target node не найден!')
  }
}

init()

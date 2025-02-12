import { FoodItem } from '../../../helpers/indexDB/types'
import { FoodCardProps } from './types'
import { Database } from '../../../helpers/indexDB'
import { convertToMilliliters } from '../../../helpers'

export class FoodCard {
  cardDivName: string
  headerDivName: string
  productValueDivName: string
  productWeightDivName: string
  calEnergyDivName: string
  calEnergyTypeDivName: string
  calEnergyValueDivName: string

  private _db: Database

  constructor({
    cardDivName,
    headerDivName,
    productValueDivName,
    productWeightDivName,
    calEnergyDivName,
    calEnergyTypeDivName,
    calEnergyValueDivName,
    db
  }: FoodCardProps) {
    this.cardDivName = cardDivName
    this.headerDivName = headerDivName
    this.productValueDivName = productValueDivName
    this.productWeightDivName = productWeightDivName
    this.calEnergyDivName = calEnergyDivName
    this.calEnergyTypeDivName = calEnergyTypeDivName
    this.calEnergyValueDivName = calEnergyValueDivName

    this._db = db
  }

  private get _cardDiv(): Element | null {
    if (!this.cardDivName) return null
    return document.querySelector(this.cardDivName)
  }

  private get _headerDiv(): Element | null {
    if (!this._cardDiv) return null
    return this._cardDiv.querySelector(this.headerDivName)
  }

  private get _calEnergyDiv(): NodeListOf<Element> | null {
    if (!this._cardDiv) return null
    return this._cardDiv.querySelectorAll(this.calEnergyDivName)
  }

  private get _foodName(): string | null {
    if (!this._headerDiv) return null

    const nameContainer = this._headerDiv.querySelector(
      this.productValueDivName
    )

    if (nameContainer?.textContent) {
      return nameContainer.textContent
    }

    console.warn('_foodName', 'нет данных названия')

    return null
  }

  private _setFullCalOnCard(weightContainer: Element, value: number): void {
    const containerId = 'cal-id'
    if (this._calEnergyValue) {
      const fullCal = (this._calEnergyValue * value / 100).toFixed(0)

      const container = document.querySelector(`#${containerId}`) || document.createElement('span')

      container.id = containerId
      container.classList.add('UiKitPrice_new')
      container.textContent = `\u00A0${fullCal}\u00A0ккал`

      weightContainer.append(container)
    }
  }

  private get _foodWeight(): number | null {
    if (!this._headerDiv) return null

    const weightContainer = this._headerDiv.querySelector(this.productWeightDivName)

    if (weightContainer?.firstChild && weightContainer.firstChild.nodeValue) {
      const value = convertToMilliliters(weightContainer.firstChild.nodeValue)

      this._setFullCalOnCard(weightContainer, value)

      return value
    }

    console.warn('_foodWeight', 'Нет данных веса')
    return null
  }

  private get _calEnergyValue(): number | null {
    if (!this._calEnergyDiv) return null

    let value = null

    this._calEnergyDiv.forEach((item) => {
      const nameElement = item.querySelector(this.calEnergyTypeDivName)
      if (nameElement && nameElement?.textContent?.includes('ккал')) {
        const caloriesValue = item.querySelector(this.calEnergyValueDivName)

        if (caloriesValue?.textContent) {
          value = parseFloat(caloriesValue.textContent)
        }

      }
    })

    if (!value) {
      console.warn('_calEnergyValue:', value)
      value = 0
      return value
    }

    return value
  }

  get foodItem(): FoodItem | null {
    if (
      !this._cardDiv ||
      !this._foodName
      // !this._foodWeight ||
      // !this._calEnergyValue
    ) {
      return null
    }

    return {
      name: this._foodName,
      weight: this._foodWeight,
      calories: this._calEnergyValue,
      quantity: null
    }
  }

  saveData() {
    console.log(this.foodItem)
    if (this.foodItem && !this._db.sessionRecords.has(this.foodItem.name)) {
      this._db
        .addData(this.foodItem)
        .then(() => {
          console.warn('foodItem added to db:', this.foodItem)
        })
        .catch((e) => {
          console.error('watchChanges', 'Ошибка сохранения')
          console.error(e)
        })
    }
  }
}

import { App, createApp, h, reactive } from 'vue'
import CartCalories, { Props } from './CartCalories.vue'
import clickOutside from '../../directives/clickOutside'

export class VueAppCartCalories {
  APP_ID = 'calorimeter-app-id'

  app: App<Element> | null
  mountElement: HTMLDivElement | null
  componentData: Props

  rootElement: HTMLElement

  constructor(rootElement: HTMLElement) {
    this.app = null
    this.mountElement = null
    this.rootElement = rootElement
    this.componentData = reactive({
      items: [],
      sum: 0,
      show: false
    })
  }

  bindApp() {
    if (!this.rootElement) {
      console.warn('No root element found.')
      return
    }

    if (document.getElementById(this.APP_ID)) {
      console.warn('Root element already exists.')
      return
    }

    this.mountElement = document.createElement('div')
    this.mountElement.id = this.APP_ID

    this.rootElement.append(this.mountElement)

    const propsData = this.componentData

    const Root = {
      setup() {
        return () => h(CartCalories, propsData)
      }
    }

    const app = createApp(Root)
    app.directive('click-outside', clickOutside)
    app.mount(this.mountElement)
  }
}

export default {
  handler: (event: any): void => {},
  beforeMount(el: HTMLElement, binding: any) {
    this.handler = function (event: any): void {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', this.handler)
  },
  unmounted() {
    document.removeEventListener('click', this.handler)
  }
}

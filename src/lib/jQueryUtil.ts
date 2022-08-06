export const jQueryUtil = ($: JQueryStatic) => {
  $.fn.cssText = function (cssText) {
    this[0].style.cssText = cssText
    return this
  }
  $.fn.frameDoc = function () {
    const frameDocs = this.get()
      .map(d => (d as HTMLIFrameElement | HTMLObjectElement)?.contentDocument)
      .filter((d): d is Document => !!d)
    if (!frameDocs.length) return $()
    return $(frameDocs as any)
  }
  $.fn.findLog = function (selector) {
    const $el = this.find(selector)
    console.log('this', this.get())
    console.log(selector, $el.get())
    return $el
  }
  $.fn.childrenLog = function (selector) {
    const $el = this.children(selector)
    console.log(selector, $el.get())
    return $el
  }
  $.fn.arrive = function (selector, onArrive, opt) {
    const observer = new MutationObserver((...args) => {
      const arrived = this.find(selector).get()
      if (arrived.length) onArrive(arrived, ...args)
    })
    const arrived = this.find(selector).get()
    if (arrived.length) onArrive(arrived)
    if (this[0]) observer.observe(this[0], opt ?? { attributes: false, childList: true, subtree: true })
    return this
  }
}

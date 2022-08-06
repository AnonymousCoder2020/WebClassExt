interface JQuery {
  cssText(cssText: string): JQuery
  frameDoc(): JQuery<Document>
  findLog(selector: string): JQuery
  childrenLog(selector: string): JQuery
  arrive(
    selector: string,
    onArrive: (findedElement: HTMLElement[], mutations?: MutationRecord[], observer?: MutationObserver) => void,
    opt?: MutationObserverInit
  ): JQuery
}

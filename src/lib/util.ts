export const unescapeHTML = (html: string) => new DOMParser().parseFromString(html, 'text/html').documentElement.textContent ?? ''

export const regularUrl = (url: string) => new URL(url, location.href).toString()

export const parseDom = (htmlTxt: string) => new DOMParser().parseFromString(htmlTxt, 'text/html')

export const conversion = (sec: number, by: number[]) => {
  const res = [sec]
  for (const unit of by) {
    const last = res[res.length - 1]
    const carry = Math.floor(last / unit)
    if (carry <= 0) break
    const remainder = last % unit
    res[res.length - 1] = remainder
    res.push(carry)
  }
  return res
}

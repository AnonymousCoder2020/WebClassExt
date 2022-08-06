export const unescapeHTML = (html: string) => new DOMParser().parseFromString(html, 'text/html').documentElement.textContent ?? ''

export const regularUrl = (url: string) => new URL(url, location.href).toString()

export const parseDom = (htmlTxt: string) => new DOMParser().parseFromString(htmlTxt, 'text/html')

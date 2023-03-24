import $ from 'jquery'
import { unescapeHTML, regularUrl } from '~/lib/util'
import { extWarn } from './extLog'
import { jQueryUtil } from '~lib/jQueryUtil'

jQueryUtil($)
$(() => {
  // frame要素ごとに実行
  const dl = (links: HTMLElement[]) => {
    // クリックされたらダウンロード開始
    links.forEach(async link => {
      const $link = $(link)
      const href = $link.attr('href')
      const txt = $link.text()
      if (!href) return extWarn(link, `のhrefプロパティが見つかりませんでした。`)
      const html = await (await fetch(regularUrl(href))).text()
      const urlHtml = html.match(/(?<=<a href='\/).+?(?='>)/im)?.[0]
      if (!urlHtml) return extWarn(href, 'にURLが記載されていませんでした。')
      const newLink = $('<a>')
        .text(txt)
        .attr({ href: 'https://ed24lb.osaka-sandai.ac.jp/' + unescapeHTML(urlHtml), target: '_blank' })[0]
      $(link).after(newLink)
      link.remove()
    })
  }
  dl($('a[target="download"]').get())
})

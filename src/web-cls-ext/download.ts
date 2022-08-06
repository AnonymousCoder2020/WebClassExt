import $ from 'jquery'
import { unescapeHTML, regularUrl } from '~/lib/util'
import { extLog, extWarn } from './extLog'
import { jQueryUtil } from '~lib/jQueryUtil'

jQueryUtil($)
$(() => {
  extLog('shortcut download')
  const $frameDoc = $('frame[name="webclass_chapter"],frame[name="answer"]').frameDoc()
  if (!$frameDoc[0]) return extLog('フレームが見つかりません。')
  const completeLinkEls: HTMLElement[] = []
  const dl = () => {
    const $links = $frameDoc.find('a[target="download"]')
    const links = $links.get()
    console.log($links.get())
    if (!$links[0] || links.every(link => completeLinkEls.some(el => link === el))) return
    completeLinkEls.push(...links)
    // クリックされたらダウンロード開始
    $links.on('click', async e => {
      e.preventDefault()
      const href = $(e.target).attr('href')
      if (!href) return extWarn(e.target, `のhrefプロパティが見つかりませんでした。`)
      const html = await (await fetch(regularUrl(href))).text()
      const urlHtml = html.match(/(?<=<a href='\/).+?(?='>)/im)?.[0]
      if (!urlHtml) return extWarn(href, 'にURLが記載されていませんでした。')
      $('<a>')
        .attr({ href: 'https://ed24lb.osaka-sandai.ac.jp/' + unescapeHTML(urlHtml), target: '_blank' })[0]
        .click()
    })
  }
  dl()
  const observer = new MutationObserver(dl)
  observer.observe($frameDoc[0], { attributes: false, childList: true, subtree: true })
})

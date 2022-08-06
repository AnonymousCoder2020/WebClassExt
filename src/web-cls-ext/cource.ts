// ボツファイル
import $ from 'jquery'
import { jQueryUtil } from '~/lib/jQueryUtil'
import { goErr } from 'next-ts-utility'
import { parseDom } from '~lib/util'
jQueryUtil($)

$(() => {
  $(document)
    .find('#js-contents .tab-content a[href^="/webclass/do_contents.php"]')
    .get()
    .forEach(link => {
      const $link = $(link)
      const contentId = $link.attr('href')?.match(/(?<=set_contents_id=)[a-z\d]+/)?.[0]
      const infoUrl = `/webclass/show_info.php?set_contents_id=${contentId}`
      if (!infoUrl) return
      $link.attr('')
      $link.on('click', async e => {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        const [htmlTxt] = await goErr(async () => await (await fetch(infoUrl)).text())
        if (!htmlTxt) return
        const infoTxt = $(parseDom(htmlTxt)).find('#ContentInfo').find('tr:nth-child(2) p').html()
        console.log(infoTxt)
        if (!/\S/.test(infoTxt)) console.log(htmlTxt)
      })
    })
})

import $ from 'jquery'
import { jQueryUtil } from '~lib/jQueryUtil'
import { conversion } from '~lib/util'
import dayjs from 'dayjs'

jQueryUtil($)

$(() => {
  const timeUnits = [60, 60, 24, 365]
  const timeUnitShows = ['秒', '分', '時間', '日', '年']
  $('.cm-contentsList_contentDetailListItemData')
    .get()
    .forEach(el => {
      const timeTxts = el.textContent?.trim()?.split(' - ')
      if (!timeTxts?.length) return
      const [start, end] = timeTxts
      if (!end) return
      const startUnix = dayjs(start, 'YYYY/MM/DD hh:mm').unix()
      const endUnix = dayjs(end, 'YYYY/MM/DD hh:mm').unix()
      const $timeMsg = $('<div>').addClass('web-cls-ext_time-msg').css({ color: '#e31102', display: 'inline-block' })
      $timeMsg.appendTo($(el).closest('.cm-contentsList_contentDetailListItem'))
      let timer: NodeJS.Timer | undefined
      //#bce8f1
      const timerUpdater = () => {
        const nowUnix = dayjs().unix()
        //  now <-(+ toEndSec)-> end
        const [toStartSec, toEndSec] = [startUnix, endUnix].map(sec => sec - nowUnix)
        const isBefore = 0 < toStartSec
        if (toEndSec < 0) {
          clearTimeout(timer)
          $timeMsg.remove() // 正常に動くかデバッグ
          return
        }
        const show = conversion(Math.abs(isBefore ? toStartSec : toEndSec), timeUnits)
          .map((unit, i) => unit + timeUnitShows[i])
          .reverse()
          .join('')
        $timeMsg.text(`${show} 後${isBefore ? 'OPEN' : '〆'}`)
        $timeMsg.css(!isBefore && toEndSec < 604_800 ? { fontWeight: 'bold' } : { color: isBefore ? '#bce8f1' : 'rgba(227, 17, 2, .5)' })
      }

      // 1秒ごとに表示を更新
      timerUpdater()
      timer = setInterval(timerUpdater, 1000)
    })
})

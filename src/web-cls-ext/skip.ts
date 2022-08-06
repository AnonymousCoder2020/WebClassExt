import $ from 'jquery'
import { jQueryUtil } from '~lib/jQueryUtil'
import { extLog } from './extLog'
extLog('skip')

jQueryUtil($)

$(() => {
  $('frame[name="contentsInfo"]')
    .frameDoc()
    .find('body')
    .arrive('#ContentInfo', tables => {
      const $tables = $(tables)
      $tables.arrive('tbody>tr:nth-child(2)', trs => {
        $(trs).arrive('p', ps => {
          const txt = $(ps).text()
          if (/\S/.test(txt)) return
          $tables.next('table').find('input[name="next"]')[0]?.click()
        })
      })
    })
})

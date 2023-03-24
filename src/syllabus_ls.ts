// https://j29-asw.osaka-sandai.ac.jp/uniasv2/AGA130PSC01EventAction.do
import $ from 'jquery'
import { webClsExtBrowserStorage } from './storage_type'
$(() => {
  const refers = $('[name="ERefer"]').get()
  if (refers.length !== 1) return
  webClsExtBrowserStorage.remove(['syllabus'])
  refers[0].click()
})

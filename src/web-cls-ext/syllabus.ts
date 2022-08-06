import { extLog } from './extLog'
import $ from 'jquery'
import { webClsExtBrowserStorage, WebClsExtStorage } from './storage_type'

extLog('syllabus')
$(async () => {
  const { syllabus } = (await webClsExtBrowserStorage.get(['syllabus'])) as WebClsExtStorage
  if (!syllabus) return
  const { day, period, title, name, term } = syllabus

  const $contents = $('#contents')
  const $inputs = $contents.find('.tablearea>.input>tbody tr')

  // 講義タイトルの入力
  const titleInput = $('input[type="text"][id^="txtSbj"]')[0] as HTMLInputElement
  titleInput.value = title
  // 講義時間の入力
  const checkbox = $inputs.eq(11).find('td>table>tbody>tr').eq(period).children('td').eq(day).children('input[type="checkbox"]')[0] as HTMLInputElement
  checkbox.checked = true
  // 教授名の入力
  $inputs
    .eq(8)
    .find('td>input[type="text"]')
    .get()
    .forEach((input, i) => {
      ;(input as HTMLInputElement).value = name[i]
    })
  // 前期・後期の選択
  const termSelect = $inputs.eq(10).find('td>select')[0] as HTMLSelectElement
  termSelect.selectedIndex = term
  // 検索画面へ移行
  $contents.find('.buttonarea>input[type="submit"][name="ESearch"]')[0].click()
})

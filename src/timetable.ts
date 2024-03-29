import $ from 'jquery'
import './timetable.css'
import dayjs from 'dayjs'
import { webClsExtBrowserStorage } from './storage_type'

$(() => {
  const weeks = '月火水木金土'.split('')
  const subjectTitleEl = $('.courseTree-levelTitle')
    .get()
    .find(el => ~$(el).text().indexOf('登録科目一覧'))
  if (!subjectTitleEl) return console.warn('登録科目一覧のタイトルを見つけられませんでした。- WebClsExt')

  const subjectContainer = subjectTitleEl.parentElement
  subjectContainer && $('#courses_list_left').prepend(subjectContainer)

  const $container = $(subjectTitleEl).nextAll('.courseTree').find('.courseList')

  const weekLs: JQuery[][] = Array(6)
    .fill(void 0)
    .map(() => [
      ...Array(weeks.length)
        .fill(void 0)
        .map(() => $('<td>'))
    ])

  // 年度を取得
  const yearStr = $('select.form-control[name="year"]').val()
  const isYearStr = typeof yearStr === 'string'
  if (!isYearStr) console.warn('年度を見つけられませんでした。- WebClsExt')
  const year = isYearStr ? parseInt(yearStr, 10) : dayjs().year()

  // 時間割情報を取得
  $container
    .children()
    .get()
    .forEach(li => {
      const { week, period, title, name, semester } =
        li.textContent?.match(
          /»[\s　](?<week>[月火水木金土日])(?<period>\d)(?<semester>[前後])[\s　](?<title>[^\d\s\/０-９]+)[\S]*[\s　][a-zA-Z]+[\s　](?<name>(?:　|[^\d\s\/0-9０-９])+)/
        )?.groups ?? {}
      const weekIdx = weeks.findIndex(w => w === week)
      if (!~weekIdx) return
      const liVal: (HTMLElement | string)[] = $(li).children('.course-data-box-normal').children().clone().get()

      // コースタイトルの全角英数字を半角に変換
      const $courceLink = $(liVal).find('a')
      $courceLink.text(
        $courceLink
          .text()
          .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
          .replace(/^» [月火水木金土日]\d[前後]| \d{4} $/g, '')
      )

      const periodNum = parseInt(period, 10) - 1

      // シラバス用データをパース
      const splitedName = name.split(/\s|　/)
      if (splitedName.length !== 2) return console.warn('教授名が正常にパースされませんでした。- WebClsExt')
      const termDic = { 前: 1, 後: 2 }
      const term = termDic[semester as '前' | '後'] ?? 0
      // シラバスへのリンク
      liVal.push(
        $('<a>')
          .addClass('syllabus-link')
          .attr({
            href: 'https://j04-asw.osaka-sandai.ac.jp/uniasv2/AGA130.do?REQ_PRFR_MNU_ID=MSTD2005',
            /*前のURL'https://j29-asw.osaka-sandai.ac.jp/uniasv2/UnSSOLoginControlFree'*/ target: '_blank'
          })
          .text('シラバス')
          .on('click', () => {
            webClsExtBrowserStorage.set({
              syllabus: { year, period: periodNum, day: weekIdx, title, name: splitedName as [string, string], term }
            })
          })[0]
      )

      $(weekLs[periodNum][weekIdx]).append(...liVal)
    })

  // 時間割の作成
  const trLs = weekLs.map(row => $('<tr>').append(row)[0])
  $('<table>').attr('id', 'cource-table').append(trLs).prependTo($container)

  $container.css({ position: 'relative', display: 'table' })
})

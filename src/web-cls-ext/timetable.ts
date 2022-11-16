import $ from 'jquery'
import { extWarn } from './extLog'
import './timetable.css'
import { webClsExtBrowserStorage } from './storage_type'

$(() => {
  const weeks = '月火水木金土'.split('')
  const subjectTitleEl = $('.courseTree-levelTitle')
    .get()
    .find(el => ~$(el).text().indexOf('登録科目一覧'))
  if (!subjectTitleEl) return extWarn(`登録科目一覧のタイトルを見つけられませんでした。`)

  const subjectContainer = subjectTitleEl.parentElement
  subjectContainer && $('#courses_list_left').prepend(subjectContainer)

  const $container = $(subjectTitleEl).nextAll('.courseTree').find('.courseList')

  const weekLs: JQuery[][] = Array(6)
    .fill(void 0)
    .map(() => [
      ...Array(weeks.length)
        .fill(void 0)
        .map(() => $('<td>')),
    ])

  // 時間割情報を取得
  $container
    .children()
    .get()
    .forEach(li => {
      const { week, period, title, name, semester } =
        li.textContent?.match(
          /» (?<week>[月火水木金土日])(?<period>\d)(?<semester>[前後]) (?<title>[^\d\s\/０-９]+)[\S]* [a-zA-Z]+ (?<name>(?:　|[^\d\s\/0-9０-９])+)/
        )?.groups ?? {}
      const weekIdx = weeks.findIndex(w => w === week)
      if (!~weekIdx) return
      const liVal = $(li).children('.course-data-box-normal').children().clone().get()

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
      if (splitedName.length !== 2) {
        extWarn('教授名が正常にパースされませんでした。')
        return
      }
      const termDic = { 前: 1, 後: 2 }
      const term = termDic[semester as '前' | '後'] ?? 0
      // シラバスへのリンク
      liVal.push(
        $('<a>')
          .attr({
            href: 'https://j04-asw.osaka-sandai.ac.jp/uniasv2/AGA130.do?REQ_PRFR_MNU_ID=MSTD2005',
            /*前のURL'https://j29-asw.osaka-sandai.ac.jp/uniasv2/UnSSOLoginControlFree'*/ target: '_blank',
          })
          .text('シラバス')
          .on('click', () => {
            webClsExtBrowserStorage.set({
              syllabus: { period: periodNum, day: weekIdx, title, name: splitedName as [string, string], term },
            })
          })[0]
      )

      weekLs[periodNum][weekIdx].append(liVal)[0]
    })

  // 時間割の作成
  const trLs = weekLs.map(row => $('<tr>').append(row)[0])
  $('<table>').attr('id', 'cource-table').append(trLs).prependTo($container)

  $container.css({ position: 'relative', display: 'table' })
})

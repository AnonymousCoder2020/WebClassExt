import $ from 'jquery'
import './index.css'

$(() => {
  $('.row > *:first-child').append($('#UserTopInfo'))
  const $cond = $('form[name="condition"]')
  // タイトル削除
  $cond.children('h4').remove()
  $cond.prev('h3').remove()
  // 一行に収める
  const $firstCond = $cond.children('*:first-child')
  const $secCond = $cond.children('*:nth-child(2)')
  const $addCourceBtn = $secCond.children('a')
  $firstCond.append($addCourceBtn)
  $secCond.remove()
})

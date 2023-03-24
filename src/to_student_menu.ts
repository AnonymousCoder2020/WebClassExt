// https://j04-asw.osaka-sandai.ac.jp/uniasv2/jsp/MessageDispOSU.jsp?REQ_PORTAL_LOGIN_DV=s1&REQ_MSG_DV=C
import $ from 'jquery'
$('#contents')
  .find('a[onclick^="openStartWindow"]')[0]
  ?.addEventListener(
    'click',
    e => {
      e.stopImmediatePropagation()
      window.open('https://j04-asw.osaka-sandai.ac.jp/uniasv2/UnSSOLoginControl2?REQ_PORTAL_LOGIN_DV=s1&REQ_MSG_DV=C')
      window.close()
    },
    true
  )

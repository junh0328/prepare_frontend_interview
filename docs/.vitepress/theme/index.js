import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    // 앵커 링크 클릭 시 스크롤 처리
    if (typeof window !== 'undefined') {
      // 라우트 변경 후 스크롤 처리
      router.onAfterRouteChanged = (to) => {
        if (to.hash) {
          handleHashScroll(to.hash)
        }
      }

      // 페이지 내 앵커 링크 클릭 감지
      window.addEventListener('click', (e) => {
        const link = e.target.closest('a')
        if (link && link.hash && link.pathname === window.location.pathname) {
          e.preventDefault()
          const hash = link.hash
          window.history.pushState(null, '', hash)
          handleHashScroll(hash)
        }
      })
    }
  }
}

// 해시에 따라 스크롤하는 함수
function handleHashScroll(hash) {
  const targetId = decodeURIComponent(hash.slice(1))

  // 여러 번 시도하여 요소가 렌더링될 때까지 기다림
  const scrollToElement = (retries = 5) => {
    const element = document.getElementById(targetId) ||
                    document.querySelector(`[id="${targetId}"]`)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    } else if (retries > 0) {
      setTimeout(() => scrollToElement(retries - 1), 100)
    }
  }

  setTimeout(scrollToElement, 50)
}

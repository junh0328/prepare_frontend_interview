import { defineConfig } from 'vitepress'

export default defineConfig({
  // 사이트 메타데이터
  title: '프론트엔드 면접 준비 핸드북',
  description: 'JavaScript, React, CS 기초부터 알고리즘까지 - 한국어 기술 면접 준비 자료',
  lang: 'ko-KR',

  // 베이스 URL (Vercel 배포 시 필요하면 수정)
  base: '/',

  // 클린 URL (URL에서 .html 제거)
  cleanUrls: true,

  // 마지막 업데이트 시간 표시
  lastUpdated: true,

  // 테마 설정
  themeConfig: {
    // 네비게이션 바
    nav: [
      { text: '홈', link: '/' },
      { text: 'JavaScript', link: '/js' },
      { text: 'React', link: '/react' },
      { text: 'CS 기초', link: '/cs' },
      { text: 'HTML/CSS', link: '/html_css' },
      {
        text: '알고리즘',
        items: [
          { text: '자료구조', link: '/data_structure' },
          { text: '알고리즘', link: '/algorithm_data_structure' }
        ]
      },
      { text: '면접 질문 모음', link: '/question_list' },
      { text: '프롬프트 엔지니어링', link: '/prompt_engineering' }
    ],

    // 사이드바
    sidebar: {
      '/js': [
        {
          text: 'JavaScript 기초',
          collapsed: false,
          items: [
            { text: '개요', link: '/js' },
            { text: '변수', link: '/js#변수' },
            { text: '데이터 타입', link: '/js#데이터-타입' },
            { text: '스코프', link: '/js#스코프' },
            { text: '클로저', link: '/js#클로저' },
            { text: '비동기 프로그래밍', link: '/js#비동기-프로그래밍' },
            { text: '프로토타입', link: '/js#프로토타입' }
          ]
        }
      ],
      '/react': [
        {
          text: 'React',
          collapsed: false,
          items: [
            { text: '개요', link: '/react' },
            { text: 'React 기초', link: '/react#react-기초' },
            { text: 'React Fiber와 렌더링', link: '/react#react-fiber와-렌더링' },
            { text: '컴포넌트', link: '/react#컴포넌트' },
            { text: 'Hooks', link: '/react#hooks' },
            { text: '상태 관리', link: '/react#상태-관리' },
            { text: 'Next.js', link: '/react#nextjs' },
            { text: 'Suspense', link: '/react#suspense' }
          ]
        }
      ],
      '/cs': [
        {
          text: 'Computer Science',
          collapsed: false,
          items: [
            { text: '개요', link: '/cs' },
            { text: '네트워크', link: '/cs#네트워크' },
            { text: 'HTTP', link: '/cs#http' },
            { text: '운영체제', link: '/cs#운영체제' },
            { text: '프로세스와 스레드', link: '/cs#프로세스와-스레드' },
            { text: '쿠키 세션', link: '/cs#쿠키-세션' },
            { text: 'CORS', link: '/cs#cors' },
            { text: 'Cache', link: '/cs#cache' },
            { text: 'CDN', link: '/cs#cdn' },
            { text: '웹 성능 지표', link: '/cs#웹-성능-지표' },
            { text: '테스트', link: '/cs#테스트' },
            { text: '웹팩', link: '/cs#웹팩' }
          ]
        }
      ],
      '/html_css': [
        {
          text: 'HTML',
          collapsed: false,
          items: [
            { text: 'DOCTYPE', link: '/html_css#doctype' },
            { text: '웹 표준 및 접근성', link: '/html_css#웹-표준-및-웹-접근성' }
          ]
        },
        {
          text: 'CSS',
          collapsed: false,
          items: [
            { text: 'CSS 개요', link: '/html_css#css' }
          ]
        }
      ],
      '/data_structure': [
        {
          text: '자료구조',
          collapsed: false,
          items: [
            { text: '개요', link: '/data_structure' }
          ]
        }
      ],
      '/algorithm_data_structure': [
        {
          text: '알고리즘',
          collapsed: false,
          items: [
            { text: '개요', link: '/algorithm_data_structure' }
          ]
        }
      ],
      '/question_list': [
        {
          text: '면접 질문',
          collapsed: false,
          items: [
            { text: '질문 모음', link: '/question_list' }
          ]
        }
      ],
      '/prompt_engineering': [
        {
          text: '프롬프트 엔지니어링',
          collapsed: false,
          items: [
            { text: '가이드', link: '/prompt_engineering' }
          ]
        }
      ]
    },

    // 소셜 링크
    socialLinks: [
      { icon: 'github', link: 'https://github.com/junh0328/prepare_frontend_interview' }
    ],

    // 페이지 하단 이전/다음 링크
    docFooter: {
      prev: '이전',
      next: '다음'
    },

    // 사이드바 메뉴 라벨
    sidebarMenuLabel: '메뉴',
    returnToTopLabel: '맨 위로',

    // 아웃라인 (목차) 설정
    outline: {
      level: [2, 3],
      label: '목차'
    },

    // 검색 기능 (로컬 검색)
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '검색',
                buttonAriaLabel: '검색'
              },
              modal: {
                noResultsText: '결과를 찾을 수 없습니다',
                resetButtonTitle: '초기화',
                footer: {
                  selectText: '선택',
                  navigateText: '이동',
                  closeText: '닫기'
                }
              }
            }
          }
        }
      }
    },

    // 마지막 업데이트 텍스트
    lastUpdatedText: '최종 업데이트',

    // 편집 링크
    editLink: {
      pattern: 'https://github.com/junh0328/prepare_frontend_interview/edit/main/docs/:path',
      text: '이 페이지 편집하기'
    }
  },

  // Markdown 설정
  markdown: {
    // 줄 번호 표시
    lineNumbers: true,

    // 헤더 앵커 설정
    anchor: {
      level: [1, 2, 3, 4],
      slugify: (str) => {
        // 이모지와 특수문자 제거, 공백을 하이픈으로
        return str
          .trim()
          .replace(/[\u{1F300}-\u{1F9FF}]|🔥|⚡|✨|📌/gu, '') // 이모지 제거
          .replace(/\s+/g, '-') // 공백을 하이픈으로
          .replace(/[^\w\u3131-\u314e\u314f-\u3163\uac00-\ud7a3-]/g, '') // 한글, 영문, 숫자, 하이픈만 남김
          .toLowerCase()
      }
    },

    // 목차 설정
    toc: {
      level: [2, 3]
    }
  }
})

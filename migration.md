# VitePress 마이그레이션 가이드

이 문서는 현재 마크다운 기반 면접 준비 핸드북을 VitePress로 마이그레이션하는 단계별 가이드입니다.

## 📊 예상 소요 시간

- **기본 마이그레이션**: 2-3시간
  - VitePress 설치 및 설정: 30분
  - 파일 구조 재구성: 30분
  - 설정 파일 작성: 1시간
  - 로컬 테스트 및 수정: 30분-1시간

- **배포**: 30분-1시간
  - Vercel 설정 및 배포: 20분
  - 검증 및 테스트: 20-40분

- **추가 커스터마이징** (선택): 2-4시간
  - 사이드바 상세 구성: 1-2시간
  - 커스텀 컴포넌트: 1-2시간
  - 스타일링 및 최적화: 1시간

**총 예상 시간**: 최소 2.5시간 ~ 최대 8시간

## ⚠️ 시작하기 전 주의사항

1. **백업 필수**: 작업 전 Git 커밋 또는 브랜치 생성
2. **Node.js 버전**: 18.0 이상 필수 (20.x 권장)
3. **원본 파일 보존**: `docs/` 디렉토리에 복사본을 만들므로 원본 파일은 유지됨
4. **점진적 작업**: 한 번에 모든 걸 완벽하게 하려 하지 말고, 기본 마이그레이션 → 배포 → 개선 순서로 진행
5. **테스트 필수**: 로컬에서 충분히 테스트한 후 배포

## 🚀 빠른 시작 (경험자용)

VitePress와 Vercel에 익숙한 사용자를 위한 빠른 시작 가이드입니다:

```bash
# 1. VitePress 설치
npm install -D vitepress

# 2. 디렉토리 생성 및 파일 복사
mkdir -p docs/{.vitepress,public}
cp *.md docs/
cp README.md docs/index.md
cp -r images examples docs/public/
cp -r cs_images docs/public/

# 3. config.js 생성 (아래 전체 설정 참고)
# docs/.vitepress/config.js 파일 생성 후 설정 추가

# 4. package.json에 스크립트 추가
# "docs:dev": "vitepress dev docs"
# "docs:build": "vitepress build docs"
# "docs:preview": "vitepress preview docs"

# 5. 이미지 경로 수정
find docs -name "*.md" -type f -exec sed -i '' 's|(\./images/|(\/images/|g' {} \;
find docs -name "*.md" -type f -exec sed -i '' 's|(images/|(\/images/|g' {} \;

# 6. 로컬 테스트
npm run docs:dev

# 7. 빌드 테스트
npm run docs:build

# 8. Git 커밋 & Vercel 배포
git add . && git commit -m "feat: VitePress 마이그레이션"
git push
# Vercel 대시보드에서 프로젝트 생성 → Framework Preset: VitePress 선택
```

자세한 단계별 설명은 아래를 참고하세요.

---

## 목차

1. [사전 요구사항](#사전-요구사항)
2. [VitePress 설치 및 초기 설정](#vitepress-설치-및-초기-설정)
3. [프로젝트 구조 재구성](#프로젝트-구조-재구성)
4. [설정 파일 작성](#설정-파일-작성)
5. [사이드바 및 네비게이션 구성](#사이드바-및-네비게이션-구성)
6. [마크다운 파일 최적화](#마크다운-파일-최적화)
7. [커스텀 컴포넌트 추가](#커스텀-컴포넌트-추가)
8. [로컬 테스트](#로컬-테스트)
9. [Vercel 배포 설정](#vercel-배포-설정)
10. [배포 및 검증](#배포-및-검증)

---

## 사전 요구사항

### 1. Node.js 버전 확인

```bash
node --version
```

- **필수**: Node.js 18.0 이상
- 설치되지 않은 경우: [Node.js 공식 사이트](https://nodejs.org/)에서 다운로드

### 2. 패키지 매니저 확인

```bash
npm --version
# 또는
pnpm --version
# 또는
yarn --version
```

이 가이드에서는 `npm`을 기준으로 설명합니다.

### 3. Git 상태 확인

```bash
git status
```

- 현재 작업 중인 변경사항이 있다면 커밋 또는 스태시 처리

---

## VitePress 설치 및 초기 설정

### 1. VitePress 설치

```bash
npm install -D vitepress
```

### 2. package.json 스크립트 추가

`package.json` 파일을 열어 다음 스크립트를 추가합니다:

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

### 3. VitePress 초기화

```bash
npx vitepress init
```

**설정 옵션 선택**:
- Where should VitePress initialize the config? → `./docs`
- Site title → `프론트엔드 면접 준비 핸드북`
- Site description → `JavaScript, React, CS 기초부터 알고리즘까지`
- Theme → `Default Theme + Customization`
- Use TypeScript for config and theme files? → `No` (선택사항)
- Add VitePress npm scripts to package.json? → `Yes`

---

## 프로젝트 구조 재구성

### 1. docs 디렉토리 생성 및 구조 설정

```bash
mkdir -p docs/public
mkdir -p docs/.vitepress
```

### 2. 기존 마크다운 파일 복사

```bash
# 메인 콘텐츠 파일 복사
cp js.md docs/js.md
cp react.md docs/react.md
cp cs.md docs/cs.md
cp html_css.md docs/html_css.md
cp data_structure.md docs/data_structure.md
cp algorithm_data_structure.md docs/algorithm_data_structure.md
cp question_list.md docs/question_list.md

# README를 index.md로 복사 (홈페이지)
cp README.md docs/index.md
```

### 3. 이미지 및 리소스 복사

```bash
# 이미지 디렉토리 복사
cp -r images docs/public/images
cp -r cs_images docs/public/cs_images

# examples 디렉토리 복사
cp -r examples docs/public/examples
```

### 4. 최종 디렉토리 구조

```
프로젝트루트/
├── docs/
│   ├── .vitepress/
│   │   ├── config.js          # VitePress 설정 파일
│   │   └── theme/
│   │       └── index.js       # 커스텀 테마 (선택)
│   ├── public/
│   │   ├── images/            # 이미지 파일
│   │   ├── cs_images/         # CS 이미지
│   │   └── examples/          # 예제 코드
│   ├── index.md               # 홈페이지 (README.md 복사본)
│   ├── js.md
│   ├── react.md
│   ├── cs.md
│   ├── html_css.md
│   ├── data_structure.md
│   ├── algorithm_data_structure.md
│   └── question_list.md
├── package.json
└── README.md                  # 원본 유지
```

---

## 설정 파일 작성

### 1. config.js 생성

`docs/.vitepress/config.js` 파일을 생성하고 다음 내용을 작성합니다:

```javascript
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
      { text: '면접 질문 모음', link: '/question_list' }
    ],

    // 사이드바 (다음 단계에서 상세 작성)
    sidebar: {
      '/js': [
        {
          text: 'JavaScript',
          items: [
            { text: '개요', link: '/js' }
          ]
        }
      ],
      '/react': [
        {
          text: 'React',
          items: [
            { text: '개요', link: '/react' }
          ]
        }
      ],
      '/cs': [
        {
          text: 'Computer Science',
          items: [
            { text: '개요', link: '/cs' }
          ]
        }
      ],
      '/html_css': [
        {
          text: 'HTML/CSS',
          items: [
            { text: '개요', link: '/html_css' }
          ]
        }
      ],
      '/data_structure': [
        {
          text: '자료구조',
          items: [
            { text: '개요', link: '/data_structure' }
          ]
        }
      ],
      '/algorithm_data_structure': [
        {
          text: '알고리즘',
          items: [
            { text: '개요', link: '/algorithm_data_structure' }
          ]
        }
      ],
      '/question_list': [
        {
          text: '면접 질문',
          items: [
            { text: '질문 모음', link: '/question_list' }
          ]
        }
      ]
    },

    // 소셜 링크
    socialLinks: [
      { icon: 'github', link: 'https://github.com/YOUR_USERNAME/YOUR_REPO' }
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
      pattern: 'https://github.com/YOUR_USERNAME/YOUR_REPO/edit/main/docs/:path',
      text: '이 페이지 편집하기'
    }
  },

  // Markdown 설정
  markdown: {
    // 줄 번호 표시
    lineNumbers: true,

    // 헤더 앵커 설정
    anchor: {
      permalink: true
    }
  }
})
```

### 2. GitHub 레포지토리 링크 업데이트

위 설정에서 다음 부분을 실제 레포지토리 정보로 수정:

```javascript
// socialLinks 수정
socialLinks: [
  { icon: 'github', link: 'https://github.com/junh0328/prepare_frontend_interview' }
],

// editLink 수정
editLink: {
  pattern: 'https://github.com/junh0328/prepare_frontend_interview/edit/main/docs/:path',
  text: '이 페이지 편집하기'
}
```

**참고**: 이 레포지토리의 실제 URL은 `https://github.com/junh0328/prepare_frontend_interview`입니다.

---

## 사이드바 및 네비게이션 구성

### 1. 사이드바 자동 생성 스크립트 작성 (선택사항)

각 마크다운 파일의 헤더를 파싱하여 자동으로 사이드바를 생성할 수 있습니다.

`docs/.vitepress/config.js`의 사이드바를 다음과 같이 상세화:

```javascript
sidebar: {
  '/js': [
    {
      text: 'JavaScript 기초',
      collapsed: false,
      items: [
        { text: '개요', link: '/js' },
        { text: '변수와 데이터 타입', link: '/js#변수와-데이터-타입' },
        { text: '스코프와 클로저', link: '/js#스코프와-클로저' },
        { text: '비동기 프로그래밍', link: '/js#비동기-프로그래밍' },
        { text: '프로토타입', link: '/js#프로토타입' },
        // ... 실제 섹션에 맞게 추가
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
        { text: 'Suspense', link: '/react#suspense' },
        { text: '웹 성능 최적화', link: '/react#웹-성능-최적화' }
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
  ]
}
```

### 2. index.md 홈페이지 커스터마이징

`docs/index.md` 파일을 열어 다음과 같이 프론트매터를 추가:

```markdown
---
layout: home

hero:
  name: 프론트엔드 면접 준비
  text: 기술 면접 핸드북
  tagline: JavaScript, React, CS 기초부터 알고리즘까지
  actions:
    - theme: brand
      text: 시작하기
      link: /js
    - theme: alt
      text: GitHub에서 보기
      link: https://github.com/YOUR_USERNAME/YOUR_REPO

features:
  - icon: 🔥
    title: JavaScript
    details: 변수, 클로저, 프로토타입, 비동기 프로그래밍 등 JavaScript 핵심 개념
    link: /js
  - icon: ⚛️
    title: React
    details: Hooks, Fiber, 상태 관리, Next.js 등 React 생태계
    link: /react
  - icon: 💻
    title: Computer Science
    details: 네트워킹, HTTP, OS, 프로세스/스레드 등 CS 기초
    link: /cs
  - icon: 🎨
    title: HTML/CSS
    details: 시멘틱 태그, 웹 표준, 접근성, Flexbox/Grid
    link: /html_css
  - icon: 📊
    title: 자료구조
    details: 리스트, 큐, 스택, 트리, 그래프 등 핵심 자료구조
    link: /data_structure
  - icon: 🧮
    title: 알고리즘
    details: 정렬, 탐색, 동적 프로그래밍 등 알고리즘 패턴
    link: /algorithm_data_structure
---

## 프로젝트 소개

이 핸드북은 프론트엔드 개발자의 기술 면접 준비를 위한 종합 가이드입니다.

### 사용 방법

1. **주제별 학습**: 왼쪽 사이드바에서 주제를 선택하여 학습
2. **중요도 확인**: 🔥 이모지로 자주 나오는 질문 확인
3. **검색 활용**: 상단 검색창에서 키워드 검색
4. **순차 학습**: 관련 주제 링크(📌)를 따라 연관 개념 학습

### 불 이모지 시스템

- 🔥 - 자주 묻는 질문
- 🔥🔥 - 매우 자주 묻는 질문
- 🔥🔥🔥 - 필수/핵심 지식
- 🔥🔥🔥🔥 - 극도로 중요함

<!-- 기존 README.md 내용을 여기 아래에 유지 -->
```

---

## 마크다운 파일 최적화

### 1. 이미지 경로 수정

모든 마크다운 파일에서 이미지 경로를 VitePress 형식으로 수정:

**변경 전**:
```markdown
![이미지](./images/example.png)
```

**변경 후**:
```markdown
![이미지](/images/example.png)
```

### 2. 상대 링크 수정

내부 링크를 VitePress 형식으로 수정:

**변경 전**:
```markdown
[React 문서](react.md)
```

**변경 후**:
```markdown
[React 문서](/react)
```

### 3. 일괄 수정 스크립트 (선택사항)

#### macOS/Linux 사용자

```bash
# macOS
sed -i '' 's|(\./images/|(\/images/|g' docs/*.md
sed -i '' 's|(images/|(\/images/|g' docs/*.md
sed -i '' 's|(\./cs_images/|(\/cs_images/|g' docs/*.md
sed -i '' 's|(cs_images/|(\/cs_images/|g' docs/*.md

# Linux
sed -i 's|(\./images/|(\/images/|g' docs/*.md
sed -i 's|(images/|(\/images/|g' docs/*.md
sed -i 's|(\./cs_images/|(\/cs_images/|g' docs/*.md
sed -i 's|(cs_images/|(\/cs_images/|g' docs/*.md
```

#### Windows 사용자 (PowerShell)

```powershell
# images/ 경로 수정
Get-ChildItem docs\*.md | ForEach-Object {
  (Get-Content $_.FullName) `
    -replace '\(\./images/', '(/images/' `
    -replace '\(images/', '(/images/' `
    -replace '\(\./cs_images/', '(/cs_images/' `
    -replace '\(cs_images/', '(/cs_images/' |
  Set-Content $_.FullName
}
```

#### 수동 수정

스크립트 실행이 어려운 경우, VS Code의 "Find and Replace" 기능 활용:
1. `Ctrl/Cmd + Shift + F` (전체 파일 검색)
2. 검색: `(./images/` → 변경: `(/images/`
3. 검색: `(images/` → 변경: `(/images/`
4. 검색: `(./cs_images/` → 변경: `(/cs_images/`
5. 검색: `(cs_images/` → 변경: `(/cs_images/`

### 4. 프론트매터 추가 (선택사항)

각 마크다운 파일 상단에 메타데이터 추가:

```markdown
---
title: JavaScript 기초
description: JavaScript 핵심 개념과 면접 질문
---

# JavaScript 기초

...
```

---

## 커스텀 컴포넌트 추가

### 1. 불 이모지 필터 컴포넌트 (선택사항)

사용자가 중요도별로 질문을 필터링할 수 있는 컴포넌트를 추가할 수 있습니다.

`docs/.vitepress/theme/index.js` 생성:

```javascript
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 커스텀 컴포넌트 등록
  }
}
```

### 2. 커스텀 CSS 추가

`docs/.vitepress/theme/custom.css` 생성:

```css
/* 불 이모지 강조 */
:root {
  --vp-c-brand: #ff6b6b;
  --vp-c-brand-light: #ff8787;
  --vp-c-brand-lighter: #ffa5a5;
  --vp-c-brand-dark: #ff5252;
  --vp-c-brand-darker: #ff3838;
}

/* 코드 블록 스타일 */
.vp-doc div[class*='language-'] {
  border-radius: 8px;
}

/* 목차 스타일 */
.VPDocAsideOutline {
  padding-top: 24px;
}

/* 불 이모지 크기 조정 */
h2:has(🔥), h3:has(🔥) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
```

---

## 로컬 테스트

### 1. 개발 서버 실행

```bash
npm run docs:dev
```

브라우저에서 `http://localhost:5173` 접속

### 2. 확인 사항

#### 네비게이션
- [ ] 상단 네비게이션 바가 정상 작동하는가?
- [ ] 드롭다운 메뉴가 제대로 표시되는가?

#### 사이드바
- [ ] 각 페이지의 사이드바가 올바르게 표시되는가?
- [ ] 사이드바 링크가 정상 작동하는가?
- [ ] Collapsed/expanded 상태가 정상인가?

#### 콘텐츠
- [ ] 모든 마크다운 내용이 정상 렌더링되는가?
- [ ] 이미지가 모두 표시되는가?
- [ ] 코드 블록이 올바르게 하이라이팅되는가?
- [ ] 앵커 링크(#)가 정상 작동하는가?

#### 검색
- [ ] 검색 기능이 작동하는가?
- [ ] 한국어 검색이 정상적으로 되는가?

#### 반응형
- [ ] 모바일 화면에서 레이아웃이 깨지지 않는가?
- [ ] 사이드바가 모바일에서 토글되는가?

### 3. 빌드 테스트

```bash
npm run docs:build
```

빌드 오류가 없는지 확인합니다.

```bash
npm run docs:preview
```

프로덕션 빌드를 로컬에서 미리보기합니다.

---

## Vercel 배포 설정

### 1. .gitignore 업데이트

```bash
# VitePress 빌드 결과물
docs/.vitepress/dist
docs/.vitepress/cache

# Node modules
node_modules/

# 환경 변수
.env
.env.local
```

### 2. vercel.json 생성 (선택사항)

프로젝트 루트에 `vercel.json` 생성:

```json
{
  "buildCommand": "npm run docs:build",
  "outputDirectory": "docs/.vitepress/dist",
  "cleanUrls": true,
  "trailingSlash": false
}
```

### 3. Git 커밋

```bash
git add .
git commit -m "feat: VitePress로 마이그레이션"
git push origin main
```

### 4. Vercel 프로젝트 생성

#### 방법 1: Vercel 웹사이트에서

1. [Vercel](https://vercel.com)에 로그인
2. "Add New..." → "Project" 클릭
3. GitHub 레포지토리 선택
4. **Framework Preset**: `VitePress` 선택
5. **Build Command**: `npm run docs:build` (자동 입력됨)
6. **Output Directory**: `docs/.vitepress/dist` (자동 입력됨)
7. **Install Command**: `npm install` (자동 입력됨)
8. "Deploy" 클릭

#### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

---

## 배포 및 검증

### 1. 배포 완료 확인

Vercel 대시보드에서 배포 상태 확인:
- Build Logs 확인
- 배포 URL 확인

### 2. 프로덕션 사이트 검증

배포된 사이트에서 다음 항목 확인:

#### 기능 테스트
- [ ] 모든 페이지가 정상 로드되는가?
- [ ] 네비게이션이 작동하는가?
- [ ] 검색 기능이 작동하는가?
- [ ] 이미지가 모두 로드되는가?
- [ ] 모바일에서 정상 작동하는가?

#### SEO 확인
- [ ] 페이지 타이틀이 올바른가?
- [ ] 메타 디스크립션이 표시되는가?
- [ ] Open Graph 태그가 있는가?

#### 성능 확인
- [ ] Lighthouse 점수 확인
- [ ] 페이지 로드 속도 확인
- [ ] Core Web Vitals 확인

### 3. 도메인 연결 (선택사항)

Vercel 대시보드에서:
1. 프로젝트 선택 → "Settings" → "Domains"
2. 커스텀 도메인 추가
3. DNS 설정 업데이트

---

## 문제 해결

### 이미지가 표시되지 않는 경우

1. 경로가 `/images/` 형식인지 확인
2. `docs/public/` 디렉토리에 이미지가 있는지 확인
3. 파일명 대소문자 확인

### 검색이 작동하지 않는 경우

1. `config.js`의 `search` 설정 확인
2. 빌드 후 재테스트
3. 브라우저 캐시 삭제

### 빌드 오류 발생 시

1. `node_modules` 삭제 후 재설치:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Node.js 버전 확인
3. 빌드 로그에서 구체적인 오류 메시지 확인

### Vercel 배포 실패 시

1. Vercel Build Logs 확인
2. 로컬에서 `npm run docs:build` 성공하는지 확인
3. `vercel.json` 설정 확인
4. 환경 변수 확인

---

## 추가 개선 사항

### 1. 다크 모드 커스터마이징

`docs/.vitepress/theme/custom.css`에 다크 모드 스타일 추가:

```css
/* 다크 모드 색상 커스터마이징 */
.dark {
  --vp-c-bg: #1a1a1a;
  --vp-c-bg-soft: #252525;
}

/* 코드 블록 다크 모드 */
.dark .vp-code {
  background-color: #1e1e1e;
}
```

### 2. Google Analytics 연동

`config.js`에 다음 추가:

```javascript
export default defineConfig({
  // ... 기존 설정

  head: [
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');`
    ]
  ]
})
```

### 3. 댓글 기능 추가

Giscus 또는 Utterances를 활용하여 댓글 기능 추가 가능:

```javascript
// docs/.vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import Giscus from '@giscus/vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Giscus', Giscus)
  }
}
```

### 4. 자동 사이드바 생성

마크다운 파일의 헤더를 자동으로 파싱하여 사이드바 생성하는 Node.js 스크립트:

```javascript
// scripts/generate-sidebar.js
import fs from 'fs'
import path from 'path'

function generateSidebar(mdFile) {
  const content = fs.readFileSync(mdFile, 'utf-8')
  const headers = content.match(/^## .+$/gm) || []

  return headers.map(header => {
    const text = header.replace('## ', '')
    const link = `#${text.toLowerCase().replace(/\s+/g, '-')}`
    return { text, link }
  })
}

// 사용 예시
const jsSidebar = generateSidebar('./docs/js.md')
console.log(JSON.stringify(jsSidebar, null, 2))
```

### 5. 불 이모지 필터 컴포넌트

사용자가 중요도별로 질문을 필터링할 수 있는 Vue 컴포넌트 추가:

```vue
<!-- docs/.vitepress/theme/components/FireFilter.vue -->
<template>
  <div class="fire-filter">
    <button @click="filter = 'all'">전체</button>
    <button @click="filter = '1'">🔥</button>
    <button @click="filter = '2'">🔥🔥</button>
    <button @click="filter = '3'">🔥🔥🔥</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filter = ref('all')
</script>
```

### 6. PWA (Progressive Web App) 지원

VitePress PWA 플러그인 설치:

```bash
npm install -D @vite-pwa/vitepress
```

`config.js`에 추가:

```javascript
import { withPwa } from '@vite-pwa/vitepress'

export default withPwa(
  defineConfig({
    // ... 기존 설정
    pwa: {
      manifest: {
        name: '프론트엔드 면접 준비 핸드북',
        short_name: '면접 핸드북',
        description: 'JavaScript, React, CS 기초 면접 준비',
        theme_color: '#ff6b6b'
      }
    }
  })
)
```

---

## 마이그레이션 체크리스트

### 설치 및 설정
- [ ] Node.js 18+ 설치 확인
- [ ] VitePress 설치
- [ ] package.json 스크립트 추가
- [ ] docs 디렉토리 구조 생성

### 파일 마이그레이션
- [ ] 마크다운 파일 복사
- [ ] 이미지 파일 복사
- [ ] examples 디렉토리 복사
- [ ] 이미지 경로 수정
- [ ] 내부 링크 수정

### 설정 파일
- [ ] config.js 작성
- [ ] 네비게이션 설정
- [ ] 사이드바 설정
- [ ] 검색 기능 설정
- [ ] index.md 홈페이지 작성

### 로컬 테스트
- [ ] 개발 서버 실행 테스트
- [ ] 모든 페이지 로드 확인
- [ ] 이미지 표시 확인
- [ ] 검색 기능 테스트
- [ ] 빌드 테스트

### 배포
- [ ] .gitignore 업데이트
- [ ] Git 커밋 및 푸시
- [ ] Vercel 프로젝트 생성
- [ ] 배포 성공 확인
- [ ] 프로덕션 사이트 검증

---

## 참고 자료

- [VitePress 공식 문서](https://vitepress.dev/)
- [VitePress 한국어 가이드](https://vitepress.dev/ko/)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [GitHub Actions로 자동 배포](https://vitepress.dev/guide/deploy#github-pages)

---

## 도움이 필요한 경우

- VitePress Discord: [https://chat.vitejs.dev](https://chat.vitejs.dev)
- GitHub Issues: 프로젝트 레포지토리의 Issues 탭 활용
- Vercel Support: [https://vercel.com/support](https://vercel.com/support)

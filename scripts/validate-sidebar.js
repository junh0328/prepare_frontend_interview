/**
 * VitePress sidebar 앵커 검증 스크립트
 *
 * config.js의 sidebar 링크에 포함된 앵커(#xxx)가
 * 실제 마크다운 파일의 ## 헤딩과 일치하는지 검증한다.
 *
 * 사용법: node scripts/validate-sidebar.js
 */
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

// VitePress config 읽기 (동적 import)
const configModule = await import(
  join(rootDir, 'docs', '.vitepress', 'config.js')
)
const config = configModule.default

const sidebar = config.themeConfig.sidebar
let errors = 0

/**
 * 마크다운 헤딩을 VitePress 앵커 슬러그로 변환
 * (config.js의 slugify 로직과 동일)
 */
function slugify(str) {
  return str
    .trim()
    .replace(/[\u{1F300}-\u{1F9FF}]|🔥|⚡|✨|📌/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\u3131-\u314e\u314f-\u3163\uac00-\ud7a3-]/g, '')
    .toLowerCase()
}

/**
 * 마크다운 파일에서 ## 레벨 헤딩의 앵커 목록 추출
 */
function extractHeadings(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const headings = new Set()
  for (const line of content.split('\n')) {
    const match = line.match(/^##\s+(.+)$/)
    if (match) {
      headings.add(slugify(match[1]))
    }
  }
  return headings
}

// 각 sidebar 항목 검증
for (const [route, sections] of Object.entries(sidebar)) {
  for (const section of sections) {
    for (const item of section.items || []) {
      const link = item.link
      if (!link) continue

      const anchorMatch = link.match(/^\/(\w+)#(.+)$/)
      if (!anchorMatch) continue

      const [, fileName, anchor] = anchorMatch
      const mdPath = join(rootDir, `${fileName}.md`)

      let headings
      try {
        headings = extractHeadings(mdPath)
      } catch {
        console.error(`ERROR: ${mdPath} 파일을 찾을 수 없습니다 (sidebar: ${link})`)
        errors++
        continue
      }

      if (!headings.has(anchor)) {
        console.error(
          `ERROR: 앵커 "#${anchor}"가 ${fileName}.md에 존재하지 않습니다 (sidebar: "${item.text}")`
        )
        errors++
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n✖ ${errors}개의 sidebar 앵커 불일치 발견!`)
  process.exit(1)
} else {
  console.log('✓ 모든 sidebar 앵커가 마크다운 헤딩과 일치합니다.')
}

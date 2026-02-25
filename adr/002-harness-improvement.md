# ADR-002: 에이전트 협업 환경(Harness) 개선

- **상태**: 부분 대체됨 (ADR-002a 참고)
- **날짜**: 2026-02
- **결정자**: junhee lee

## 맥락

AI 에이전트(Claude Code)와의 협업 빈도가 증가하면서, 에이전트가 코드베이스를 정확히 이해하고 일관된 품질의 작업을 수행할 수 있는 환경이 필요했다. Harness 진단(12원칙 기반) 결과, 다음 영역에서 개선이 필요했다:

- 마크다운 포맷/린트 자동화 부재 (수동 검수에 의존)
- Node.js 버전 명시 없음 (환경 재현성 부족)
- CLAUDE.md에 빌드/실행 명령어, 주의사항 누락
- 완료된 마이그레이션 문서(migration.md, planning.md)가 삭제되지 않고 잔존
- 기술 결정에 대한 기록(ADR) 부재

## 결정

**pre-commit 기반 자동 검증 파이프라인을 구축하고, 에이전트 진입점(CLAUDE.md)을 강화한다.**

### 도입한 도구

| 도구 | 역할 | 설정 파일 |
| --- | --- | --- |
| **markdownlint-cli** | 마크다운 구조/문법 린트 | `.markdownlint.json` |
| **Prettier** | 마크다운 포맷 통일 | `.prettierrc`, `.prettierignore` |
| **markdown-link-check** | 내부 앵커 링크 검증 | `.markdown-link-check.json` |
| **Husky** | pre-commit 훅 실행 (기존) | `.husky/pre-commit` |

### 변경 사항

1. **pre-commit 워크플로우 확립** — `format → lint:md → sync:docs → git add` 순서로 커밋 전 자동 검증
2. **markdownlint 설정** — 기존 콘텐츠 스타일과 충돌하는 20개 규칙 비활성화, 나머지 규칙으로 구조적 오류 방지
3. **Prettier 도입** — `proseWrap: "preserve"`로 기존 줄바꿈 유지하면서 포맷 통일
4. **markdown-link-check 도입** — 내부 앵커 링크만 검증 (외부 URL은 무시). pre-commit에는 포함하지 않고 수동 실행용
5. **.nvmrc 추가** — Node.js v22 명시로 환경 재현성 확보
6. **CLAUDE.md 강화** — 개발 환경 섹션(빌드/실행 명령어), 주의사항(Gotchas) 섹션 추가
7. **Stale 파일 정리** — `migration.md`, `planning.md` 삭제 (마이그레이션 완료 후 불필요)
8. **ADR 체계 도입** — `adr/` 디렉토리 생성, VitePress 선택 결정 기록 (ADR-001)

### 근거

1. **자동화 우선** — 사람이나 에이전트가 실수해도 커밋 전에 도구가 잡아줌 (Invariant Enforcement)
2. **최소 마찰** — Vercel 배포 파이프라인이 이미 존재하므로 별도 CI 불필요. pre-commit만으로 충분
3. **점진적 적용** — markdownlint 규칙을 한번에 모두 적용하지 않고, 기존 콘텐츠와 호환되는 수준에서 시작
4. **지식의 코드화** — CLAUDE.md 주의사항, ADR 등을 통해 암묵지를 명시적 문서로 전환

### 트레이드오프

- markdownlint 20개 규칙 비활성화로 검증 범위가 제한적이지만, 13,000줄+ 기존 콘텐츠를 대량 수정하는 것보다 현실적
- markdown-link-check를 pre-commit에 넣지 않아 깨진 링크가 커밋될 수 있지만, 실행 시간이 길어 개발 경험 저하 방지
- Prettier의 `proseWrap: "preserve"`는 일부 긴 줄을 그대로 두지만, 기존 콘텐츠의 의도적 줄바꿈을 보존

## 결과

- Harness 성숙도: **L3 (55.5점) → L4 (63.6점)** (+8.1점 향상)
- 커밋 시 자동으로 format + lint + sync 실행
- 에이전트가 CLAUDE.md만으로 빌드/실행/주의사항 파악 가능
- 기술 결정이 ADR로 추적 가능

## 부분 대체 이력 (2026-02-25)

이후 변경으로 인해 이 ADR의 일부 결정이 대체되었다:

| 원래 결정 | 현재 상태 | 변경 커밋 |
| --- | --- | --- |
| "별도 CI 불필요, pre-commit만으로 충분" (근거 #2) | GitHub Actions CI 추가됨 (format:check, lint:md, lint:links, lint:sidebar, docs:build) | `e3d2275` |
| "markdown-link-check를 pre-commit에 넣지 않음" (트레이드오프) | `check` 스크립트에 `lint:links` 포함 → pre-commit에서 실행됨 | `f8ba1fe` |

**대체 사유**: PR 단위 검증이 필요해졌고(Vercel만으로는 lint/link 검증 불가), `lint:links`의 실행 시간이 허용 범위 내로 확인되어 pre-commit에 통합됨.

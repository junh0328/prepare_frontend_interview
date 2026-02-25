/**
 * commitlint 설정
 *
 * 프로젝트 커밋 컨벤션: [타입] 설명
 * 허용 타입: docs, fix, feat, chore
 *
 * 예시:
 *   [docs] HTTP, HTTPS에 관한 내용 추가
 *   [fix] 이미지 확장자를 소문자로 자동 변환
 *   [feat] Initialize the vitepress
 *   [chore] GitHub Actions CI 워크플로우 추가
 */
export default {
  rules: {
    // [타입] 형식 검증을 headerPattern으로 수행
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['docs', 'fix', 'feat', 'chore'],
    ],
  },
  parserPreset: {
    parserOpts: {
      // WHY: conventional commits의 "type: subject" 대신 "[type] subject" 형식을 사용합니다.
      // 한국어 커밋 메시지에서 대괄호가 시각적으로 더 명확하고,
      // 기존 커밋 히스토리와의 일관성을 유지하기 위함입니다.
      headerPattern: /^\[(\w+)\]\s(.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
}

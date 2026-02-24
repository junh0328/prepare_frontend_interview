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
      // [타입] 설명 형식 파싱
      headerPattern: /^\[(\w+)\]\s(.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
}

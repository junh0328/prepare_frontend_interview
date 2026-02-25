# ADR-004: 외부 링크 검증 스크립트 도입 (soft-fail)

- **상태**: 승인됨
- **날짜**: 2026-02
- **결정자**: junhee lee

## 맥락

기존 `lint:links`(`markdown-link-check`)는 내부 앵커 링크만 검증하고 외부 URL은 무시한다. 콘텐츠 파일에 포함된 외부 링크(블로그, MDN, GitHub 등)가 깨져도 발견할 수단이 없었다.

## 고려한 대안

| 대안 | 장점 | 단점 |
| --- | --- | --- |
| A) markdown-link-check에 외부 URL 활성화 | 도구 통합, 설정 간단 | 실행 시간 급증, rate-limit으로 CI 불안정 |
| B) 별도 스크립트 + hard-fail (채택하지 않음) | 정확한 차단 | 외부 서버 일시 장애로 빌드 차단 위험 |
| C) 별도 스크립트 + soft-fail (채택) | 리포트만 출력, 빌드 차단 없음 | 깨진 링크 수정이 강제되지 않음 |

## 결정

**별도 스크립트(`scripts/check-external-links.js`)를 soft-fail(항상 exit 0)로 도입한다.**

### 설계 결정

1. **soft-fail**: 외부 서버 상태는 통제 불가하므로 항상 exit 0으로 빌드를 차단하지 않음
2. **pre-commit/CI 미포함**: 네트워크 요청이 필요하고 실행 시간이 가변적이므로 수동 실행만 지원
3. **CDN 스킵 패턴**: rate-limit이나 인증이 필요한 CDN(GitHub proxy, Kakao, Velog 등)은 검증 제외
4. **동시성 제한**: 5개 동시 요청으로 대상 서버에 부담을 주지 않음

### 실행 방법

```bash
pnpm run lint:external-links
```

## 근거

1. 콘텐츠 파일에 83개 이상의 외부 URL이 있으며, 시간이 지나면 일부가 깨질 수 있다
2. hard-fail 시 외부 서버 일시 장애만으로 PR이 차단되어 DX가 저하된다
3. 수동 실행 + 리포트 방식이면 필요할 때만 검증하고, 결과를 보고 판단할 수 있다

## 트레이드오프

- soft-fail이므로 깨진 외부 링크가 장기간 방치될 수 있음 → 주기적 수동 실행으로 보완
- pre-commit/CI에 포함하지 않으므로 자동 검증이 아님 → 향후 안정성이 확인되면 CI에 soft-fail로 추가 검토 가능

## 결과

- `scripts/check-external-links.js` 생성 (PR #39)
- `package.json`에 `lint:external-links` 스크립트 추가
- CLAUDE.md 마크다운 린트 섹션에 사용법 기록

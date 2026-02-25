import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// WHY: 기존 lint:links는 내부 앵커만 검증하고 외부 URL은 무시합니다.
// 이 스크립트는 외부 URL의 접근 가능성을 soft-fail로 검증하여,
// 깨진 외부 링크를 조기에 발견합니다. CI에서 실패해도 빌드를 차단하지 않습니다.

const TIMEOUT_MS = 10000;
const CONCURRENCY = 5;
const RETRY_COUNT = 1;

// 검증 제외 패턴 (rate-limit, 인증 필요, CDN 등)
const SKIP_PATTERNS = [
  /camo\.githubusercontent\.com/, // GitHub proxy images
  /img1\.daumcdn\.net/, // Kakao CDN
  /blog\.kakaocdn\.net/, // Kakao blog CDN
  /media\.vlpt\.us/, // Velog CDN
  /3\.bp\.blogspot\.com/, // Blogger CDN
  /4\.bp\.blogspot\.com/, // Blogger CDN
];

function shouldSkip(url) {
  return SKIP_PATTERNS.some((pattern) => pattern.test(url));
}

// 마크다운에서 외부 URL 추출
function extractExternalUrls(content, fileName) {
  const urls = new Map(); // url -> Set<lineNumbers>

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    // 마크다운 링크: [text](url)
    const mdLinks = [...line.matchAll(/\[.*?\]\((https?:\/\/[^)]+)\)/g)];
    // bare URL
    const bareUrls = [
      ...line.matchAll(/(?<!\()(https?:\/\/[^\s)<>"]+)/g),
    ];
    // img src
    const imgSrcs = [...line.matchAll(/src=["'](https?:\/\/[^"']+)["']/g)];

    [...mdLinks, ...bareUrls, ...imgSrcs].forEach((match) => {
      const url = match[1];
      if (!urls.has(url)) {
        urls.set(url, { file: fileName, lines: new Set() });
      }
      urls.get(url).lines.add(index + 1);
    });
  });

  return urls;
}

async function checkUrl(url, retries = RETRY_COUNT) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (link-checker)' },
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (response.ok || response.status === 405) {
        // 405 = HEAD not allowed, likely alive
        return { url, status: response.status, ok: true };
      }

      if (response.status === 429 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      return { url, status: response.status, ok: false };
    } catch (error) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      return { url, status: error.name || 'ERROR', ok: false };
    }
  }
}

// 동시성 제한 실행
async function checkUrlsWithConcurrency(urls, concurrency) {
  const results = [];
  const queue = [...urls];

  async function worker() {
    while (queue.length > 0) {
      const [url, info] = queue.shift();
      const result = await checkUrl(url);
      results.push({ ...result, ...info });
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const mdFiles = readdirSync(rootDir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'CLAUDE.md')
    .sort();

  console.log('외부 링크 검증 시작 (soft-fail)...\n');

  const allUrls = new Map();

  for (const file of mdFiles) {
    const content = readFileSync(join(rootDir, file), 'utf-8');
    const urls = extractExternalUrls(content, file);
    for (const [url, info] of urls) {
      if (shouldSkip(url)) continue;
      if (!allUrls.has(url)) {
        allUrls.set(url, info);
      }
    }
  }

  const uniqueCount = allUrls.size;
  console.log(`검증 대상: ${uniqueCount}개 고유 외부 URL\n`);

  if (uniqueCount === 0) {
    console.log('외부 URL 없음.');
    return;
  }

  const results = await checkUrlsWithConcurrency(allUrls, CONCURRENCY);

  const alive = results.filter((r) => r.ok);
  const dead = results.filter((r) => !r.ok);

  console.log(`\n결과: ${alive.length}개 정상 / ${dead.length}개 문제\n`);

  if (dead.length > 0) {
    console.log('--- 문제 링크 ---\n');
    dead.forEach((r) => {
      const lines = [...r.lines].join(', ');
      console.log(`  [${r.status}] ${r.url}`);
      console.log(`       위치: ${r.file}:${lines}\n`);
    });
  }

  // soft-fail: 항상 exit 0
  // WHY: 외부 링크는 서버 상태에 따라 일시적으로 실패할 수 있으므로,
  // CI에서 빌드를 차단하지 않고 리포트만 출력합니다.
  console.log(
    dead.length > 0
      ? `⚠ ${dead.length}개 외부 링크에 문제가 있습니다. 수동 확인이 필요합니다.`
      : '✓ 모든 외부 링크가 정상입니다.'
  );
}

main().catch(console.error);

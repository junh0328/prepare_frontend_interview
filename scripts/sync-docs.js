import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const docsDir = join(rootDir, 'docs');

// 동기화할 파일 목록
// NOTE: 새 콘텐츠 파일 추가 시 이 배열에 수동으로 추가해야 합니다.
// index.md는 VitePress 전용 frontmatter가 있어 제외합니다.
const filesToSync = [
  'cs.md',
  'js.md',
  'react.md',
  'html_css.md',
  'data_structure.md',
  'algorithm_data_structure.md',
  'architecture.md',
  'question_list.md',
  'prompt_engineering.md',
];

// 이미지 확장자를 소문자로 변환하는 함수
// WHY: 일부 이미지 파일이 .PNG, .JPG 등 대문자 확장자로 커밋되어 있는데,
//      VitePress 빌드 시 대소문자 불일치로 이미지가 깨지는 문제를 방지합니다.
function lowercaseImageExtensions(content) {
  return content.replace(
    /(\!\[.*?\]\(.*?)\.(PNG|JPG|JPEG|GIF|SVG|WEBP|BMP|ICO)(\))/gi,
    (_match, prefix, ext, suffix) => `${prefix}.${ext.toLowerCase()}${suffix}`
  ).replace(
    /(src=["'].*?)\.(PNG|JPG|JPEG|GIF|SVG|WEBP|BMP|ICO)(["'])/gi,
    (_match, prefix, ext, suffix) => `${prefix}.${ext.toLowerCase()}${suffix}`
  );
}

// 이미지 경로 변환 함수
// WHY: 루트 .md 파일에서는 상대 경로(./images/)를 사용하지만,
//      VitePress의 docs/ 내에서는 절대 경로(/images/)여야 정상 렌더링됩니다.
function convertImagePaths(content) {
  let result = content
    // ./images/ → /images/
    .replace(/\(\.\/images\//g, '(/images/')
    // (images/ → (/images/ (괄호 뒤에 바로 images가 오는 경우)
    .replace(/\(images\//g, '(/images/')
    // src="./images/ → src="/images/
    .replace(/src="\.\/images\//g, 'src="/images/')
    // src="images/ → src="/images/
    .replace(/src="images\//g, 'src="/images/')
    // ./cs_images/ → /cs_images/
    .replace(/\(\.\/cs_images\//g, '(/cs_images/')
    .replace(/\(cs_images\//g, '(/cs_images/')
    .replace(/src="\.\/cs_images\//g, 'src="/cs_images/')
    .replace(/src="cs_images\//g, 'src="/cs_images/')
    // ./examples/ → /examples/
    .replace(/\(\.\/examples\//g, '(/examples/')
    .replace(/\(examples\//g, '(/examples/')
    .replace(/src="\.\/examples\//g, 'src="/examples/')
    .replace(/src="examples\//g, 'src="/examples/');

  // 이미지 확장자를 소문자로 변환
  result = lowercaseImageExtensions(result);

  return result;
}

// 파일 동기화
function syncFile(fileName, destFileName = fileName) {
  const srcPath = join(rootDir, fileName);
  const destPath = join(docsDir, destFileName);

  try {
    const content = readFileSync(srcPath, 'utf-8');
    const convertedContent = convertImagePaths(content);
    writeFileSync(destPath, convertedContent, 'utf-8');
    console.log(`✓ ${fileName} → docs/${destFileName}`);
  } catch (error) {
    console.error(`✗ ${fileName}: ${error.message}`);
  }
}

console.log('루트 → docs/ 동기화 시작...\n');

// 일반 파일 동기화
filesToSync.forEach((file) => syncFile(file));

// NOTE: index.md는 VitePress 홈페이지용 frontmatter가 있어 동기화하지 않음

console.log('\n동기화 완료!');

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const docsDir = join(rootDir, 'docs');

// 동기화할 파일 목록
const filesToSync = [
  'cs.md',
  'js.md',
  'react.md',
  'html_css.md',
  'data_structure.md',
  'algorithm_data_structure.md',
  'question_list.md',
  'prompt_engineering.md',
];

// 이미지 경로 변환 함수
function convertImagePaths(content) {
  return (
    content
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
      .replace(/src="examples\//g, 'src="/examples/')
  );
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

/**
 * @file build-dist.js
 * @description Cloudflare 배포용 최적화 스크립트. 불필요한 파일(테스트, 스크립트 등)을 제외하고 실제 서비스에 필요한 파일만 dist/ 폴더로 복사합니다.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// 배포에 포함할 화이트리스트 폴더 및 파일 (루트 기준)
const includePaths = [
  'assets',
  'components',
  'projects',
  'studies',
  'travel',
  'about', // 추후 추가될 경우 대비
  'now',
  'index.html',
  'about.html',
  'now.html',
  'rss.xml',
  'logo_favicon_1781948111845.png'
];

/**
 * 디렉토리 생성 (recursive)
 */
function mkdirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 파일 및 폴더 재귀 복사
 */
function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;

  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    // dest의 부모 폴더 보장
    mkdirSync(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

function buildDist() {
  console.log('[build-dist] 최적화된 배포용 폴더(dist) 생성을 시작합니다...');
  
  // 1. 기존 dist 폴더 초기화
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  mkdirSync(DIST_DIR);

  // 2. 화이트리스트 항목 복사
  includePaths.forEach((item) => {
    const srcPath = path.join(ROOT_DIR, item);
    const destPath = path.join(DIST_DIR, item);
    
    if (fs.existsSync(srcPath)) {
      copyRecursiveSync(srcPath, destPath);
      console.log(`[build-dist] Copied: ${item}`);
    }
  });

  console.log(`[build-dist] 배포용 폴더 생성이 완료되었습니다!`);
}

buildDist();

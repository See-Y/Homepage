/**
 * @file build-data.js
 * @description 검색 인덱스(search-index.json) 및 RSS(rss.xml) 파일 자동 생성 스크립트
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'assets', 'data');
const SEARCH_INDEX_PATH = path.join(DATA_DIR, 'search-index.json');
const RSS_PATH = path.join(ROOT_DIR, 'rss.xml');

// 수집된 항목
const searchItems = [];

/**
 * 디렉토리를 재귀적으로 탐색하여 .md 파일 수집
 */
function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      if (file.endsWith('.md')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

/**
 * 마크다운 파일 파싱하여 인덱스 항목 생성
 */
function processMarkdownFiles(dir, categoryStr) {
  const mdFiles = walkDir(dir);
  
  mdFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 첫 번째 줄 제목 추론 (e.g. # Title)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
    
    // 내용 요약 (첫 100글자)
    const textContent = content.replace(/#+\s/g, '').replace(/\n/g, ' ').trim();
    const snippet = textContent.substring(0, 100);

    // URL 생성 (Windows 백슬래시 처리)
    let relativeUrl = filePath.replace(ROOT_DIR, '').replace(/\\/g, '/');
    if (relativeUrl.endsWith('.md')) {
      relativeUrl = relativeUrl.substring(0, relativeUrl.length - 3);
    }

    searchItems.push({
      title,
      content: textContent,
      snippet,
      url: relativeUrl,
      category: categoryStr,
      date: new Date().toISOString() // 실제로는 파일 메타데이터를 사용해야 함
    });
  });
}

function buildSearchIndex() {
  console.log('[build-data] 수집 시작...');
  
  // Studies 수집
  const studiesDir = path.join(ROOT_DIR, 'studies');
  processMarkdownFiles(studiesDir, 'Studies');

  // Travel 데이터는 JSON에서 추출
  const travelJsonPath = path.join(DATA_DIR, 'travel-data.json');
  if (fs.existsSync(travelJsonPath)) {
    const travelData = JSON.parse(fs.readFileSync(travelJsonPath, 'utf-8'));
    travelData.forEach(item => {
      searchItems.push({
        title: item.title,
        content: `Travel log for ${item.title}`,
        snippet: `Travel log for ${item.title}`,
        url: item.url,
        category: 'Travel',
        date: new Date().toISOString()
      });
    });
  }

  // search-index.json 작성
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchItems, null, 2));
  console.log(`[build-data] search-index.json 생성 완료! (총 ${searchItems.length}건)`);
}

function buildRssFeed() {
  console.log('[build-data] RSS 피드 생성 중...');
  
  const siteUrl = 'https://antigravity.pages.dev';
  const siteTitle = 'Antigravity Blog';
  const siteDescription = '보안, CS 공부 노트 및 프로젝트 기록';

  let rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${siteTitle}</title>
  <link>${siteUrl}</link>
  <description>${siteDescription}</description>
  <language>ko-KR</language>
`;

  // 최신 순 정렬
  const sortedItems = [...searchItems].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedItems.forEach(item => {
    rssContent += `
  <item>
    <title><![CDATA[${item.title}]]></title>
    <link>${siteUrl}${item.url}</link>
    <description><![CDATA[${item.snippet}]]></description>
    <pubDate>${new Date(item.date).toUTCString()}</pubDate>
  </item>`;
  });

  rssContent += `
</channel>
</rss>`;

  fs.writeFileSync(RSS_PATH, rssContent);
  console.log(`[build-data] rss.xml 생성 완료!`);
}

function run() {
  buildSearchIndex();
  buildRssFeed();
}

run();

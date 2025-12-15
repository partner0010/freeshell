/**
 * 필요한 URL들을 자동으로 열어주는 스크립트
 */

const { exec } = require('child_process');
const os = require('os');

const platform = os.platform();

function openURL(url) {
  let command;
  
  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else {
    command = `xdg-open ${url}`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.log(`❌ URL 열기 실패: ${url}`);
      console.log(`   직접 브라우저에서 열어주세요: ${url}`);
    } else {
      console.log(`✅ 열림: ${url}`);
    }
  });
}

console.log('🌐 필요한 웹사이트들을 열고 있습니다...\n');

const urls = [
  {
    name: 'Google Cloud Console',
    url: 'https://console.cloud.google.com',
    description: 'OAuth 클라이언트 ID 생성'
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    description: '저장소 생성 및 코드 업로드'
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com',
    description: '프로젝트 배포'
  },
  {
    name: '도메인 DNS 확인',
    url: 'https://www.whatsmydns.net',
    description: 'DNS 전파 확인'
  }
];

// 각 URL을 순차적으로 열기
urls.forEach((item, index) => {
  setTimeout(() => {
    console.log(`\n${index + 1}. ${item.name}`);
    console.log(`   ${item.description}`);
    openURL(item.url);
  }, index * 2000); // 2초 간격
});

console.log('\n⏳ 브라우저가 열리는 동안 기다려주세요...\n');
console.log('💡 각 사이트에서 해야 할 작업:\n');
console.log('1. Google Cloud Console:');
console.log('   - 프로젝트 생성');
console.log('   - OAuth 2.0 클라이언트 ID 생성');
console.log('   - 리디렉션 URI 추가\n');
console.log('2. GitHub:');
console.log('   - 새 저장소 생성');
console.log('   - 코드 업로드\n');
console.log('3. Vercel:');
console.log('   - GitHub 저장소 연결');
console.log('   - 환경 변수 설정');
console.log('   - 도메인 추가\n');


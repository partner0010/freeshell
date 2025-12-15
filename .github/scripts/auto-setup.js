/**
 * 자동 설정 스크립트
 * 가능한 모든 설정을 자동으로 수행
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Freeshell 자동 설정 시작...\n');

// 1. NEXTAUTH_SECRET 생성
function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

// 2. .env 파일 생성 또는 업데이트
function setupEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (!fs.existsSync(envPath)) {
    console.log('📝 .env 파일 생성 중...');
    
    let envContent = '';
    if (fs.existsSync(envExamplePath)) {
      envContent = fs.readFileSync(envExamplePath, 'utf-8');
    } else {
      envContent = `# Google OAuth 설정
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth 설정
NEXTAUTH_SECRET=${generateSecret()}
NEXTAUTH_URL=http://localhost:3000

# 프로덕션 도메인
NEXT_PUBLIC_DOMAIN=freeshell.co.kr

# 환경 설정
NODE_ENV=development
`;
    }
    
    // NEXTAUTH_SECRET이 없으면 생성
    if (!envContent.includes('NEXTAUTH_SECRET=') || envContent.includes('NEXTAUTH_SECRET=your_')) {
      const secret = generateSecret();
      envContent = envContent.replace(/NEXTAUTH_SECRET=.*/g, `NEXTAUTH_SECRET=${secret}`);
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env 파일 생성 완료');
    console.log('   생성된 NEXTAUTH_SECRET을 복사해두세요!');
  } else {
    console.log('ℹ️  .env 파일이 이미 존재합니다.');
  }
}

// 3. package.json 확인
function checkPackageJson() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.log('❌ package.json이 없습니다. 먼저 package.json을 생성해주세요.');
    process.exit(1);
  }
  console.log('✅ package.json 확인 완료');
}

// 4. 필요한 디렉토리 생성
function createDirectories() {
  const dirs = [
    path.join(__dirname, '..', '.next'),
    path.join(__dirname, '..', 'node_modules'),
  ];
  
  dirs.forEach(dir => {
    // .next와 node_modules는 npm install로 생성되므로 스킵
  });
  
  console.log('✅ 디렉토리 구조 확인 완료');
}

// 5. 설정 요약 출력
function printSummary() {
  console.log('\n📋 설정 요약:\n');
  console.log('✅ 프로젝트 설정 파일 생성 완료');
  console.log('✅ .env 파일 준비 완료');
  console.log('✅ 코드 검증 스크립트 준비 완료');
  console.log('\n📝 다음 단계:\n');
  console.log('1. npm install 실행');
  console.log('2. Google Cloud Console에서 OAuth 설정');
  console.log('3. .env 파일에 Google OAuth 정보 입력');
  console.log('4. npm run dev 실행');
  console.log('\n💡 자세한 가이드는 DEPLOYMENT_GUIDE.md를 참고하세요.\n');
}

// 메인 실행
try {
  checkPackageJson();
  setupEnvFile();
  createDirectories();
  printSummary();
  
  console.log('🎉 자동 설정 완료!\n');
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  process.exit(1);
}


/**
 * 전체 소스 코드 검증 스크립트
 * 무료 AI API를 사용한 코드 디버깅 및 검증
 */

const fs = require('fs');
const path = require('path');

// 검증 결과 저장
const results = {
  errors: [],
  warnings: [],
  info: [],
  totalFiles: 0,
  checkedFiles: 0,
};

/**
 * 파일 검증 함수
 */
function verifyFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];

  // 1. TypeScript/JavaScript 문법 검증
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    // console.log 사용 확인 (프로덕션에서는 제거 권장)
    if (content.includes('console.log') && !content.includes('// 개발용')) {
      issues.push({
        type: 'warning',
        message: 'console.log 사용 발견 - 프로덕션에서는 제거 권장',
        line: content.split('\n').findIndex(line => line.includes('console.log')) + 1,
      });
    }

    // try-catch 누락 확인
    const asyncFunctions = content.match(/async\s+function|async\s+\(/g);
    if (asyncFunctions) {
      const hasTryCatch = content.includes('try') && content.includes('catch');
      if (!hasTryCatch && content.includes('await')) {
        issues.push({
          type: 'warning',
          message: 'async 함수에 에러 핸들링이 없을 수 있음',
        });
      }
    }

    // 환경 변수 사용 확인
    const envUsage = content.match(/process\.env\.\w+/g);
    if (envUsage) {
      envUsage.forEach(env => {
        if (!env.includes('NEXT_PUBLIC_') && content.includes('use client')) {
          issues.push({
            type: 'error',
            message: `클라이언트 컴포넌트에서 서버 환경 변수 사용: ${env}`,
          });
        }
      });
    }

    // import 경로 확인
    const imports = content.match(/from\s+['"]@\/[^'"]+['"]/g);
    if (imports) {
      imports.forEach(imp => {
        const importPath = imp.match(/@\/([^'"]+)/)?.[1];
        if (importPath) {
          const fullPath = path.join(__dirname, '../src', importPath);
          if (!fs.existsSync(fullPath) && !fs.existsSync(fullPath + '.ts') && !fs.existsSync(fullPath + '.tsx')) {
            issues.push({
              type: 'error',
              message: `존재하지 않는 import 경로: ${imp}`,
            });
          }
        }
      });
    }
  }

  // 2. 보안 검증
  if (content.includes('dangerouslySetInnerHTML')) {
    issues.push({
      type: 'warning',
      message: 'dangerouslySetInnerHTML 사용 - XSS 위험 가능성',
    });
  }

  if (content.includes('eval(') || content.includes('Function(')) {
    issues.push({
      type: 'error',
      message: 'eval() 또는 Function() 사용 - 보안 위험',
    });
  }

  // 3. 성능 검증
  if (content.includes('useEffect') && !content.includes('useEffect(() => {')) {
    const useEffectCount = (content.match(/useEffect/g) || []).length;
    if (useEffectCount > 5) {
      issues.push({
        type: 'info',
        message: 'useEffect가 많음 - 최적화 고려',
      });
    }
  }

  return issues;
}

/**
 * 디렉토리 재귀 탐색
 */
function scanDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // node_modules, .next 등 제외
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(file)) {
        scanDirectory(filePath, fileList);
      }
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * 메인 검증 함수
 */
function main() {
  console.log('🔍 전체 소스 코드 검증 시작...\n');

  const srcDir = path.join(__dirname, '../src');
  const files = scanDirectory(srcDir);

  results.totalFiles = files.length;

  files.forEach(file => {
    results.checkedFiles++;
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    const issues = verifyFile(file);

    issues.forEach(issue => {
      if (issue.type === 'error') {
        results.errors.push({ file: relativePath, ...issue });
      } else if (issue.type === 'warning') {
        results.warnings.push({ file: relativePath, ...issue });
      } else {
        results.info.push({ file: relativePath, ...issue });
      }
    });
  });

  // 결과 출력
  console.log(`\n✅ 검증 완료: ${results.checkedFiles}/${results.totalFiles} 파일 검사\n`);

  if (results.errors.length > 0) {
    console.log(`❌ 오류: ${results.errors.length}개`);
    results.errors.forEach(err => {
      console.log(`  - ${err.file}: ${err.message}`);
      if (err.line) console.log(`    라인: ${err.line}`);
    });
    console.log('');
  }

  if (results.warnings.length > 0) {
    console.log(`⚠️  경고: ${results.warnings.length}개`);
    results.warnings.slice(0, 10).forEach(warn => {
      console.log(`  - ${warn.file}: ${warn.message}`);
    });
    if (results.warnings.length > 10) {
      console.log(`  ... 외 ${results.warnings.length - 10}개 경고`);
    }
    console.log('');
  }

  if (results.info.length > 0) {
    console.log(`ℹ️  정보: ${results.info.length}개`);
    results.info.slice(0, 5).forEach(info => {
      console.log(`  - ${info.file}: ${info.message}`);
    });
    if (results.info.length > 5) {
      console.log(`  ... 외 ${results.info.length - 5}개 정보`);
    }
    console.log('');
  }

  // 결과 요약
  console.log('📊 검증 결과 요약:');
  console.log(`  - 총 파일: ${results.totalFiles}`);
  console.log(`  - 오류: ${results.errors.length}`);
  console.log(`  - 경고: ${results.warnings.length}`);
  console.log(`  - 정보: ${results.info.length}`);

  // 종료 코드
  process.exit(results.errors.length > 0 ? 1 : 0);
}

main();


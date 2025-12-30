# GitHub 저장소 확인 방법

## 문제 해결을 위한 확인 단계

Netlify 빌드가 계속 실패하는 경우, GitHub 저장소에 파일이 있는지 확인하세요.

### 1. GitHub 저장소 확인

다음 링크를 브라우저에서 열어 파일이 있는지 확인:

- **package.json**: https://github.com/partner0010/freeshell/blob/main/package.json
- **netlify.toml**: https://github.com/partner0010/freeshell/blob/main/netlify.toml

### 2. 파일이 없다면

배치 파일을 실행하세요:
1. `.github\deploy.bat` 파일 더블클릭
2. 빌드 완료까지 대기
3. "Push to GitHub? (Y/N)"에서 **Y** 입력
4. 완료 후 위 링크를 다시 확인

### 3. 파일이 있는데도 실패한다면

Netlify 설정을 확인:
1. Netlify 대시보드: https://app.netlify.com
2. Site settings → Build & deploy → Continuous Deployment
3. Production branch가 `main`인지 확인
4. Base directory가 비어있는지 확인 (루트 디렉토리)

### 4. 직접 확인 명령어

프로젝트 디렉토리에서:
```cmd
git ls-files package.json netlify.toml
```

결과가 나오면 파일이 Git에 추적되고 있습니다.


# 서버 배포 가이드

## 자동 배포 (권장)

프로젝트 루트에서 `deploy.bat` 파일을 더블클릭하거나 명령 프롬프트에서 실행:

```bash
deploy.bat
```

## 수동 배포

### 1. Git 상태 확인
```bash
git status
```

### 2. 변경사항 추가
```bash
git add .
```

### 3. 커밋 생성
```bash
git commit -m "feat: GENSPARK AI 디자인 적용 및 새로운 AI 서비스 통합"
```

### 4. 원격 저장소로 푸시
```bash
git push origin main
```

또는 master 브랜치인 경우:
```bash
git push origin master
```

## 배포된 변경사항

### 디자인 개선
- ✅ GENSPARK AI 스타일의 글로벌 디자인 적용
- ✅ 반응형 헤더 및 네비게이션
- ✅ 모바일 최적화

### 새로운 AI 서비스
- ✅ Rewritify AI (텍스트 인간화)
- ✅ Hugging Face Inference API
- ✅ Replicate API
- ✅ AI 에이전트 시스템

### 기능 개선
- ✅ 메뉴 재구성 및 최적화
- ✅ 자동화 파이프라인 개선
- ✅ 다국어 지원 강화
- ✅ 전체 디버깅 완료

## Vercel 자동 배포

GitHub에 푸시하면 Vercel에서 자동으로:
1. 빌드 시작
2. 테스트 실행
3. 프로덕션 배포

배포 상태는 [Vercel 대시보드](https://vercel.com)에서 확인할 수 있습니다.

## 문제 해결

### 푸시 실패 시
1. 현재 브랜치 확인: `git branch`
2. 원격 저장소 확인: `git remote -v`
3. 수동 푸시: `git push origin [브랜치명]`

### 커밋 실패 시
변경사항이 없으면 정상입니다. 계속 진행하세요.

### 빌드 실패 시
Vercel 대시보드에서 빌드 로그를 확인하세요.


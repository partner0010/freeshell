# 빠른 배포 가이드

## 현재 상태 확인

`check-deploy-status.bat` 파일을 실행하여 현재 상태를 확인하세요.

## 배포하기

### 방법 1: 자동 배포 (권장)
프로젝트 루트에서 `deploy.bat` 더블클릭

### 방법 2: 수동 배포
명령 프롬프트에서:

```bash
cd "프로젝트 루트 경로"
git add .
git commit -m "feat: GENSPARK AI 디자인 및 새로운 AI 서비스 통합"
git push origin main
```

## 배포된 내용

✅ GENSPARK AI 스타일 디자인
✅ Rewritify AI 통합
✅ Hugging Face API 통합
✅ Replicate API 통합
✅ AI 에이전트 시스템
✅ 메뉴 재구성

## 확인 방법

배포 후 Vercel 대시보드에서 빌드 상태를 확인하세요.


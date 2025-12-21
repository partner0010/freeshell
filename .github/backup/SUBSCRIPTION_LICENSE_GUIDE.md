# 구독형 라이선스 시스템 가이드

## 📋 개요

Freeshell은 구독형 라이선스 시스템을 통해 사용자에게 다양한 구독 플랜을 제공합니다.

## 🎯 구독 모델

### 현재: 무료 + 광고
- 회원가입만으로 모든 기능 무료 사용
- Google AdSense 광고 표시
- 제한 없음

### 향후: 프리미엄 구독
- **Free**: 기본 기능 + 광고
- **Pro ($9.99/월)**: 모든 기능 + 광고 제거
- **Enterprise ($99.99/월)**: 모든 기능 + 무제한 + 전담 지원

## 🔑 라이선스 시스템

### 라이선스 키 형식
```
XXXX-XXXX-XXXX-XXXX
예: A1B2-C3D4-E5F6-G7H8
```

### 라이선스 생성 (관리자)
1. `/admin/licenses` 접속
2. "라이선스 생성" 클릭
3. 티어 선택 (Free, Pro, Enterprise)
4. 만료일 설정 (선택사항, null이면 무기한)
5. 최대 기기 수 설정
6. 생성된 라이선스 키 복사

### 라이선스 적용 (사용자)
1. `/mypage/license` 접속
2. 라이선스 키 입력
3. "적용" 클릭
4. 구독 활성화 확인

## 📊 라이선스 상태

- **active**: 활성화됨
- **expired**: 만료됨
- **revoked**: 취소됨
- **pending**: 대기 중

## 🔒 보안 기능

- 라이선스 키 암호화 저장
- 기기별 사용 추적
- 만료 자동 확인
- 상태 실시간 동기화
- 최대 기기 수 제한

## 💡 사용 시나리오

### 시나리오 1: 무료 사용자
1. 회원가입
2. 모든 기능 무료 사용
3. 광고 표시

### 시나리오 2: Pro 구독자
1. 관리자로부터 Pro 라이선스 키 받기
2. `/mypage/license`에서 라이선스 키 입력
3. Pro 기능 활성화
4. 광고 제거

### 시나리오 3: Enterprise 구독자
1. 관리자로부터 Enterprise 라이선스 키 받기
2. 라이선스 키 적용
3. 모든 기능 + 무제한 사용
4. 전담 지원

## 🚀 API 엔드포인트

### 라이선스 생성
```
POST /api/license/generate
Body: { tier, expiresAt?, maxDevices?, features? }
```

### 라이선스 검증
```
POST /api/license/validate
Body: { licenseKey, deviceId? }
```

### 라이선스 적용
```
POST /api/license/apply
Body: { licenseKey }
```

### 사용자 라이선스 조회
```
GET /api/license/user
```

### 관리자 라이선스 목록
```
GET /api/admin/licenses
```

## 📝 데이터베이스 스키마

### SubscriptionLicense
- `id`: 고유 ID
- `licenseKey`: 라이선스 키 (고유)
- `userId`: 사용자 ID (null이면 미할당)
- `tier`: 구독 티어
- `status`: 상태
- `expiresAt`: 만료일
- `maxDevices`: 최대 기기 수
- `features`: 추가 기능

### LicenseUsage
- `id`: 고유 ID
- `licenseId`: 라이선스 ID
- `deviceId`: 기기 식별자
- `lastUsedAt`: 마지막 사용 시간

## 🎨 UI 컴포넌트

- `LicenseManager`: 사용자 라이선스 관리
- `/admin/licenses`: 관리자 라이선스 관리 페이지
- `/mypage/license`: 사용자 라이선스 페이지

## ✨ 완료!

구독형 라이선스 시스템이 완전히 구현되었습니다.
관리자는 라이선스를 생성하고, 사용자는 라이선스를 적용하여 프리미엄 기능을 사용할 수 있습니다.


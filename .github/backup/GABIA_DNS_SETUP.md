# Gabia DNS 설정 가이드 (Vercel 연결)

## 📋 Gabia 기본 네임서버로 복구

### 1단계: 네임서버 설정
1. Gabia 홈페이지 로그인
2. 마이페이지 → 도메인 관리
3. 해당 도메인 선택
4. "네임서버 설정" 클릭
5. **"Gabia 네임서버 사용"** 선택
6. 저장

### 2단계: DNS 레코드 확인/초기화
1. "DNS 관리" 메뉴 클릭
2. 현재 레코드 확인
3. 필요시 잘못된 레코드 삭제

## 🔗 Vercel 연결 설정

### Vercel에서 도메인 추가
1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. "Add Domain" 클릭
3. 도메인 입력 (예: `your-domain.com`)
4. "Add" 클릭

### Vercel DNS 정보 확인
Vercel이 다음 중 하나를 제공합니다:
- **A 레코드**: `76.76.21.21`
- **CNAME**: `cname.vercel-dns.com`

## 📝 Gabia DNS 레코드 설정

### 방법 1: CNAME 방식 (권장)

#### 루트 도메인 (@)
```
타입: CNAME
호스트: @
값: cname.vercel-dns.com
TTL: 3600 (또는 기본값)
```

#### www 서브도메인
```
타입: CNAME
호스트: www
값: cname.vercel-dns.com
TTL: 3600
```

### 방법 2: A 레코드 방식

#### 루트 도메인 (@)
```
타입: A
호스트: @
값: 76.76.21.21
TTL: 3600
```

#### www 서브도메인
```
타입: CNAME
호스트: www
값: cname.vercel-dns.com
TTL: 3600
```

## ⚠️ 주의사항

### Gabia CNAME 제한
- 일부 도메인 등록업체는 루트 도메인(@)에 CNAME을 허용하지 않습니다
- 이 경우 A 레코드를 사용해야 합니다

### DNS 전파 시간
- 최소: 몇 분
- 최대: 48시간
- 평균: 1-2시간

### 확인 방법
```bash
# Windows 명령 프롬프트
nslookup your-domain.com
nslookup www.your-domain.com
```

또는 온라인 도구:
- https://dnschecker.org
- https://www.whatsmydns.net

## 🔄 복구 절차

### 즉시 복구 (기본 설정으로)
1. Gabia → 도메인 관리 → 네임서버 설정
2. "Gabia 네임서버 사용" 선택
3. 저장

### Vercel 연결 (나중에)
DNS가 안정화된 후 위의 설정 방법대로 진행

## ✅ 설정 확인 체크리스트

- [ ] Gabia 네임서버: `ns1.gabia.co.kr`, `ns2.gabia.co.kr`
- [ ] DNS 레코드 초기화 완료
- [ ] Vercel에 도메인 추가 완료
- [ ] Vercel DNS 정보 확인 완료
- [ ] Gabia에 레코드 추가 완료
- [ ] DNS 전파 확인 (nslookup)
- [ ] 사이트 접속 테스트

## 📞 지원

### Gabia 고객지원
- 전화: 1588-4253
- 이메일: support@gabia.com
- 운영시간: 평일 09:00 ~ 18:00

### Vercel 문서
- https://vercel.com/docs/concepts/projects/domains


# 💰 가장 저렴한 도메인 배포 방법

**조사 시간**: 2025-12-05 01:20  
**목적**: freeshell.co.kr 도메인 연결, 최저 비용

---

## 🏆 **가장 저렴한 방법 TOP 5**

### 1. Oracle Cloud Always Free (⭐⭐⭐⭐⭐)
```
비용: 완전 무료 (영구!)

제공:
✅ VM.Standard.E2.1.Micro (2개)
✅ 1 OCPU, 1GB RAM (각)
✅ 100GB 스토리지
✅ 10TB 아웃바운드/월
✅ 영구 무료!

장점:
- 영구 무료
- 충분한 성능
- 고정 IP
- 제한 없음

단점:
- 설정 복잡 (1시간)
- 신용카드 필요 (과금 없음)

→ 이게 최고!
```

### 2. Cloudflare Tunnel (⭐⭐⭐⭐⭐)
```
비용: 완전 무료

제공:
✅ 도메인 연결
✅ 자동 HTTPS
✅ DDoS 보호
✅ CDN

조건:
⚠️ 컴퓨터 24시간 켜놔야 함

장점:
- 완전 무료
- 설정 쉬움 (10분)
- 신용카드 불필요

단점:
- 컴퓨터 계속 켜야 함
- 전기세

→ 가장 쉬움!
```

### 3. Fly.io (⭐⭐⭐⭐)
```
비용: 거의 무료

제공:
✅ 3개 앱 무료
✅ 256MB RAM (무료)
✅ 1GB 스토리지

무료 한도:
- 월 160시간 (약 5일)
- 추가 시간: $0.02/시간

예상 비용:
- 24시간: 약 $15/월
- 12시간: 약 $7/월

장점:
- 설정 쉬움
- 좋은 성능

단점:
- 완전 무료 아님
```

### 4. Vercel + Supabase (⭐⭐⭐⭐)
```
비용: 완전 무료

프론트엔드: Vercel (무료)
백엔드: Cloudflare Workers (무료)
데이터베이스: Supabase (무료)

제한:
- Workers: 100K requests/day
- Supabase: 500MB DB

장점:
- 완전 무료
- 자동 배포
- 쉬움

단점:
- 기능 제한적
- 백엔드 재작성 필요
```

### 5. Contabo VPS (⭐⭐⭐)
```
비용: $4.50/월 (가장 싼 유료)

제공:
✅ 4GB RAM
✅ 2 vCPU
✅ 50GB SSD
✅ 무제한 트래픽

장점:
- 저렴
- 좋은 성능
- 제한 없음

단점:
- 유료
- 설정 필요
```

---

## 🎯 **추천 순위**

### 1위: Oracle Cloud Always Free (완전 무료, 영구!)
```
비용: $0/월
성능: ★★★★☆
난이도: ★★★★☆ (어려움)
시간: 1-2시간

→ 한 번 설정하면 영구 무료!
```

### 2위: Cloudflare Tunnel (완전 무료, 쉬움!)
```
비용: $0/월
성능: ★★★★☆
난이도: ★☆☆☆☆ (쉬움)
시간: 10분

→ 가장 쉬움! 하지만 컴퓨터 켜야 함
```

### 3위: Fly.io (거의 무료)
```
비용: $7-15/월
성능: ★★★★★
난이도: ★★☆☆☆
시간: 15분

→ 저렴하고 쉬움
```

---

## 💡 **실제 추천**

### 컴퓨터 24시간 켤 수 있나요?

#### YES → Cloudflare Tunnel (⭐⭐⭐⭐⭐)
```
완전 무료
10분 설정
freeshell.co.kr 바로 연결

장점:
✅ $0/월
✅ 자동 HTTPS
✅ 빠른 설정

단점:
❌ 컴퓨터 켜놔야 함
❌ 전기세 (월 1만원?)
```

#### NO → Oracle Cloud (⭐⭐⭐⭐⭐)
```
완전 무료, 영구!
1-2시간 설정
고정 IP + 도메인

장점:
✅ $0/월
✅ 영구 무료
✅ 컴퓨터 안 켜도 됨

단점:
❌ 설정 복잡
❌ 신용카드 필요
```

---

## 🚀 **가장 쉬운 방법: Cloudflare Tunnel**

### 10분 설정:
```powershell
# 1. Cloudflare Tunnel 설치
winget install --id Cloudflare.cloudflared

# 2. 로그인
cloudflared tunnel login

# 3. 터널 생성
cloudflared tunnel create freeshell

# 4. 도메인 연결
cloudflared tunnel route dns freeshell freeshell.co.kr

# 5. 설정 파일
# config.yml 생성

# 6. 실행
cloudflared tunnel run freeshell
```

---

## 💰 **비용 비교**

| 방법 | 월 비용 | 컴퓨터 | 난이도 |
|------|---------|--------|--------|
| Oracle Cloud | $0 | 불필요 | 어려움 |
| Cloudflare Tunnel | $0 | 필요 | 쉬움 |
| Fly.io | $7-15 | 불필요 | 쉬움 |
| Render | $7 | 불필요 | 쉬움 |
| Vercel+Workers | $0 | 불필요 | 중간 |
| Contabo VPS | $4.50 | 불필요 | 어려움 |

---

## 🎯 **제 최종 추천**

### 지금 당장 사용 (무료, 쉬움):
```
Cloudflare Tunnel

1. 설치: 5분
2. 설정: 5분
3. https://freeshell.co.kr 완성!

비용: $0/월
조건: 컴퓨터 켜놔야 함
```

### 장기적 (무료, 영구):
```
Oracle Cloud

1. 회원가입: 10분
2. VM 생성: 20분
3. 서버 설정: 30분
4. 도메인 연결: 10분

비용: $0/월 (영구!)
조건: 없음
```

---

**어떤 방법이 좋으신가요?** 🤔

1️⃣ **Cloudflare Tunnel** (10분, 컴퓨터 켜야 함)  
2️⃣ **Oracle Cloud** (1시간, 영구 무료)  
3️⃣ **Fly.io** ($7/월, 쉬움)

**말씀해주세요!** 💪


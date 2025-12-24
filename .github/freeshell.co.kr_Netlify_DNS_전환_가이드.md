# 🚀 freeshell.co.kr Netlify DNS 전환 가이드

## 🔍 현재 상황 분석

### Netlify 대시보드 확인 결과

#### 1. Netlify DNS 설정
- **도메인**: `freeshell.co.kr`
- **DNS 레코드**: 2개 (NETLIFY 타입)
  - `freeshell.co.kr` → `imaginative-fudge-4eb324.netlify.app`
  - `www.freeshell.co.kr` → `imaginative-fudge-4eb324.netlify.app`
- **상태**: `freeshell.co.kr` - "Netlify DNS propagating..." (진행 중)
- **HTTPS**: 활성화됨 (Let's Encrypt)

#### 2. Netlify Name Servers
Netlify가 제공하는 네임서버:
- `dns1.p08.nsone.net`
- `dns2.p08.nsone.net`
- `dns3.p08.nsone.net`
- `dns4.p08.nsone.net`

#### 3. 현재 가비아 DNS 설정
- **A 레코드**: 5개 (75.2.60.5 등)
- **CNAME 레코드**: 1개 (www → Netlify URL)
- **DMARC 레코드**: 1개
- **SPF 레코드**: 1개

## ⚠️ 문제점

### 현재 설정의 문제
1. **이중 DNS 설정**
   - 가비아 DNS에서 A 레코드 사용
   - Netlify DNS에서 NETLIFY 타입 레코드 사용
   - 두 시스템이 충돌할 수 있음

2. **DNS 전파 지연**
   - `freeshell.co.kr` 상태가 "Netlify DNS propagating..." (진행 중)
   - 가비아 DNS와 Netlify DNS가 동시에 작동하여 혼란 발생

3. **MX Toolbox "DNS Record not found" 원인**
   - Netlify는 NETLIFY 타입 레코드를 사용 (일반 A 레코드 아님)
   - 가비아 DNS의 A 레코드가 Netlify의 실제 IP와 일치하지 않을 수 있음

## 💡 해결 방법: 두 가지 옵션

### 옵션 1: Netlify DNS로 완전 전환 (권장) ⭐

**장점**:
- ✅ Netlify의 자동 DNS 관리
- ✅ HTTPS 자동 설정
- ✅ 더 빠른 DNS 전파
- ✅ Netlify 기능 최적화

**단점**:
- ⚠️ 가비아 DNS 설정을 Netlify로 이전해야 함
- ⚠️ DMARC/SPF 레코드도 Netlify에서 관리해야 함

**전환 방법**:

#### 1단계: Netlify DNS에 DMARC/SPF 레코드 추가
1. Netlify 대시보드 → DNS → `freeshell.co.kr` 선택
2. "Add new record" 클릭
3. DMARC 레코드 추가:
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr
   TTL: 3600
   ```
4. SPF 레코드 추가:
   ```
   Type: TXT
   Name: @ (또는 비워둠)
   Value: v=spf1 -all
   TTL: 3600
   ```

#### 2단계: 가비아에서 네임서버 변경
1. 가비아 DNS 관리 페이지 접속
2. "DNS 권한 설정" 또는 "네임서버 설정" 메뉴로 이동
3. 네임서버를 Netlify로 변경:
   ```
   dns1.p08.nsone.net
   dns2.p08.nsone.net
   dns3.p08.nsone.net
   dns4.p08.nsone.net
   ```
4. 저장

#### 3단계: 가비아 DNS 레코드 삭제 (선택사항)
- 네임서버를 변경하면 가비아 DNS 레코드는 더 이상 사용되지 않음
- 하지만 백업을 위해 일단 유지하는 것도 좋음

### 옵션 2: 가비아 DNS 유지 + A 레코드 수정

**장점**:
- ✅ 가비아 DNS에서 모든 레코드 관리 가능
- ✅ Netlify로 전환할 필요 없음

**단점**:
- ⚠️ Netlify의 NETLIFY 타입 레코드와 충돌 가능
- ⚠️ DNS 전파가 더 느릴 수 있음

**수정 방법**:

#### 1단계: Netlify에서 정확한 IP 확인
1. Netlify 대시보드 → Domain management
2. 또는 Netlify 지원팀에 문의

#### 2단계: 가비아 DNS에서 A 레코드 수정
1. 가비아 DNS 관리 페이지 접속
2. 기존 A 레코드 5개 확인
3. Netlify가 제공하는 정확한 IP로 수정
4. 또는 Netlify 문서에서 최신 IP 확인

## 🎯 권장 사항: 옵션 1 (Netlify DNS 전환)

### 이유:
1. **Netlify 최적화**: Netlify를 사용 중이므로 Netlify DNS가 최적
2. **자동 관리**: HTTPS, DNS 레코드 자동 관리
3. **더 빠른 전파**: Netlify 인프라 사용으로 더 빠름
4. **현재 상태**: 이미 Netlify DNS가 설정되어 있음

### 전환 절차 요약:

1. **Netlify DNS에 DMARC/SPF 추가** (5분)
   - Netlify 대시보드 → DNS → Add new record

2. **가비아에서 네임서버 변경** (5분)
   - 가비아 DNS 관리 → 네임서버 설정 → Netlify 네임서버로 변경

3. **전파 대기** (5-10분)
   - DNS 전파 확인: https://dnschecker.org

4. **확인** (5분)
   - MX Toolbox에서 재확인
   - Netlify 대시보드에서 상태 확인

## 📋 체크리스트

### Netlify DNS 전환 (옵션 1)

- [ ] Netlify DNS에 DMARC 레코드 추가
- [ ] Netlify DNS에 SPF 레코드 추가
- [ ] 가비아에서 네임서버를 Netlify로 변경
- [ ] DNS 전파 확인 (5-10분 후)
- [ ] MX Toolbox에서 재확인
- [ ] Netlify 대시보드에서 상태 확인

### 가비아 DNS 유지 (옵션 2)

- [ ] Netlify에서 정확한 IP 주소 확인
- [ ] 가비아 DNS에서 A 레코드 IP 수정
- [ ] DNS 전파 확인 (24-48시간)
- [ ] MX Toolbox에서 재확인

## 🔍 확인 명령어

### DNS 전파 확인
```powershell
# 네임서버 확인
nslookup -type=NS freeshell.co.kr

# A 레코드 확인
nslookup freeshell.co.kr

# DMARC 레코드 확인
nslookup -type=TXT _dmarc.freeshell.co.kr
```

### 온라인 도구
- **DNS Checker**: https://dnschecker.org
- **MX Toolbox**: https://mxtoolbox.com/SuperTool.aspx

## ⏱️ 예상 소요 시간

### 옵션 1 (Netlify DNS 전환)
- **설정 시간**: 10분
- **전파 시간**: 5-10분
- **총 소요 시간**: 약 20분

### 옵션 2 (가비아 DNS 유지)
- **설정 시간**: 5분
- **전파 시간**: 24-48시간
- **총 소요 시간**: 1-2일

## 🚨 중요 사항

1. **네임서버 변경 시 주의**
   - 네임서버를 변경하면 가비아 DNS의 모든 레코드가 무시됨
   - Netlify DNS에 필요한 모든 레코드를 먼저 추가해야 함

2. **DMARC/SPF 레코드**
   - Netlify DNS로 전환 시 DMARC/SPF도 Netlify에 추가해야 함
   - 가비아 DNS의 레코드는 더 이상 작동하지 않음

3. **HTTPS 인증서**
   - Netlify는 Let's Encrypt를 사용하여 자동으로 인증서 발급
   - 이미 활성화되어 있음 ✅

## 📞 다음 단계

1. **지금**: Netlify DNS에 DMARC/SPF 레코드 추가
2. **즉시**: 가비아에서 네임서버를 Netlify로 변경
3. **10분 후**: DNS 전파 확인
4. **확인**: MX Toolbox에서 모든 항목이 ✅로 표시되는지 확인

**권장: 옵션 1 (Netlify DNS 전환)을 선택하세요!**


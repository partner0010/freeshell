# ☁️ Oracle Cloud 완벽 설정 가이드

**비용**: $0/월 (영구 무료!)  
**소요 시간**: 1-2시간  
**난이도**: ⭐⭐⭐☆☆

---

## 🎯 **Oracle Cloud Always Free**

### 제공 내용 (영구 무료!)
```
✅ VM.Standard.E2.1.Micro (2개)
   - 1 OCPU (ARM)
   - 1GB RAM (각)
   - 50GB 부트 볼륨 (각)

✅ 네트워크
   - 고정 공인 IP (2개)
   - 10TB 아웃바운드/월

✅ 데이터베이스
   - Autonomous Database (20GB)

✅ Object Storage
   - 20GB

→ 영구 무료! 평생 과금 없음!
```

---

## 📋 **1단계: Oracle Cloud 회원가입**

### 1. 사이트 접속
```
https://www.oracle.com/cloud/free/
```

### 2. "Start for free" 클릭
```
1. 국가: 대한민국
2. 이메일: 본인 이메일
3. 이름: 본인 이름
```

### 3. 계정 유형 선택
```
개인 사용: "Individual" 선택
```

### 4. 신용카드 등록
```
⚠️ 신용카드 필요 (본인 확인용)
⚠️ $1 임시 인증 후 취소됨
⚠️ Always Free 서비스는 과금 절대 안 됨!

→ 안심하고 등록하세요
```

### 5. 계정 활성화
```
이메일 확인
→ 링크 클릭
→ 계정 활성화
```

---

## 📋 **2단계: VM 인스턴스 생성**

### 1. 콘솔 접속
```
https://cloud.oracle.com

로그인
→ 대시보드
```

### 2. Compute → Instances 이동
```
좌측 메뉴:
Compute → Instances → Create Instance
```

### 3. 인스턴스 설정
```
Name: freeshell-server

Placement:
- Availability Domain: (아무거나 선택)

Image and Shape:
- Image: Ubuntu 22.04 (권장)
- Shape: VM.Standard.E2.1.Micro (Always Free)
  → "Change Shape" 클릭
  → "Specialty and previous generation"
  → "VM.Standard.E2.1.Micro" 선택

Networking:
- Virtual Cloud Network: (기본값)
- Subnet: (기본값)
- Public IP: "Assign a public IPv4 address" 체크!

SSH Keys:
- "Generate a key pair for me" 선택
- "Save Private Key" 클릭 (다운로드!)
- "Save Public Key" 클릭
```

### 4. Create 버튼 클릭!
```
2-3분 후 VM 생성 완료
→ "Running" 상태 확인
→ 공인 IP 주소 확인 (예: 123.45.67.89)
```

---

## 📋 **3단계: 방화벽 열기**

### 1. Networking → Virtual Cloud Networks
```
기본 VCN 클릭
→ Security Lists 클릭
→ Default Security List 클릭
```

### 2. Ingress Rules 추가
```
"Add Ingress Rules" 클릭

Rule 1 (HTTP):
- Source CIDR: 0.0.0.0/0
- Destination Port: 80
→ Add

Rule 2 (HTTPS):
- Source CIDR: 0.0.0.0/0
- Destination Port: 443
→ Add

Rule 3 (Backend):
- Source CIDR: 0.0.0.0/0
- Destination Port: 3001
→ Add
```

---

## 📋 **4단계: SSH 접속 & 서버 설정**

### 1. SSH 접속 (PowerShell)
```powershell
# SSH 키 파일 위치 (다운로드한 파일)
cd C:\Users\partn\Downloads

# 권한 설정
icacls ssh-key-*.key /inheritance:r
icacls ssh-key-*.key /grant:r "%USERNAME%:R"

# SSH 접속
ssh -i ssh-key-*.key ubuntu@YOUR_PUBLIC_IP
```

### 2. 방화벽 설정 (Ubuntu)
```bash
# Ubuntu 방화벽 열기
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3001 -j ACCEPT
sudo netfilter-persistent save
```

### 3. Node.js 설치
```bash
# Node.js 20 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 확인
node --version
npm --version
```

### 4. PM2 설치 (프로세스 관리)
```bash
sudo npm install -g pm2
```

### 5. 코드 업로드
```bash
# Git 설치
sudo apt-get install -y git

# 저장소 클론
git clone https://github.com/partner0010/Freeshell.git
cd Freeshell
```

### 6. 백엔드 설정
```bash
cd backend

# 환경 변수 설정
nano .env

# 다음 내용 입력:
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://freeshell.co.kr
DATABASE_URL=file:./data/database.db
JWT_SECRET=YOUR_RANDOM_SECRET
OPENAI_API_KEY=YOUR_KEY

# 저장: Ctrl+O, Enter, Ctrl+X

# 패키지 설치
npm install

# Prisma 설정
npx prisma generate
npx prisma migrate deploy

# 관리자 계정 생성
npm run create-admin-simple

# PM2로 시작
pm2 start npm --name "freeshell-backend" -- start
pm2 save
pm2 startup
```

### 7. 프론트엔드 빌드
```bash
cd ..

# 환경 변수
echo "VITE_API_URL=https://freeshell.co.kr" > .env

# 빌드
npm install
npm run build

# 정적 파일 서버 (serve)
sudo npm install -g serve
pm2 start serve --name "freeshell-frontend" -- dist -l 3000

pm2 save
```

---

## 📋 **5단계: Nginx 설정**

### 1. Nginx 설치
```bash
sudo apt-get install -y nginx
```

### 2. Nginx 설정
```bash
sudo nano /etc/nginx/sites-available/freeshell
```

### 3. 설정 파일 내용:
```nginx
server {
    listen 80;
    server_name freeshell.co.kr www.freeshell.co.kr;

    # 프론트엔드
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 백엔드 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO (원격 지원)
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

### 4. Nginx 활성화
```bash
# 심볼릭 링크
sudo ln -s /etc/nginx/sites-available/freeshell /etc/nginx/sites-enabled/

# 기본 사이트 제거
sudo rm /etc/nginx/sites-enabled/default

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

---

## 📋 **6단계: Cloudflare DNS 설정**

### 1. Cloudflare 대시보드
```
https://dash.cloudflare.com

freeshell.co.kr 선택
→ DNS 탭
```

### 2. A 레코드 추가
```
Type: A
Name: @
IPv4: YOUR_ORACLE_CLOUD_IP
Proxy: OFF (회색 구름) ← 중요!

Type: A
Name: www
IPv4: YOUR_ORACLE_CLOUD_IP
Proxy: OFF (회색 구름)
```

### 3. SSL/TLS 설정
```
SSL/TLS 탭
→ "Full" 선택
```

---

## 📋 **7단계: HTTPS 설정 (Let's Encrypt)**

### 1. Certbot 설치
```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2. SSL 인증서 발급
```bash
sudo certbot --nginx -d freeshell.co.kr -d www.freeshell.co.kr
```

### 3. 자동 갱신
```bash
# 자동 갱신 테스트
sudo certbot renew --dry-run

# Cron 자동 갱신 (이미 설정됨)
```

---

## ✅ **완료! 확인하기**

### 1. 서버 상태
```bash
# PM2 상태
pm2 status

# 로그
pm2 logs
```

### 2. 웹사이트 접속
```
https://freeshell.co.kr

→ 로그인 화면 나오면 성공!
```

### 3. 관리자 로그인
```
아이디: admin
비밀번호: Admin123!@#
OTP: 생략 가능
```

---

## 🎯 **간단 요약**

```
1. Oracle Cloud 가입 (10분)
2. VM 생성 (5분)
3. 방화벽 설정 (5분)
4. SSH 접속 (2분)
5. 서버 설정 (30분)
6. Nginx 설정 (10분)
7. DNS 설정 (5분)
8. HTTPS 설정 (5분)

총: 약 1시간 10분
```

---

## 💡 **시작하시겠어요?**

```
https://www.oracle.com/cloud/free/

지금 가입하시면 단계별로 도와드리겠습니다!
```

---

**영구 무료입니다!** ✅  
**freeshell.co.kr 사용 가능!** 🌐  
**시작하시겠어요?** 🚀

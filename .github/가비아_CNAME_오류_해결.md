# 🔧 가비아 CNAME 오류 해결

## 문제

가비아 DNS에서 CNAME 레코드를 추가할 때 다음 오류가 발생합니다:

**오류 메시지:**
```
CNAME타입의 '값/위치'는 점(.)으로 끝나야 합니다.
```

## 원인

가비아 DNS 시스템이 CNAME 값이 FQDN (Fully Qualified Domain Name) 형식이어야 한다고 요구합니다.
- FQDN은 도메인 이름 끝에 점(.)이 있어야 합니다.

## 해결 방법

### CNAME 값 수정

**현재 값 (오류):**
```
imaginative-fudge-4eb324.netlify.app
```

**수정된 값 (올바름):**
```
imaginative-fudge-4eb324.netlify.app.
```

**⚠️ 중요:** 끝에 점(.)을 추가해야 합니다!

---

## 가비아 DNS 설정

### www 서브도메인 연결

```
호스트: www
타입: CNAME
값/위치: imaginative-fudge-4eb324.netlify.app.  (끝에 점 추가!)
TTL: 3600
```

---

## 단계별 수정

1. **가비아 DNS 레코드 수정 화면에서**

2. **CNAME 레코드의 "값/위치" 필드 클릭**

3. **값 수정:**
   - 현재: `imaginative-fudge-4eb324.netlify.app`
   - 수정: `imaginative-fudge-4eb324.netlify.app.` (끝에 점 추가)

4. **"확인" 또는 "저장" 버튼 클릭**

5. **오류 메시지가 사라지는지 확인**

---

## 확인 방법

1. **오류 메시지 확인**
   - 빨간색 오류 메시지가 사라지면 성공

2. **레코드 저장**
   - "저장" 버튼 클릭
   - 저장이 성공하면 완료

3. **DNS 전파 대기**
   - DNS 설정 후 전파까지 5분 ~ 24시간

---

## 참고

### FQDN (Fully Qualified Domain Name)

- FQDN은 도메인 이름 끝에 점(.)이 있는 형식입니다
- 예: `example.com.` (끝에 점)
- 일부 DNS 시스템은 FQDN 형식을 요구합니다

### Netlify CNAME 값

- Netlify에서 제공하는 값: `imaginative-fudge-4eb324.netlify.app`
- 가비아 DNS에 입력할 값: `imaginative-fudge-4eb324.netlify.app.` (끝에 점 추가)

---

## 🚀 지금 바로 하세요!

1. **가비아 DNS 레코드 수정 화면에서**
2. **CNAME 레코드의 "값/위치" 필드 수정**
3. **값 끝에 점(.) 추가:** `imaginative-fudge-4eb324.netlify.app.`
4. **"확인" 또는 "저장" 버튼 클릭**

**이것만 하면 됩니다!** 🎉


# 배치 파일 실행 로그 실시간 확인 방법

## 🎯 실시간 모니터링 방법

배치 파일(`.github\deploy.bat`) 실행 중 로그를 실시간으로 확인하는 방법입니다.

## 방법 1: PowerShell로 실행하고 모니터링 (권장)

### 단계 1: 배치 파일을 PowerShell로 실행

```powershell
.github\monitor-deploy.ps1
```

이 스크립트는:
- 배치 파일을 백그라운드에서 실행
- 로그 파일(`deploy.log`)을 실시간으로 모니터링
- 새 로그 내용을 화면에 표시

### 단계 2: 새 터미널 창에서 실시간 확인

배치 파일이 실행 중일 때, **또 다른 PowerShell 창**을 열고:

```powershell
cd "C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell Update"
Get-Content deploy.log -Wait -Tail 30
```

이 명령어는:
- `-Wait`: 파일에 새 내용이 추가될 때까지 대기 (실시간 모니터링)
- `-Tail 30`: 마지막 30줄만 표시

## 방법 2: 로그 뷰어 배치 파일 사용

### 배치 파일 실행 전 또는 실행 중

1. **배치 파일 실행**: `.github\deploy.bat`
2. **새 명령 프롬프트 창 열기**
3. **로그 확인**: `.github\view-log.bat` 실행

`view-log.bat`에서 "4. 실시간 모니터링" 옵션을 선택하면 새 로그만 표시됩니다.

## 방법 3: 두 창으로 분할 모니터링

### 창 1: 배치 파일 실행
```cmd
.github\deploy.bat
```

### 창 2: 실시간 로그 확인
```powershell
# PowerShell에서
Get-Content deploy.log -Wait -Tail 50 -Encoding UTF8
```

또는

```cmd
# 명령 프롬프트에서
powershell -Command "Get-Content deploy.log -Wait -Tail 50 -Encoding UTF8"
```

## 방법 4: PowerShell ISE 또는 VS Code 사용

1. PowerShell ISE 또는 VS Code에서 PowerShell 터미널 열기
2. 배치 파일 실행 (백그라운드):
   ```powershell
   Start-Process cmd.exe -ArgumentList "/c", "`.github\deploy.bat`"
   ```
3. 같은 터미널에서 로그 모니터링:
   ```powershell
   Get-Content deploy.log -Wait -Tail 30
   ```

## 📋 빠른 참조

### 로그 파일 위치
```
C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell Update\deploy.log
```

### 유용한 명령어

#### 마지막 N줄 보기
```powershell
Get-Content deploy.log -Tail 50
```

#### 실시간 모니터링
```powershell
Get-Content deploy.log -Wait -Tail 30
```

#### 특정 텍스트 검색
```powershell
Select-String -Path deploy.log -Pattern "ERROR" -Context 5
```

#### 로그 파일 크기 확인
```powershell
(Get-Item deploy.log).Length / 1KB
```

## 💡 팁

1. **배치 파일 실행 중 로그 확인**: 배치 파일 실행 후 새 터미널 창을 열어 로그를 확인하면 실시간으로 진행 상황을 볼 수 있습니다.

2. **로그 파일이 없으면**: 배치 파일이 아직 시작되지 않았거나, 실행이 실패한 것입니다.

3. **로그 파일이 너무 클 때**: 마지막 부분만 보려면 `-Tail` 옵션을 사용하세요.

4. **로그 파일 초기화**: 새로 시작하려면 로그 파일을 삭제하거나 이름을 변경하세요.

## 🔧 문제 해결

### PowerShell 실행 정책 오류

PowerShell 스크립트 실행이 차단된 경우:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 로그 파일이 업데이트되지 않음

1. 배치 파일이 실행 중인지 확인
2. 다른 프로세스가 로그 파일을 잠그고 있는지 확인
3. 디스크 공간 확인

### 실시간 모니터링이 작동하지 않음

`-Wait` 옵션이 작동하지 않으면:

1. PowerShell 버전 확인 (Windows 10 이상 권장)
2. 다른 방법 사용 (로그 뷰어 배치 파일)


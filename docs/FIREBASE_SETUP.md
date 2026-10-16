# Firebase Hosting + GitHub Actions 연결 가이드

운영 주소는 [ranke0802.web.app](https://ranke0802.web.app)입니다. Firebase 프로젝트는 `project-e2f0a`, Hosting 사이트는 `ranke0802`, 배포 대상 이름은 `portfolio`입니다. 배포 계정은 `github-portfolio@project-e2f0a.iam.gserviceaccount.com`입니다. 아래는 설정을 재현하거나 새 계정으로 교체할 때의 가이드입니다.

## 1. Firebase 프로젝트 만들기

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트를 생성하거나 기존 프로젝트를 선택합니다.
2. 프로젝트 설정 → 일반에서 **프로젝트 ID**를 확인합니다. 표시 이름이나 프로젝트 번호와 다릅니다.
3. Build → **Hosting**에서 시작하기를 진행합니다. 이 프로젝트는 정적 Hosting을 사용합니다. App Hosting, Firestore, 로그인 서비스, 웹 앱 SDK 등록은 현재 홈페이지에 필요하지 않습니다.

현재 연결 대상은 **`project-e2f0a`**이며 `.firebaserc`에 반영했습니다. 아래 명령의 프로젝트 ID도 이 값입니다. 서비스 계정과 GitHub Secret을 등록하면 자동 배포를 시작할 수 있습니다.

## 2. 로컬 설정 JSON 준비

Node.js 24 LTS 설치 후 PowerShell에서:

```powershell
cd C:\dev\portfolio
npm.cmd ci
npm.cmd run firebase:configure -- project-e2f0a
npm.cmd run check
npm.cmd run build
```

명령이 `.firebaserc`를 아래 형태로 갱신합니다. 프로젝트 ID는 비밀키가 아니므로 커밋해도 됩니다.

```json
{
  "projects": {
    "default": "project-e2f0a"
  },
  "targets": {
    "project-e2f0a": {
      "hosting": {
        "portfolio": ["ranke0802"]
      }
    }
  }
}
```

`firebase.json`은 이미 생성되어 있습니다. 배포 폴더는 `dist`, SPA 진입점은 `/index.html`이며, 해시가 포함된 자산과 HTML의 캐시 정책을 구분했습니다. **`firebase init`을 다시 실행할 필요가 없습니다.** 초기화 과정에서 기존 설정과 HTML을 덮어쓰지 않도록 유의하세요.

`firebase.json`의 `hosting.target`은 `portfolio`입니다. 이 이름을 `.firebaserc`에서 실제 사이트 `ranke0802`에 연결했습니다. GitHub Actions의 `target` 값도 `portfolio`이며 `FIREBASE_PROJECT_ID`는 계속 **프로젝트 ID인 `project-e2f0a`**를 사용합니다.

현재 사이트 생성과 대상 연결은 이미 완료했습니다. 다른 프로젝트로 이전할 때는 사용 가능한 사이트 ID를 생성한 뒤 대상을 연결합니다. 같은 프로젝트에서 대상 연결만 복원하려면:

```powershell
npx.cmd --yes firebase-tools@15.34.0 target:apply hosting portfolio ranke0802 --project project-e2f0a
```

## 3. 배포용 서비스 계정과 실제 JSON 키 발급

`firebase-service-account.example.json`은 구조 확인용입니다. 이 파일을 채우거나 이름을 바꾸는 것으로는 인증 키가 만들어지지 않습니다. **실제 private key는 Google Cloud가 발급해야 합니다.** 키를 채팅에 붙여 넣지 말고 GitHub Secret에 직접 등록하세요.

1. [Google Cloud 서비스 계정](https://console.cloud.google.com/iam-admin/serviceaccounts)에서 같은 Firebase 프로젝트를 선택합니다.
2. 서비스 계정 만들기 → 이름 예: `github-portfolio`.
3. 공식 Firebase 배포 Action 문서에 따라 역할을 부여합니다.
   - **Firebase Hosting Admin** (`roles/firebasehosting.admin`): Hosting 배포.
   - **API Keys Viewer** (`roles/serviceusage.apiKeysViewer`): Firebase CLI의 API 키 조회.
   - **Service Usage Consumer** (`roles/serviceusage.serviceUsageConsumer`): Firebase CLI가 프로젝트 API를 사용하는 권한.
   - **Firebase Authentication Admin** (`roles/firebaseauth.admin`): PR 미리보기 URL을 Auth 허용 도메인에 등록하는 동작에 필요. 미리보기 기능을 사용하지 않을 경우 필요 여부를 재검토할 수 있습니다.
4. 생성한 계정 → 키 → 키 추가 → 새 키 만들기 → **JSON**을 선택해 다운로드합니다.
5. 파일은 `C:\dev\portfolio` 밖의 개인 보관 위치에 둡니다. 이 저장소 안에 둘 경우 `.secrets/`에만 보관합니다.

Cloud Run/Functions 재작성은 사용하지 않으므로 해당 역할은 추가하지 않습니다. 조직 정책으로 JSON 키 생성이 막혀 있다면 정책을 우회하지 말고 관리자에게 확인하거나 Workload Identity Federation 방식으로 워크플로를 변경해야 합니다.

현재 작업에서 발급한 실제 JSON은 로컬 `.secrets/firebase-service-account.json`에 있습니다. 예시 파일과 달리 유효한 비밀키이며 Git에서 제외됩니다. 키 내용은 문서, 채팅, 소스 코드에 복사하지 않습니다.

참고: [Firebase 배포 Action의 서비스 계정 설정](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md).

## 4. GitHub 변수와 Secret 등록

[저장소 Actions 설정](https://github.com/ranke0802/portfolio/settings/secrets/actions)에서 두 값을 등록합니다. 둘 다 **Repository** 범위로 만듭니다. 현재 워크플로에는 Environment가 지정되어 있지 않습니다.

| 탭                                  | 이름                       | 값                               |
| ----------------------------------- | -------------------------- | -------------------------------- |
| Variables → New repository variable | `FIREBASE_PROJECT_ID`      | 실제 Firebase 프로젝트 ID        |
| Secrets → New repository secret     | `FIREBASE_SERVICE_ACCOUNT` | 다운로드한 JSON 파일의 전체 내용 |

Secret에는 파일 경로나 Base64 문자열이 아니라 `{`부터 `}`까지 **원본 JSON 전체**를 붙여 넣습니다. JSON 안의 `project_id`와 Variable의 값은 같아야 합니다. `private_key` 안의 `\n` 표현을 임의로 바꾸지 않습니다.

Hosting만 사용하므로 별도의 Firebase 브라우저 `apiKey`, `firebaseConfig`, `.env` 파일은 필요 없습니다. 서비스 계정 JSON을 `src/`, `public/`, `VITE_*` 환경변수에 넣으면 안 됩니다.

## 5. 첫 배포 실행

프로젝트 ID 변경을 저장소에 반영하면 CI/CD가 시작됩니다.

```powershell
git add .firebaserc
git commit -m "Configure Firebase project"
git push origin main
```

이미 커밋한 상태라면 [GitHub Actions](https://github.com/ranke0802/portfolio/actions) → **Portfolio CI and Firebase Hosting** → **Run workflow** → 브랜치 **main**으로 실행합니다.

배포 단계가 성공하면 Firebase Hosting 콘솔과 해당 Action 로그에서 실제 주소를 확인합니다. 현재 운영 주소는 `https://ranke0802.web.app`입니다. 사이트 ID가 URL을 결정하며, 프로젝트 ID와 다를 수 있습니다.

| 이벤트                         | 실행 결과                                  |
| ------------------------------ | ------------------------------------------ |
| `main`에 push                  | 타입 검사 + 빌드 + 운영 채널 배포          |
| 같은 저장소에서 `main` 대상 PR | 타입 검사 + 빌드 + 7일 만료 미리보기       |
| 외부 fork에서 PR               | 타입 검사 + 빌드, Secret 사용 및 배포 없음 |
| `main`에서 수동 실행           | 타입 검사 + 빌드 + 운영 채널 배포          |
| 다른 브랜치에서 수동 실행      | 타입 검사 + 빌드만 수행                    |
| 두 Firebase 설정 모두 없음     | 타입 검사 + 빌드, 배포 대기 안내           |

자동 PR 댓글 없이 미리보기 URL을 Action 로그에서 제공합니다. `pull_request_target` 이벤트를 사용하지 않습니다. 같은 저장소의 PR은 신뢰하는 기여자만 생성할 수 있도록 저장소 쓰기 권한을 관리합니다.

## 6. 로컬에서 수동 배포할 경우

CI/CD 설정과 별개로 자신의 Google 계정으로 로그인하여 배포할 수 있습니다.

```powershell
cd C:\dev\portfolio
npx.cmd --yes firebase-tools@15.34.0 login
npx.cmd --yes firebase-tools@15.34.0 projects:list
npm.cmd run check
npm.cmd run build
npx.cmd --yes firebase-tools@15.34.0 deploy --only hosting --project project-e2f0a
```

로컬 로그인은 GitHub Actions 인증을 대신하지 않습니다. CI에는 4단계의 변수와 Secret이 필요합니다. 배포 전 매번 빌드해야 최근 변경이 반영됩니다.

## 문제 확인

- **로컬 Node 버전 오류**: `node --version`이 v24인지 확인하고 터미널을 다시 엽니다. 이 PC에서 작업 시작 시 기본 Node는 v16이었습니다.
- **CI는 초록색인데 웹사이트가 없음**: Summary의 “Firebase 배포 대기” 여부와 deploy 단계가 실제로 실행됐는지 확인합니다.
- **Secret을 추가했는데 배포 안 됨**: Repository Variable도 함께 등록하고, 과거 실행 대신 `main`에서 새 workflow를 실행합니다.
- **프로젝트 불일치/JSON 오류**: Secret 원문과 `FIREBASE_PROJECT_ID`, `.firebaserc`가 같은 프로젝트를 가리키는지 확인합니다.
- **403 / 권한 오류**: Google Cloud에서 선택한 프로젝트와 서비스 계정 역할을 확인합니다. 추가 API 권한이 필요한 경우 로그에 명시된 권한만 검토합니다.
- **Hosting site 또는 target 없음**: Firebase Console에 `ranke0802` 사이트가 있는지, `.firebaserc`에서 `portfolio`가 이 사이트에 연결되는지 확인합니다.
- **fork PR에서 미리보기 없음**: 정상 동작입니다. 외부 PR에는 배포 인증 정보를 제공하지 않습니다.
- **커스텀 도메인**: Firebase Hosting → 커스텀 도메인 추가에서 DNS 안내를 따릅니다.
- **키가 노출됨**: Google Cloud에서 해당 키를 삭제하고 새 키를 발급해 GitHub Secret을 교체합니다. Git에서 파일만 지우는 것으로 키가 폐기되지는 않습니다.

공식 참고: [Hosting 시작하기](https://firebase.google.com/docs/hosting/quickstart), [GitHub 연동](https://firebase.google.com/docs/hosting/github-integration), [Hosting 설정](https://firebase.google.com/docs/hosting/full-config), [배포 Action 옵션](https://github.com/FirebaseExtended/action-hosting-deploy).

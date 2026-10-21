# RANKE Portfolio

React + TypeScript + Vite 기반의 반응형 개인 포트폴리오입니다. Firebase Hosting 배포와 GitHub Actions CI/CD 구성을 포함합니다.

실제 작업 경로: `C:\dev\portfolio`

저장소: [ranke0802/portfolio](https://github.com/ranke0802/portfolio)

운영 사이트: [ranke0802.web.app](https://ranke0802.web.app)

Firebase 프로젝트는 `project-e2f0a`, Hosting 사이트는 `ranke0802`입니다. `portfolio` 배포 대상이 해당 사이트에 연결되어 있으며 운영/PR 미리보기 배포 모두 이 대상을 사용합니다.

## 로컬 실행

**Node.js 24 LTS**를 설치한 뒤 새 터미널에서 실행합니다. Node.js 16은 지원하지 않습니다. `.nvmrc`와 `.node-version`에 버전을 명시했습니다.

```powershell
cd C:\dev\portfolio
node --version
npm.cmd ci
npm.cmd run dev
```

기본 개발 주소: `http://127.0.0.1:5173`. PowerShell에서 실행 정책 때문에 `npm.ps1`이 차단되면 위처럼 `npm.cmd`를 사용합니다.

```powershell
npm.cmd run check   # TypeScript 검사
npm.cmd run build   # dist/ 빌드
npm.cmd run preview # 빌드 결과 미리보기
```

## 내 내용으로 바꾸기

| 파일                 | 바꿀 내용                                       |
| -------------------- | ----------------------------------------------- |
| `src/content.ts`     | 이름, GitHub, 이메일, 소개, 프로젝트, 기술 목록 |
| `src/App.tsx`        | 섹션 구성, 프로젝트 그림, 고정 문구             |
| `src/styles.css`     | 색상, 타이포그래피, 반응형 레이아웃             |
| `index.html`         | 브라우저 제목, 검색 설명, Open Graph 정보       |
| `public/favicon.svg` | 브라우저 아이콘                                 |

프로젝트 01은 이 저장소이며, 02는 [Yurika Online](https://ranke0802-yurika.web.app/) 게임입니다. 카드와 상세 화면의 플레이 버튼 및 GitHub 소스 링크는 `src/content.ts`에서 관리합니다. 03은 [Tetris DX](https://ranke0802.github.io/tetris/)이며 [argon 브랜치](https://github.com/ranke0802/tetris/tree/argon)의 게임으로 연결합니다. 자기소개 문구도 기본 예시이므로 본인 소개로 교체하세요. `profile.email`에 실제 주소를 입력하면 이메일 연락 버튼과 링크가 나타납니다. 빈 값일 때는 GitHub로 연결됩니다. 연락 폼이나 메시지 저장 기능은 없습니다.

글꼴은 Google Fonts에서 불러오며, 접속할 수 없으면 시스템 글꼴로 표시합니다. Yurika 카드에는 기존 야영지 아트의 WebP 미리보기(`src/assets/yurika-camp.webp`), Moonforest 카드에는 제공된 모델링 화면의 WebP 썸네일(`src/assets/moonforest-3d.webp`)을 사용합니다. 포트폴리오와 Tetris DX 카드의 시각 자료는 CSS로 구성합니다.

## Firebase 연결

**[Firebase 연결 및 CI/CD 가이드](docs/FIREBASE_SETUP.md)**의 순서대로 설정하세요.

| 파일/설정                                    | 용도                                         |
| -------------------------------------------- | -------------------------------------------- |
| `firebase.json`                              | `dist` 배포, SPA 경로, 캐시 및 응답 헤더     |
| `.firebaserc`                                | 로컬 Firebase 기본 프로젝트 ID               |
| `firebase-service-account.example.json`      | 서비스 계정 JSON의 구조 예시. 실제 키가 아님 |
| Repository Variable `FIREBASE_PROJECT_ID`    | CI에서 사용할 실제 프로젝트 ID               |
| Repository Secret `FIREBASE_SERVICE_ACCOUNT` | Google에서 발급한 서비스 계정 JSON 전체      |

연결할 Firebase 프로젝트 ID는 `project-e2f0a`이며 `.firebaserc`에 반영되어 있습니다. 다른 프로젝트로 바꾸려면:

```powershell
npm.cmd run firebase:configure -- project-e2f0a
```

`main` push → 의존성 설치 → 타입 검사 → 빌드 → Firebase 운영 배포. 같은 저장소의 PR은 7일짜리 미리보기를 생성하고, 외부 fork PR은 검사와 빌드만 실행합니다. 미리보기 주소는 Actions 로그에서 확인합니다. 자동 PR 댓글은 작성하지 않습니다.

Firebase 변수와 Secret이 **모두 비어 있으면 빌드만 수행**하고 Actions Summary에 설정 안내를 남깁니다. 일부만 설정하거나 다른 프로젝트의 키를 넣으면 구성 단계에서 실패합니다. Firebase 프로젝트 연결 전의 CI 성공은 배포 성공을 의미하지 않습니다.

최초 연결 후 [Actions](https://github.com/ranke0802/portfolio/actions)에서 `Portfolio CI and Firebase Hosting` → `Run workflow` → `main`을 실행하면 추가 커밋 없이 배포할 수 있습니다.

실제 인증 키는 저장소에 커밋하지 않습니다. 다운로드한 JSON은 저장소 밖에 두거나 무시되는 `.secrets/` 안에 보관하세요. 페이지는 Firebase Hosting과 방문 통계용 Realtime Database REST API를 사용합니다. Web SDK, Auth, Firestore는 사용하지 않습니다.

이 작업에서 발급한 실제 배포 계정 JSON은 로컬 `.secrets/firebase-service-account.json`에 보관됩니다. Git에서 제외되는 비공개 파일입니다. 예시 JSON과 혼동하지 마세요.

## 프로젝트 실행과 방문 통계

프로젝트 04는 [Moonforest 3D 전사·궁수 모델링 테스트](https://ranke0802.github.io/moonforest/ArcherPreviewSite/?character=warrior)입니다. 제공된 화면을 약 22KB WebP 썸네일로 사용합니다.

게임과 데모의 실행 버튼은 현재 페이지의 모달에서 실행합니다. 데스크톱에서는 화면의 80% 너비·높이, 모바일에서는 화면에 맞는 너비·85% 높이를 사용합니다. iframe은 실행 버튼을 누른 뒤에만 생성하고 닫으면 제거합니다. 원본 게임은 각자의 기존 호스팅에서 실행되며, 사용자가 실제로 열면 해당 호스팅의 자산 전송이 발생합니다. GitHub 소스 링크와 모달의 선택적 ‘새 탭’ 링크는 별도 탭으로 열립니다.

하단 방문 통계는 `project-e2f0a` Realtime Database의 `/portfolioStats/visits`만 사용합니다. 한국 시간 기준 브라우저별 하루 한 번, 서버의 원자적 증가로 `total`과 `days/YYYY-MM-DD`를 함께 갱신합니다. 페이지당 해당 날짜와 누적 숫자만 읽으며 실시간 구독·자동 재시도·전체 DB 읽기는 하지 않습니다. 브라우저에는 마지막 집계 날짜만 저장합니다.

`ranke0802.web.app`과 `ranke0802.firebaseapp.com`만 집계하며 localhost·PR 미리보기는 제외합니다. 통계는 2026-10-21 기능 적용 이후부터 시작합니다. 누적은 일별 방문의 합이며 서로 다른 사람 수를 보장하지 않는 참고 통계입니다. 브라우저/저장소를 바꾸거나 지우면 다시 집계될 수 있고, 저장소 차단·통신 실패 시 누락될 수 있습니다. 기존 DB 접근 정책을 사용하며 게임의 데이터와 규칙은 변경하지 않습니다. 집계 실패 시 숫자를 임의로 표시하지 않습니다.

검증: `npm run test:visitors`는 중복 집계·날짜 변경·통신 오류를 가짜 서버로 검사하며 실제 Firebase에 접속하지 않습니다. UI는 localhost에서 모달·필터·모바일 화면만 확인합니다.

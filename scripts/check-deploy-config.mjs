import { appendFile } from "node:fs/promises";

const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const credential = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();

if (!projectId && !credential) {
  await appendFile(process.env.GITHUB_OUTPUT, "configured=false\n");
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    "### Firebase 배포 대기\n빌드 검사는 완료했습니다. 배포하려면 Repository Variable `FIREBASE_PROJECT_ID`와 Secret `FIREBASE_SERVICE_ACCOUNT`를 등록하세요. `docs/FIREBASE_SETUP.md`를 참고하세요.\n",
  );
} else {
  if (!projectId || !credential)
    throw new Error(
      "FIREBASE_PROJECT_ID 변수와 FIREBASE_SERVICE_ACCOUNT Secret을 모두 등록해야 합니다.",
    );
  if (
    !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId) ||
    projectId === "your-firebase-project-id"
  ) {
    throw new Error(
      "FIREBASE_PROJECT_ID에 실제 Firebase 프로젝트 ID를 입력하세요.",
    );
  }
  let account;
  try {
    account = JSON.parse(credential);
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT는 Google에서 발급받은 JSON 전체여야 합니다.",
    );
  }
  if (
    !account ||
    account.type !== "service_account" ||
    account.project_id !== projectId ||
    typeof account.client_email !== "string" ||
    !account.client_email.endsWith(".iam.gserviceaccount.com") ||
    typeof account.private_key !== "string" ||
    !account.private_key.startsWith("-----BEGIN PRIVATE KEY-----") ||
    account.private_key.includes("REPLACE_WITH")
  ) {
    throw new Error(
      "서비스 계정 JSON의 유형, 프로젝트 ID 또는 키가 올바르지 않습니다. 예시 파일은 인증에 사용할 수 없습니다.",
    );
  }
  await appendFile(process.env.GITHUB_OUTPUT, "configured=true\n");
}

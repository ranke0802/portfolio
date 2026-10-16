import { readFile, writeFile } from "node:fs/promises";

const [projectId, ...extra] = process.argv.slice(2);
if (
  !projectId ||
  extra.length ||
  !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId) ||
  projectId === "your-firebase-project-id"
) {
  console.error(
    "사용법: npm run firebase:configure -- 실제-Firebase-프로젝트-ID",
  );
  console.error(
    "프로젝트 ID: 소문자로 시작하는 6~30자의 소문자/숫자/하이픈. 끝은 문자 또는 숫자.",
  );
  process.exit(1);
}

const rcPath = new URL("../.firebaserc", import.meta.url);
const config = JSON.parse(await readFile(rcPath, "utf8"));
config.projects = { ...config.projects, default: projectId };
await writeFile(rcPath, JSON.stringify(config, null, 2) + "\n");
console.log(`.firebaserc의 기본 프로젝트를 ${projectId}로 설정했습니다.`);
console.log(
  "GitHub Actions Repository Variable FIREBASE_PROJECT_ID에도 같은 값을 입력하세요.",
);

// 이름, 소개, 프로젝트, 연락처는 이 파일에서 수정합니다.
// 이메일을 입력하면 연락처 영역에 메일 링크가 자동으로 나타납니다.
export const profile = {
  name: "RANKE",
  github: "https://github.com/ranke0802",
  email: "",
  intro: "아이디어를 화면으로,\n작은 시도를 더 나은 경험으로.",
  description:
    "배우고, 만들고, 개선하는 과정을 기록합니다.\n이곳은 그 여정을 담아가는 저만의 작은 공간입니다.",
  aboutTitle: "작은 호기심이\n다음 프로젝트가 되도록.",
  about:
    "무언가를 직접 만들어보는 일에서 시작합니다. 일상에서 발견한 불편함을 정리하고, 필요한 기능을 고민하고, 하나씩 구현하며 배웁니다. 이 공간에 문제를 풀어가는 과정과 그 결과를 차곡차곡 쌓아가려고 합니다.",
  note: "소개 문구와 예시 프로젝트는 포트폴리오를 시작하기 위한 기본 콘텐츠입니다.",
};

export type Category = "전체" | "웹" | "실험";
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, "전체">;
  kind: "portfolio" | "notes" | "dashboard";
  tags: string[];
  description: string;
  points: string[];
  sample: boolean;
  url?: string;
};

export const projects: Project[] = [
  {
    id: "01",
    title: "Personal portfolio",
    subtitle: "나를 소개하는 가장 나다운 공간",
    category: "웹",
    kind: "portfolio",
    tags: ["React", "TypeScript", "Firebase"],
    sample: false,
    description:
      "프로젝트와 개발 이야기를 모아 소개하는 개인 포트폴리오입니다. 지금 보고 있는 이 사이트이며, 다양한 화면 크기에 맞춰 편안하게 읽을 수 있도록 구성했습니다.",
    points: [
      "반응형 레이아웃과 키보드 탐색",
      "프로젝트 분류와 상세 보기",
      "GitHub Actions와 Firebase Hosting 배포 구성",
    ],
    url: "https://github.com/ranke0802/portfolio",
  },
  {
    id: "02",
    title: "Everyday notes",
    subtitle: "흩어진 생각을 한곳에 모으기",
    category: "웹",
    kind: "notes",
    tags: ["UI concept", "Web"],
    sample: true,
    description:
      "메모 서비스를 상상해 만든 프로젝트 카드 예시입니다. 실제 운영 중인 서비스가 아니며, 본인의 프로젝트 제목과 이미지, 작업 과정으로 교체해 사용할 수 있습니다.",
    points: [
      "어떤 문제에서 시작했는지 소개하기",
      "내가 담당한 역할과 선택한 기술 적기",
      "결과와 배운 점을 짧게 정리하기",
    ],
  },
  {
    id: "03",
    title: "A little experiment",
    subtitle: "데이터를 읽기 쉬운 화면으로",
    category: "실험",
    kind: "dashboard",
    tags: ["UI concept", "Data"],
    sample: true,
    description:
      "데이터 시각화 대시보드를 위한 화면 예시입니다. 실제 지표나 개발 성과를 나타내지 않습니다. 작은 사이드 프로젝트나 새로운 기술을 시험해 본 기록을 이 자리에 담아보세요.",
    points: [
      "실험의 목표와 가설 정리하기",
      "구현하면서 발견한 문제 기록하기",
      "다음에 개선할 부분 남기기",
    ],
  },
];

export const stack = [
  {
    name: "React",
    category: "INTERFACE",
    description: "작은 컴포넌트로 만드는 화면",
  },
  {
    name: "TypeScript",
    category: "LANGUAGE",
    description: "타입으로 더 명확하게 쓰는 코드",
  },
  { name: "Vite", category: "BUILD", description: "빠르고 가벼운 개발 환경" },
  {
    name: "Firebase",
    category: "HOSTING",
    description: "웹사이트를 세상과 연결하는 곳",
  },
];

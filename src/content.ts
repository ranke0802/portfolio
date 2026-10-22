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

export type Category = "전체" | "웹" | "게임" | "실험";
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, "전체">;
  kind: "portfolio" | "game" | "dashboard" | "tetris" | "modeling" | "bloomward";
  tags: string[];
  description: string;
  points: string[];
  sample: boolean;
  url?: string;
  liveUrl?: string;
  liveLabel?: string;
};

export const projects: Project[] = [
  {
    id: "01",
    title: "3D 전사·궁수 모델링 테스트",
    subtitle: "Moonforest · 캐릭터에 움직임을 더하는 실험",
    category: "실험",
    kind: "modeling",
    tags: ["3D Modeling", "Animation", "GitHub Pages"],
    sample: false,
    description:
      "전사와 궁수의 3D 모델과 전투 모션을 브라우저에서 살펴보는 캐릭터 플레이그라운드입니다. 캐릭터를 전환하고 직접 이동하거나 공격하며, 여러 각도에서 모델과 장비, 애니메이션을 확인할 수 있습니다.",
    points: [
      "전사 Violet Vanguard와 궁수 Azure Elf 캐릭터 전환",
      "이동·공격 모션 테스트와 공격 속도 조절",
      "드래그 회전·확대와 화질 설정으로 모델 살펴보기",
    ],
    url: "https://github.com/ranke0802/moonforest",
    liveUrl: "https://ranke0802.github.io/moonforest/ArcherPreviewSite/?character=warrior-v2",
    liveLabel: "모델링 테스트 열기",
  },
  {
    id: "02",
    title: "Yurika Online",
    subtitle: "작은 야영지에서 시작되는 나만의 모험",
    category: "게임",
    kind: "game",
    tags: ["JavaScript", "Canvas", "Firebase"],
    sample: false,
    description:
      "브라우저에서 바로 시작하는 판타지 RPG입니다. 마법사·마녀·전사·궁수 중 직업을 선택하고, 야영지에서 준비한 뒤 필드를 탐험하며 캐릭터를 성장시킵니다. 전투부터 장비, 퀘스트와 저장까지 하나의 플레이 흐름으로 연결했습니다.",
    points: [
      "네 가지 직업의 스킬과 실시간 필드 전투",
      "장비·퀘스트·성장 기록과 Firebase 계정 저장",
      "모바일 터치와 키보드 조작, PWA와 이미지 캐싱",
    ],
    url: "https://github.com/ranke0802/yurikaonline/tree/mmorpg_online",
    liveUrl: "https://ranke0802-yurika.web.app/",
  },
  {
    id: "03",
    title: "Tetris DX",
    subtitle: "픽셀 아케이드 감성으로 즐기는 테트리스",
    category: "게임",
    kind: "tetris",
    tags: ["JavaScript", "Canvas", "Web Audio"],
    sample: false,
    description:
      "네온과 픽셀 스타일을 담은 브라우저 테트리스입니다. 마라톤, 40라인 스프린트, 2분 울트라 모드로 즐길 수 있으며, 키보드와 모바일 터치 조작을 지원합니다.",
    points: [
      "7-BAG 랜덤 생성, SRS 회전과 T-스핀 판정",
      "모바일 다이나믹 조이스틱, 탭 하드드롭과 홀드 버튼",
      "Web Audio 8비트 사운드와 GitHub Pages 배포",
    ],
    url: "https://github.com/ranke0802/tetris/tree/argon",
    liveUrl: "https://ranke0802.github.io/tetris/",
  },
  {
    id: "04",
    title: "블룸워드",
    subtitle: "BLOOMWARD · 북녘의 영지를 되찾는 디펜스",
    category: "게임",
    kind: "bloomward",
    tags: ["JavaScript", "Canvas", "Defense"],
    sample: false,
    description:
      "북녘의 영지를 가꾸고 성문을 지키는 판타지 디펜스 게임입니다. 자원을 모아 건물을 발전시키고, 가신과 장비를 성장시키며 북부 전선을 넓혀 갑니다. 플레이 기록은 현재 브라우저에 저장됩니다.",
    points: [
      "자원 생산과 건설로 성장하는 영지",
      "가신·장비 육성과 성문 웨이브 방어",
      "북부 탐험과 브라우저 자동 저장",
    ],
    url: "https://github.com/ranke0802/portfolio/tree/main/public/games/bloomward",
    liveUrl: "/games/bloomward/",
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

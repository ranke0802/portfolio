import { useEffect, useRef, useState } from "react";
import { profile, projects, stack } from "./content";
import type { Category, Project } from "./content";
import yurikaCamp from "./assets/yurika-camp.webp";
import moonforestPreview from "./assets/moonforest-3d.webp";
import bloomwardPreview from "./assets/bloomward-preview.webp";
import VisitorCounter from "./VisitorCounter";
import ProjectRunner from "./ProjectRunner";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function ProjectArt({ kind }: { kind: Project["kind"] }) {
  if (kind === "bloomward")
    return (
      <div className="project-art art-game" aria-hidden="true">
        <img src={bloomwardPreview} alt="" loading="lazy" width="960" height="540" />
        <span className="game-badge">ESTATE & DEFENSE</span>
        <div className="game-caption">
          <span>THE NORTHERN LEGACY</span>
          <strong>Bloomward</strong>
        </div>
      </div>
    );
  if (kind === "modeling")
    return (
      <div className="project-art art-modeling" aria-hidden="true">
        <img src={moonforestPreview} alt="" loading="lazy" width="960" height="632" />
        <span className="modeling-badge">MOONFOREST / 3D</span>
        <span className="modeling-caption">CHARACTER PLAYGROUND</span>
      </div>
    );
  if (kind === "portfolio")
    return (
      <div className="project-art art-portfolio" aria-hidden="true">
        <div className="mini-portfolio">
          <div className="mini-nav">
            RANKE<span>PORTFOLIO / 01</span>
          </div>
          <div className="mini-headline">
            Ideas into
            <br />
            <em>interfaces.</em>
          </div>
          <div className="mini-bottom">
            A space for things I build.<span>↗</span>
          </div>
        </div>
        <div className="art-orbit" />
      </div>
    );
  if (kind === "tetris")
    return (
      <div className="project-art art-tetris" aria-hidden="true">
        <div className="tetris-preview">
          {Array.from({ length: 80 }, (_, i) => {
            const cells: Record<number, string> = { 14: "purple", 23: "purple", 24: "purple", 25: "purple", 48: "cyan", 49: "cyan", 50: "cyan", 51: "cyan", 58: "gold", 59: "gold", 65: "pink", 66: "pink", 68: "gold", 69: "gold", 74: "pink", 75: "pink", 76: "blue", 77: "blue", 78: "blue", 79: "blue" };
            return <i key={i} className={cells[i] ? 'block-' + cells[i] : undefined} />;
          })}
        </div>
        <span className="tetris-label">PIXEL ARCADE / 03</span>
        <strong className="tetris-title">TETRIS<span>DX</span></strong>
        <span className="tetris-mode">MARATHON · SPRINT · ULTRA</span>
      </div>
    );
  if (kind === "game")
    return (
      <div className="project-art art-game" aria-hidden="true">
        <img src={yurikaCamp} alt="" loading="lazy" width="960" height="443" />
        <span className="game-badge">BROWSER RPG</span>
        <div className="game-caption">
          <span>A LITTLE CAMP. A BIG ADVENTURE.</span>
          <strong>Yurika <em>Online</em></strong>
        </div>
      </div>
    );
  return (
    <div className="project-art art-dashboard" aria-hidden="true">
      <div className="mini-dashboard">
        <div className="dashboard-heading">
          <span className="dashboard-logo">◒</span>Overview<span>•••</span>
        </div>
        <div className="dashboard-value">
          Make it clear.<small>A NEW PERSPECTIVE</small>
        </div>
        <div className="chart-bars">
          {[32, 55, 43, 68, 54, 87, 72, 98].map((n, i) => (
            <i key={i} style={{ height: `${n}%` }} />
          ))}
        </div>
        <div className="chart-footer">
          <span>EXPLORE</span>
          <span>↗</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState<Category>("전체");
  const [selected, setSelected] = useState<Project | null>(null);
  const [running, setRunning] = useState<Project | null>(null);
  const launchTrigger = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visibleProjects = projects.filter(
    (project) => category === "전체" || project.category === category,
  );

  useEffect(() => {
    if (selected) {
      dialog.current?.showModal();
      return;
    }
    dialog.current?.close();
  }, [selected]);

  const modalOpen = Boolean(selected || running);
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [modalOpen]);

  function launchProject(project: Project, trigger: HTMLElement) {
    launchTrigger.current = trigger;
    setSelected(null);
    setRunning(project);
  }

  function closeProject() {
    const id = running?.id;
    setRunning(null);
    requestAnimationFrame(() => {
      const trigger = launchTrigger.current?.isConnected ? launchTrigger.current
        : document.querySelector<HTMLButtonElement>(`[data-project-id="${id}"] .project-button`);
      trigger?.focus();
    });
  }

  return (
    <>
      <a className="skip-link" href="#main">
        본문 바로가기
      </a>
      <header className="site-header container">
        <a className="wordmark" href="#home" aria-label={`${profile.name} 홈`}>
          <span className="brand-symbol">r.</span>
          {profile.name}
          <span className="wordmark-dot">®</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#work">프로젝트</a>
          <a href="#about">소개</a>
          <a className="nav-contact" href="#contact">
            연락하기 <Arrow diagonal />
          </a>
        </nav>
      </header>

      <main id="main">
        <section
          id="home"
          className="hero container"
          aria-labelledby="hero-title"
        >
          <div className="hero-topline">
            <span>
              <i className="status-dot" /> A WORK IN PROGRESS, ALWAYS.
            </span>
            <span className="edition">PERSONAL PORTFOLIO — VOL. 01</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">HELLO, I'M {profile.name}.</p>
              <h1 id="hero-title">
                Ideas into
                <br />
                <em>
                  interfaces<span>.</span>
                </em>
              </h1>
              <p className="hero-intro">{profile.intro}</p>
              <a className="button button-dark" href="#work">
                프로젝트 둘러보기 <Arrow />
              </a>
              <a
                className="hero-github"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub <Arrow diagonal />
              </a>
            </div>
            <div
              className="hero-visual"
              role="img"
              aria-label="Hello world 문구와 주황색 별이 놓인 입체적인 브라우저 일러스트"
            >
              <div className="visual-grid" />
              <span className="visual-coordinate">
                FIG. 001 / A FRESH START
              </span>
              <div className="browser-sculpture">
                <div className="browser-toolbar">
                  <span />
                  <span />
                  <span />
                  <i>my little corner of the internet</i>
                </div>
                <div className="browser-body">
                  <span className="hello-eyebrow">A NEW CHAPTER</span>
                  <div className="hello-title">
                    Hello,
                    <br />
                    <em>world.</em>
                  </div>
                  <div className="hello-bottom">
                    <span>DESIGN. CODE. REPEAT.</span>
                    <span>↗</span>
                  </div>
                </div>
              </div>
              <svg
                className="hero-star"
                viewBox="0 0 160 160"
                aria-hidden="true"
              >
                <path d="m80 0 13 44 35-28-17 43 47 1-39 26 35 31-47-5 8 46-35-32-24 34-1-47-45 14 28-38L0 68l46-9-13-44 35 29Z" />
              </svg>
              <div className="visual-sticker">
                <span>MADE OF</span>
                <strong>curiosity.</strong>
                <span>AND A LITTLE BIT OF CODE</span>
              </div>
              <div className="visual-caption">
                <span>FROM A THOUGHT TO A THING.</span>
                <span>↙</span>
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <span>생각을 정리하고, 직접 만들고, 더 나아갑니다.</span>
            <a href="#work">
              SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section
          id="work"
          className="work-section container"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2 id="work-title">
                만들며 쌓아가는 것들<span className="accent">.</span>
              </h2>
            </div>
            <div className="filters" role="group" aria-label="프로젝트 분류">
              {(["전체", "웹", "게임", "실험"] as Category[]).filter(item => item === "전체" || projects.some(project => project.category === item)).map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                  {item === "전체" && (
                    <span>{projects.length.toString().padStart(2, "0")}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {visibleProjects.length}개의 프로젝트
          </p>
          <div className="projects-grid">
            {visibleProjects.map((project) => (
              <article className="project" key={project.id} data-project-id={project.id}>
                <button
                  className="project-button"
                  onClick={() => setSelected(project)}
                  aria-label={`${project.title} 상세 보기`}
                >
                  <ProjectArt kind={project.kind} />
                  <div className="project-meta">
                    <span>
                      {project.category} /{" "}
                      {project.sample ? "예시 프로젝트" : project.kind === "portfolio" ? "이 웹사이트" : project.kind === "modeling" ? "인터랙티브 데모" : "플레이 가능"}
                    </span>
                    <span>{project.id}</span>
                  </div>
                  <div className="project-title">
                    <h3>{project.title}</h3>
                    <span className="project-arrow">
                      <Arrow diagonal />
                    </span>
                  </div>
                  <p>{project.subtitle}</p>
                </button>
                <ul className="tags" aria-label="사용 기술 및 유형">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {project.liveUrl && (
                  <button type="button" className="project-play text-link" onClick={event => launchProject(project, event.currentTarget)} aria-label={`${project.title} ${project.liveLabel ?? "플레이하기"} (화면에서 실행)`}>
                    {project.liveLabel ?? "플레이하기"} <Arrow diagonal />
                  </button>
                )}
              </article>
            ))}
          </div>

        </section>

        <section
          id="about"
          className="about-section"
          aria-labelledby="about-title"
        >
          <div className="container about-grid">
            <div>
              <p className="eyebrow">02 / A LITTLE ABOUT ME</p>
              <h2 id="about-title">{profile.aboutTitle}</h2>
              <div className="about-mark" aria-hidden="true">
                [<span>r.</span>]
              </div>
            </div>
            <div className="about-copy">
              <p className="about-lead">
                완성된 결과만큼,
                <br />
                만들어가는 과정을 좋아합니다.
              </p>
              <p>{profile.about}</p>
              <p className="muted">{profile.description}</p>
              <a
                className="text-link"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub에서 기록 살펴보기 <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="container stack-section">
            <div className="stack-label">
              <span className="eyebrow">BUILT WITH</span>
              <p>이 공간을 이루는 도구들</p>
            </div>
            <div className="stack-grid">
              {stack.map((item) => (
                <div className="stack-item" key={item.name}>
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="contact-section container"
          aria-labelledby="contact-title"
        >
          <p className="eyebrow">03 / WHAT'S NEXT?</p>
          <div className="contact-grid">
            <div>
              <h2 id="contact-title">
                좋은 대화가
                <br />
                다음 시작이 되니까<span className="accent">.</span>
              </h2>
              <p>
                프로젝트 이야기부터 가벼운 인사까지.
                <br />
                새로운 연결을 기다립니다.
              </p>
            </div>
            <a
              className="contact-circle"
              href={profile.email ? `mailto:${profile.email}` : profile.github}
              target={profile.email ? undefined : "_blank"}
              rel="noreferrer"
            >
              <Arrow diagonal />
              <span>
                {profile.email ? "이메일 보내기" : "GitHub에서 만나요"}
              </span>
            </a>
          </div>
          <div className="contact-links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GITHUB <Arrow diagonal />
            </a>
            {profile.email && (
              <a href={`mailto:${profile.email}`}>
                {profile.email} <Arrow diagonal />
              </a>
            )}
            <span>LET'S MAKE SOMETHING GOOD.</span>
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <div className="footer-main">
        <span>
          © {new Date().getFullYear()} {profile.name}. Built with curiosity.
        </span>
        <a href="#home">
          BACK TO TOP <span aria-hidden="true">↑</span>
        </a>
        </div>
        <VisitorCounter />
      </footer>

      <dialog
        ref={dialog}
        className="project-dialog"
        aria-labelledby="dialog-title"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
      >
        {selected && (
          <div className="dialog-content">
            <div className="dialog-top">
              <span className="eyebrow">
                PROJECT {selected.id}
                {selected.sample ? " / CONCEPT" : ""}
              </span>
              <button
                className="close-button"
                autoFocus
                onClick={() => setSelected(null)}
                aria-label="상세 보기 닫기"
              >
                ×
              </button>
            </div>
            <ProjectArt kind={selected.kind} />
            <h2 id="dialog-title">{selected.title}</h2>
            <p>{selected.description}</p>
            <ul className="project-points">
              {selected.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="project-actions">
            {selected.liveUrl && (
              <button type="button" className="button button-dark" onClick={event => launchProject(selected, event.currentTarget)}>
                {selected.liveLabel ?? "게임 플레이하기"} <Arrow diagonal />
              </button>
            )}
            {selected.url && (
              <a
                className={selected.liveUrl ? "text-link" : "button button-dark"}
                href={selected.url}
                target="_blank"
                rel="noreferrer"
              >
                GitHub 소스 보기 <Arrow diagonal />
              </a>
            )}
            </div>
          </div>
        )}
      </dialog>
      {running && <ProjectRunner project={running} onClose={closeProject} />}
    </>
  );
}

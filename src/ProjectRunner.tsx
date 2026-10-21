import { useEffect, useRef } from "react";
import type { Project } from "./content";

export default function ProjectRunner({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); };
  }, []);

  return (
    <dialog ref={dialog} className="project-runner" aria-labelledby="runner-title" onClose={onClose}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <header className="runner-header">
        <div className="runner-heading"><span>PROJECT {project.id} / LIVE</span><h2 id="runner-title">{project.title}</h2></div>
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="runner-external" aria-label={`${project.title} 새 탭에서 열기`}>새 탭 ↗</a>
        <button type="button" className="close-button" autoFocus onClick={() => dialog.current?.close()} aria-label="프로젝트 실행 닫기">×</button>
      </header>
      <iframe src={project.liveUrl} title={`${project.title} 실행 화면`} allow="autoplay; fullscreen; gamepad"
        referrerPolicy="strict-origin-when-cross-origin" onLoad={event => event.currentTarget.focus()} />
    </dialog>
  );
}

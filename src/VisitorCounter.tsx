import { useEffect, useState } from "react";
import { isVisitorCountingHost, loadVisitorStats } from "./visitorStats";
import type { VisitorStats } from "./visitorStats";

export default function VisitorCounter() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [failed, setFailed] = useState(false);
  const production = isVisitorCountingHost(window.location.hostname);

  useEffect(() => {
    if (!production) return;
    let active = true;
    loadVisitorStats().then(
      value => { if (active) setStats(value); },
      () => { if (active) setFailed(true); },
    );
    return () => { active = false; };
  }, [production]);

  const format = (value: number | undefined) => value === undefined ? "—" : value.toLocaleString("ko-KR");
  return (
    <div className="visitor-counter" aria-label="방문자 통계">
      <span className="visitor-label">THANKS FOR STOPPING BY</span>
      <dl className="visitor-numbers" aria-live="polite" aria-busy={production && !stats && !failed}>
        <div><dt>오늘</dt><dd>{format(stats?.today)}</dd></div>
        <div><dt>누적</dt><dd>{format(stats?.total)}</dd></div>
      </dl>
      <span className="visitor-note">
        {!production ? "미리보기 · 방문 집계 제외" : failed ? "방문 통계를 불러오지 못했습니다" : "브라우저별 하루 1회 · 한국 시간 기준"}
      </span>
    </div>
  );
}

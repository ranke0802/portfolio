export type VisitorStats = { today: number; total: number };

const database = "https://project-e2f0a-default-rtdb.asia-southeast1.firebasedatabase.app/portfolioStats/visits";
const storageKey = "ranke.portfolio.visit-day.v1";
type VisitStorage = Pick<Storage, "getItem" | "setItem">;

export function seoulDate(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

export async function readVisitorStats(day: string, request: typeof fetch = fetch): Promise<VisitorStats> {
  async function read(path: string) {
    const response = await request(`${database}/${path}.json`, {
      credentials: "omit", cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Visitor statistics unavailable");
    const value: unknown = await response.json();
    if (value === null) return 0;
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
      throw new Error("Invalid visitor statistics");
    }
    return value;
  }
  const [today, total] = await Promise.all([read(`days/${day}`), read("total")]);
  return { today, total };
}

export async function recordVisit(
  storage: VisitStorage | null,
  day = seoulDate(),
  request: typeof fetch = fetch,
): Promise<VisitorStats> {
  let shouldCount = false;
  try {
    if (storage && storage.getItem(storageKey) !== day) {
      // Reserve before the write: an ambiguous timeout must not cause a second increment.
      storage.setItem(storageKey, day);
      shouldCount = true;
    }
  } catch {
    // When browser storage is blocked, show shared counts without inflating them on reload.
  }
  if (shouldCount) {
    const increment = { ".sv": { increment: 1 } };
    const response = await request(`${database}.json?print=silent`, {
      method: "PATCH", credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total: increment, [`days/${day}`]: increment }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Visitor count could not be recorded");
  }
  return readVisitorStats(day, request);
}

export function isVisitorCountingHost(hostname: string): boolean {
  return hostname === "ranke0802.web.app" || hostname === "ranke0802.firebaseapp.com";
}

let visitRequest: Promise<VisitorStats> | undefined;
export function loadVisitorStats(): Promise<VisitorStats> {
  if (!visitRequest) {
    const count = () => {
      let storage: VisitStorage | null = null;
      try { storage = window.localStorage; } catch { /* Read-only fallback. */ }
      return recordVisit(storage);
    };
    // One operation per page, and one writer across tabs where Web Locks is available.
    visitRequest = navigator.locks
      ? navigator.locks.request("ranke-portfolio-visit", count)
      : count();
  }
  return visitRequest;
}

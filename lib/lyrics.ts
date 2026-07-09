export type LrcLine = {
  time: number;
  text: string;
};

const TIME_RE = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/g;

export function parseLrc(input: string | null | undefined): LrcLine[] {
  if (!input) return [];
  const lines = input.split(/\r?\n/);
  const out: LrcLine[] = [];
  for (const line of lines) {
    const matches = [...line.matchAll(TIME_RE)];
    if (matches.length === 0) continue;
    const text = line.replace(TIME_RE, "").trim();
    for (const m of matches) {
      const min = Number(m[1]);
      const sec = Number(m[2]);
      const cs = m[3] ? Number(m[3].padEnd(3, "0").slice(0, 3)) : 0;
      out.push({ time: min * 60 + sec + cs / 1000, text });
    }
  }
  return out.sort((a, b) => a.time - b.time);
}

export function findActiveLine(
  lines: LrcLine[],
  currentTime: number,
): number {
  if (lines.length === 0) return -1;
  let lo = 0;
  let hi = lines.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (lines[mid].time <= currentTime) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}

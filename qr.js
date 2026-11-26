function makeQrSvg(text) {
  const exp = new Array(512), log = new Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    Reflect.set(exp, i, x);
    Reflect.set(log, x, i);
    x <<= 1;
    if (x & 256) x ^= 285;
  }
  for (let i = 255; i < 512; i++) Reflect.set(exp, i, Reflect.get(exp, i - 255));
  const gmul = (a, b) => (a && b) ? Reflect.get(exp, Reflect.get(log, a) + Reflect.get(log, b)) : 0;

  let bits = "0100" + text.length.toString(2).padStart(8, "0");
  for (let i = 0; i < text.length; i++) bits += text.charCodeAt(i).toString(2).padStart(8, "0");
  bits += "0000";
  while (bits.length % 8) bits += "0";

  const cw = new Array();
  for (let i = 0; i < bits.length; i += 8) cw.push(parseInt(bits.slice(i, i + 8), 2));
  const pads = Array.of(236, 17);
  for (let i = 0; cw.length < 55; i++) cw.push(Reflect.get(pads, i % 2));

  let g = Array.of(1);
  for (let i = 0; i < 15; i++) {
    const ng = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      Reflect.set(ng, j, Reflect.get(ng, j) ^ Reflect.get(g, j));
      Reflect.set(ng, j + 1, Reflect.get(ng, j + 1) ^ gmul(Reflect.get(g, j), Reflect.get(exp, i)));
    }
    g = ng;
  }
  const rem = cw.concat(new Array(15).fill(0));
  for (let i = 0; i < cw.length; i++) {
    const c = Reflect.get(rem, i);
    if (c) for (let j = 1; j < g.length; j++) Reflect.set(rem, i + j, Reflect.get(rem, i + j) ^ gmul(Reflect.get(g, j), c));
  }
  const stream = cw.concat(rem.slice(cw.length)).map(b => b.toString(2).padStart(8, "0")).join("") + "0000000";

  const N = 29;
  const grid = Array.from({length: N}, () => new Array(N).fill(0));
  const func = Array.from({length: N}, () => new Array(N).fill(false));
  const getG = (r, c) => Reflect.get(Reflect.get(grid, r), c);
  const setG = (r, c, v) => Reflect.set(Reflect.get(grid, r), c, v);
  const getF = (r, c) => Reflect.get(Reflect.get(func, r), c);
  const setM = (r, c, v) => { setG(r, c, v); Reflect.set(Reflect.get(func, r), c, true); };

  const finder = (r0, c0) => {
    for (let dr = -1; dr <= 7; dr++) for (let dc = -1; dc <= 7; dc++) {
      const r = r0 + dr, c = c0 + dc;
      if (r >= 0 && r < N && c >= 0 && c < N) {
        const v = (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6 && (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4))) ? 1 : 0;
        setM(r, c, v);
      }
    }
  };
  finder(0, 0); finder(0, N - 7); finder(N - 7, 0);
  for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) setM(22 + dr, 22 + dc, (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (!dr && !dc)) ? 1 : 0);
  for (let i = 8; i < N - 8; i++) { setM(6, i, i % 2 === 0 ? 1 : 0); setM(i, 6, i % 2 === 0 ? 1 : 0); }
  setM(N - 8, 8, 1);
  for (let i = 0; i < 9; i++) { if (!getF(8, i)) setM(8, i, 0); if (!getF(i, 8)) setM(i, 8, 0); }
  for (let i = 0; i < 8; i++) { if (!getF(8, N - 1 - i)) setM(8, N - 1 - i, 0); if (!getF(N - 1 - i, 8)) setM(N - 1 - i, 8, 0); }

  let bi = 0, up = true;
  for (let c = N - 1; c > 0; c -= 2) {
    if (c === 6) c--;
    for (let step = 0; step < N; step++) {
      const r = up ? N - 1 - step : step;
      for (let dc = 0; dc >= -1; dc--) {
        if (!getF(r, c + dc)) {
          const bit = bi < stream.length ? +stream.charAt(bi++) : 0;
          setG(r, c + dc, bit ^ ((r + c + dc) % 2 === 0 ? 1 : 0));
        }
      }
    }
    up = !up;
  }
  const fmt = "111011111000100";
  for (let i = 0; i < 6; i++) setG(8, i, +fmt.charAt(i));
  setG(8, 7, +fmt.charAt(6)); setG(8, 8, +fmt.charAt(7)); setG(7, 8, +fmt.charAt(8));
  for (let i = 0; i < 6; i++) setG(5 - i, 8, +fmt.charAt(9 + i));
  for (let i = 0; i < 7; i++) setG(N - 1 - i, 8, +fmt.charAt(i));
  for (let i = 0; i < 8; i++) setG(8, N - 8 + i, +fmt.charAt(7 + i));

  let d = "";
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (getG(r, c)) d += `M${c},${r}h1v1h-1z`;
  return `<svg xmlns="http://w3.org" viewBox="-4 -4 37 37" width="130" height="130" style="background:#fff;border-radius:6px;display:block"><path d="${d}" fill="#000"/></svg>`;
}

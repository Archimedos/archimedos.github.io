let L = 'en';
const WALLET = "0x6Ac89E8Ff9f98313900B262D0B980b632209Fa09";
const CONTACTS_TEXT = {
  en: "CONTACTS & CUSTOMER SUPPORT\n\nFor technical inquiries, payment verification, or partnership questions, please contact us via:\n\n• Email: segizmund1@yahoo.com\n• Telegram Support: @Willy_8\n\nAverage response time: within 12–24 hours.",
  ru: "КОНТАКТЫ И ПОДДЕРЖКА\n\nПо техническим вопросам, проверке платежей или сотрудничеству свяжитесь с нами:\n\n• Электронная почта: segizmund1@yahoo.com\n• Telegram поддержка: @Willy_8\n\nСреднее время ответа: 12–24 часа."
};

function setL(lang, btn) {
  L = lang;
  const btns = document.getElementsByClassName('l-btn');
  for (let i = 0; i < btns.length; i++) btns.item(i).classList.remove('act');
  if (btn) btn.classList.add('act');

  const d = T[L];
  document.getElementById('t-logo').textContent = d.logo;
  document.getElementById('t-l1').textContent = d.l1;
  document.getElementById('t-l2').textContent = d.l2;
  document.getElementById('t-l3').textContent = d.l3;
  document.getElementById('t-l4').textContent = d.l4;
  document.getElementById('opt-w').textContent = d.optW;
  document.getElementById('opt-f').textContent = d.optF;
  document.getElementById('opt-fan').textContent = d.optFan;
  document.getElementById('opt-p').textContent = d.optP;
  document.getElementById('t-p1').textContent = d.p1;
  document.getElementById('t-p2').textContent = d.p2;
  document.getElementById('t-p3').textContent = d.p3;
  document.getElementById('t-p4').textContent = d.p4;
  document.getElementById('t-hint').textContent = d.hint;
  document.getElementById('t-cost').textContent = d.cost;
  document.getElementById('t-gen').textContent = d.gen;
  document.getElementById('t-ready').textContent = d.ready;
  document.getElementById('dl').textContent = d.dlBtn;
  document.getElementById('t-can-h').textContent = d.canH;
  document.getElementById('t-cant-h').textContent = d.cantH;
  document.getElementById('t-faq-h').textContent = d.faqH;
  document.getElementById('t-warn-h').textContent = d.warnH;
  document.getElementById('t-warn-p').textContent = d.warnP;
  document.getElementById('t-terms').textContent = d.terms;
  document.getElementById('t-priv').textContent = d.priv;
  document.getElementById('t-cont').textContent = L === 'ru' ? 'Контакты' : 'Contacts';
  document.getElementById('t-cook').textContent = d.cook;

  document.getElementById('t-can-list').innerHTML = d.can.map(x => '<li>' + x + '</li>').join('');
  document.getElementById('t-cant-list').innerHTML = d.cant.map(x => '<li>' + x + '</li>').join('');
  document.getElementById('faq-list').innerHTML = d.faq.map(x => '<div class="faq-item"><div class="faq-q">' + x.q + '</div><div>' + x.a + '</div></div>').join('');

  updD();
  calc();
}

function highlightPreset(val) {
  const pBtns = document.getElementsByClassName('pr-btn');
  for (let i = 0; i < pBtns.length; i++) {
    const bVal = parseInt(pBtns.item(i).getAttribute('data-val'));
    pBtns.item(i).classList.toggle('active-preset', bVal === val);
  }
}

function setC(num) { document.getElementById('cnt').value = num; calc(); }

function updD() {
  const s = document.getElementById('sch').value;
  document.getElementById('s-desc').textContent = T[L].sDesc[s];
  document.getElementById('s-cond').textContent = T[L].sCond[s];
}

function calc() {
  let c = parseInt(document.getElementById('cnt').value) || 5;
  highlightPreset(c);
  if (c === 3) { document.getElementById('prc').textContent = "$0.00 (FREE)"; return; }
  c = Math.min(200, Math.max(5, c));
  let usd = c > 10 ? 1.50 + (c - 10) * 0.05 : 1.50;
  document.getElementById('prc').textContent = "$" + usd.toFixed(2);
}

function prep() {
  let c = parseInt(document.getElementById('cnt').value) || 5;
  if (c !== 3 && c < 5) { c = 5; document.getElementById('cnt').value = 5; calc(); }
  document.getElementById('res').style.display = 'block';
  document.getElementById('out').style.display = 'none';
  const oldBox = document.getElementById('crypto-box');
  if (oldBox) oldBox.remove();

  if (c === 3) {
    document.getElementById('pay-note').textContent = T[L].freeNote;
    document.getElementById('pay-row').style.display = 'none';
    document.getElementById('dl').style.display = 'inline-block';
  } else {
    document.getElementById('pay-note').textContent = L === 'ru' ? 'Нажмите кнопку ниже для получения реквизитов оплаты:' : 'Click below to view payment details:';
    document.getElementById('pay-row').style.display = 'flex';
    document.getElementById('dl').style.display = 'none';
  }
}

function copyW() {
  navigator.clipboard.writeText(WALLET);
  alert(L === 'ru' ? 'Адрес кошелька скопирован!' : 'Wallet address copied!');
}

function pay() {
  const priceTxt = document.getElementById('prc').textContent;
  let cBox = document.getElementById('crypto-box');
  if (!cBox) {
    cBox = document.createElement('div');
    cBox.id = 'crypto-box';
    cBox.style.cssText = 'background:#161922;border:1px solid #d4af37;padding:15px;border-radius:8px;margin:15px 0;font-size:14px;display:flex;gap:15px;align-items:center;flex-wrap:wrap';
    document.getElementById('pay-row').after(cBox);
  }
  const title = L === 'ru' ? 'Переведите ' + priceTxt + ' в USDT (сеть Polygon / BEP20 / Arbitrum):' : 'Send ' + priceTxt + ' in USDT (Polygon / BEP20 / Arbitrum network):';
  const btnTxt = L === 'ru' ? '📋 Скопировать адрес' : '📋 Copy Address';
  const qrUrl = 'https://quickchart.io' + 'qr?size=140&text=' + WALLET;
  cBox.innerHTML = '<img src="' + qrUrl + '" alt="QR" style="border-radius:6px;border:3px solid #fff;width:130px;height:130px">' +
    '<div style="flex:1;min-width:200px"><div style="margin-bottom:8px;color:#d4af37;font-weight:bold">' + title + '</div>' +
    '<div style="word-break:break-all;font-family:monospace;background:#212533;padding:8px;border-radius:4px;margin-bottom:10px">' + WALLET + '</div>' +
    '<button class="p-btn" onclick="copyW()">' + btnTxt + '</button></div>';
  document.getElementById('dl').style.display = 'inline-block';
}

function gen() {
  const d = T[L];
  const f = document.getElementById('lot').value;
  const s = document.getElementById('sch').value;
  let c = parseInt(document.getElementById('cnt').value) || 12;
  if (c !== 3) c = Math.min(200, Math.max(5, c));

  let p = 5, m = 36, b = 0, bCount = 1;
  if (f === '5-69') { p = 5; m = 69; b = 26; }
  if (f === '5-70') { p = 5; m = 70; b = 24; }
  if (f === '5-50') { p = 5; m = 50; b = 12; bCount = 2; }
  if (f === '6-45') { p = 6; m = 45; }
  if (f === '6-43') { p = 6; m = 43; }
  if (f === '6-49') { p = 6; m = 49; }

  const rawFav = document.getElementById('fav').value.split(/[\s,]+/);
  let favs = new Array();
  for (let i = 0; i < rawFav.length; i++) {
    let num = parseInt(rawFav.at(i));
    if (num >= 1 && num <= m && !favs.includes(num) && favs.length < 3) favs.push(num);
  }

  let pool = new Array();
  for (let i = 0; i < favs.length; i++) pool.push(favs.at(i));
  let ps = s === 'wheeling' ? Math.min(m, p * 3) : m;
  while (pool.length < ps) {
    let r = Math.floor(Math.random() * m) + 1;
    if (!pool.includes(r)) pool.push(r);
  }

  let lines = new Array();
  lines.push(d.txtTitle + ' | ' + f + ' | ' + s.toUpperCase() + ' | ' + c);
  if (favs.length > 0) lines.push(d.txtFav + ': ' + favs.join(', '));
  lines.push('--------------------------------------------------');

  let anchor = pool.at(0);
  for (let i = 1; i <= c; i++) {
    let t = new Array();
    let attempts = 0;
    while (attempts < 30) {
      t = new Array();
      if (favs.length > 0) {
        for (let k = 0; k < favs.length; k++) t.push(favs.at(k));
      } else if (s === 'fan') {
        t.push(anchor);
      }
      while (t.length < p) {
        let x = pool.at(Math.floor(Math.random() * pool.length));
        if (!t.includes(x)) t.push(x);
      }
      if (s === 'parity') {
        let evens = t.filter(n => n % 2 === 0).length;
        if (Math.abs(evens - (p - evens)) <= 2) break;
      } else {
        break;
      }
      attempts++;
    }
    t.sort(function(a, b) { return a - b; });
    let str = d.txtTicket + ' #' + i + ':  ' + t.join(' - ');
    if (b > 0) {
      if (bCount === 1) str += '  + (' + ((i % b) || b) + ')';
      else {
        let b1 = (i % b) || b, b2 = ((i + 3) % b) || b;
        if (b1 === b2) b2 = (b1 % b) + 1;
        str += '  + (' + b1 + ', ' + b2 + ')';
      }
    }
    lines.push(str);
  }

  let txt = lines.join('\n');
  let o = document.getElementById('out');
  o.innerText = txt;
  o.style.display = 'block';

  let a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
  a.download = 'Archimedes_Set_' + f + '.txt';
  a.click();
}

function openM(type) {
  if (type === 'contacts') {
    document.getElementById('m-title').textContent = L === 'ru' ? 'Контакты' : 'Contacts';
    document.getElementById('m-body').textContent = L === 'ru' ? CONTACTS_TEXT.ru : CONTACTS_TEXT.en;
  } else {
    document.getElementById('m-title').textContent = type === 'terms' ? T[L].terms : T[L].priv;
    document.getElementById('m-body').textContent = type === 'terms' ? T[L].mTerms : T[L].mPriv;
  }
  document.getElementById('modal').style.display = 'flex';
}
function closeM() { document.getElementById('modal').style.display = 'none'; }
function hideC() { document.getElementById('cookie').style.display = 'none'; }

setL('en', document.querySelector('.l-btn'));

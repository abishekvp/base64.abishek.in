/**
 * Base64 Pro Studio — Comprehensive Client Application
 * Handles Text, Files, Hex, Data URIs, and Checksums
 */

// ================= THEME & SUITE SWITCHER =================
const themeToggle = document.getElementById('themeToggle');
const fullscreenToggle = document.getElementById('fullscreenToggle');
const switcherBtn = document.getElementById('switcherBtn');
const switcherMenu = document.getElementById('switcherMenu');

// Initialize Theme
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
}

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-theme');
  if (isDark) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
});

// Fullscreen API
fullscreenToggle?.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    document.body.classList.add('fullscreen-mode');
  } else {
    document.exitFullscreen().catch(() => {});
    document.body.classList.remove('fullscreen-mode');
  }
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    document.body.classList.remove('fullscreen-mode');
  }
});

// App Switcher Dropdown
switcherBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  switcherMenu?.classList.toggle('show');
});

document.addEventListener('click', () => {
  switcherMenu?.classList.remove('show');
});

// ================= TAB NAVIGATION =================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabBtns.forEach((b) => b.classList.remove('active'));
    tabPanes.forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.tab;
    const pane = document.getElementById(`pane-${target}`);
    if (pane) pane.classList.add('active');
  });
});

// ================= HELPER UTILITIES =================
function bytesToSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Lightweight MD5 Implementation
function md5(string) {
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17,  606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12,  1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7,  1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7,  1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22,  1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14,  643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9,  38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5,  568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20,  1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14,  1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16,  1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11,  1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4,  681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23,  76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16,  530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10,  1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6,  1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6,  1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21,  1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15,  718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function add32(a, b) { return (a + b) & 0xFFFFFFFF; }

  const n = string.length;
  let state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(string.substring(i - 64, i)));
  }
  string = string.substring(i - 64);
  const tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  let j;
  for (j = 0; j < string.length; j++) tail[j >> 2] |= string.charCodeAt(j) << ((j % 4) << 3);
  tail[j >> 2] |= 0x80 << ((j % 4) << 3);
  if (j > 55) {
    md5cycle(state, tail);
    for (j = 0; j < 16; j++) tail[j] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  let res = '';
  for (let k = 0; k < 4; k++) {
    for (let m = 0; m < 4; m++) {
      const byte = (state[k] >>> (m * 8)) & 0xff;
      res += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return res;
}
function md5blk(s) {
  const md5blks = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

// SHA-256 via Web Crypto
async function sha256(text) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return 'Unavailable';
  }
}

// ================= TAB 1: TEXT PROCESSING =================
const textOpButtons = document.querySelectorAll('#textOpToggle .pill');
const charsetSelect = document.getElementById('charsetSelect');
const variantSelect = document.getElementById('variantSelect');
const paddingSelect = document.getElementById('paddingSelect');
const lineBreakSelect = document.getElementById('lineBreakSelect');
const liveModeCheckbox = document.getElementById('liveMode');
const btnRunText = document.getElementById('btnRunText');
const textInput = document.getElementById('textInput');
const textOutput = document.getElementById('textOutput');
const textError = document.getElementById('textError');
const inputStats = document.getElementById('inputStats');
const outputStats = document.getElementById('outputStats');
const ratioBadge = document.getElementById('ratioBadge');
const textInputTitle = document.getElementById('textInputTitle');
const textOutputTitle = document.getElementById('textOutputTitle');
const btnSwapText = document.getElementById('btnSwapText');
const btnCopyOutput = document.getElementById('btnCopyOutput');
const copyLabel = document.getElementById('copyLabel');
const btnDownloadOutput = document.getElementById('btnDownloadOutput');
const btnClearText = document.getElementById('btnClearText');
const btnSampleText = document.getElementById('btnSampleText');
const btnPasteText = document.getElementById('btnPasteText');
const csMD5 = document.getElementById('csMD5');
const csSHA256 = document.getElementById('csSHA256');

let currentOp = 'encode'; // 'encode' | 'decode'

textOpButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    textOpButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentOp = btn.dataset.op;
    if (currentOp === 'encode') {
      textInputTitle.textContent = 'Plain Text Input';
      textOutputTitle.textContent = 'Base64 Output';
    } else {
      textInputTitle.textContent = 'Base64 Input';
      textOutputTitle.textContent = 'Decoded Text Output';
    }
    processText();
  });
});

function bytesToBase64(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function wrapLines(str, lineLen) {
  if (!lineLen || lineLen <= 0) return str;
  const regex = new RegExp(`.{1,${lineLen}}`, 'g');
  const chunks = str.match(regex);
  return chunks ? chunks.join('\n') : str;
}

async function processText() {
  const rawInput = textInput.value;
  textError.classList.remove('show');
  textError.textContent = '';

  const inputBytesCount = new TextEncoder().encode(rawInput).length;
  inputStats.textContent = `${rawInput.length.toLocaleString()} chars · ${bytesToSize(inputBytesCount)}`;

  if (!rawInput) {
    textOutput.value = '';
    outputStats.textContent = '0 chars · 0 B';
    ratioBadge.textContent = '0%';
    csMD5.textContent = '—';
    csSHA256.textContent = '—';
    return;
  }

  const charset = charsetSelect.value;
  const variant = variantSelect.value;
  const padding = paddingSelect.value;
  const lineWrap = parseInt(lineBreakSelect.value, 10);

  try {
    let result = '';

    if (currentOp === 'encode') {
      let bytes;
      if (charset === 'utf-8') {
        bytes = new TextEncoder().encode(rawInput);
      } else if (charset === 'ascii') {
        bytes = new Uint8Array(rawInput.length);
        for (let i = 0; i < rawInput.length; i++) {
          bytes[i] = rawInput.charCodeAt(i) & 0x7f;
        }
      } else {
        // latin-1
        bytes = new Uint8Array(rawInput.length);
        for (let i = 0; i < rawInput.length; i++) {
          bytes[i] = rawInput.charCodeAt(i) & 0xff;
        }
      }

      result = bytesToBase64(bytes);

      if (variant === 'urlsafe') {
        result = result.replace(/\+/g, '-').replace(/\//g, '_');
      }

      if (padding === 'nopad') {
        result = result.replace(/=+$/, '');
      }

      if (lineWrap > 0) {
        result = wrapLines(result, lineWrap);
      }
    } else {
      // Decode
      let sanitized = rawInput.trim();
      // remove whitespace or line breaks
      sanitized = sanitized.replace(/\s+/g, '');

      // Normalize URL-safe back to standard
      sanitized = sanitized.replace(/-/g, '+').replace(/_/g, '/');

      // Add missing padding
      while (sanitized.length % 4 !== 0) {
        sanitized += '=';
      }

      const bytes = base64ToBytes(sanitized);

      if (charset === 'utf-8') {
        result = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      } else if (charset === 'ascii') {
        result = Array.from(bytes).map(b => String.fromCharCode(b & 0x7f)).join('');
      } else {
        result = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
      }
    }

    textOutput.value = result;

    const outBytesCount = new TextEncoder().encode(result).length;
    outputStats.textContent = `${result.length.toLocaleString()} chars · ${bytesToSize(outBytesCount)}`;

    if (inputBytesCount > 0) {
      const diff = ((outBytesCount - inputBytesCount) / inputBytesCount) * 100;
      ratioBadge.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    }

    // Update Hashes
    csMD5.textContent = md5(result);
    sha256(result).then(h => csSHA256.textContent = h);

  } catch (err) {
    textError.textContent = `Processing Error: ${err.message || 'Invalid characters or malformed Base64 string'}`;
    textError.classList.add('show');
    textOutput.value = '';
    outputStats.textContent = 'Error';
    ratioBadge.textContent = '—';
  }
}

// Event Listeners for Text Tab
[charsetSelect, variantSelect, paddingSelect, lineBreakSelect].forEach((el) => {
  el?.addEventListener('change', () => processText());
});

textInput?.addEventListener('input', () => {
  if (liveModeCheckbox.checked) processText();
});

btnRunText?.addEventListener('click', processText);

btnSwapText?.addEventListener('click', () => {
  const currentOutput = textOutput.value;
  if (!currentOutput) return;

  // Toggle op
  currentOp = currentOp === 'encode' ? 'decode' : 'encode';
  textOpButtons.forEach((b) => b.classList.toggle('active', b.dataset.op === currentOp));

  if (currentOp === 'encode') {
    textInputTitle.textContent = 'Plain Text Input';
    textOutputTitle.textContent = 'Base64 Output';
  } else {
    textInputTitle.textContent = 'Base64 Input';
    textOutputTitle.textContent = 'Decoded Text Output';
  }

  textInput.value = currentOutput;
  processText();
});

btnClearText?.addEventListener('click', () => {
  textInput.value = '';
  processText();
});

btnSampleText?.addEventListener('click', () => {
  if (currentOp === 'encode') {
    textInput.value = `Welcome to Base64 Studio by abishek.in!\nEncode any unicode text (e.g. 🚀, 💻, ⚡) with full support for RFC 4648, URL-Safe variants, and custom line lengths.`;
  } else {
    textInput.value = `V2VsY29tZSB0byBCYXNlNjQgU3R1ZGlvIGJ5IGFiaXNoZWsuaW4hCkVuY29kZSBhbnkgdW5pY29kZSB0ZXh0IChlLmcuIPCfmYAsIPCfkLssIOKaoikgd2l0aCBmdWxsIHN1cHBvcnQgZm9yIFJGQyA0NjQ4LCBVUkwtU2FmZSB2YXJpYW50cywgYW5kIGN1c3RvbSBsaW5lIGxlbmd0aHMu`;
  }
  processText();
});

btnPasteText?.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    textInput.value = text;
    processText();
  } catch (err) {
    alert('Please allow clipboard permissions or press Ctrl+V to paste.');
  }
});

btnCopyOutput?.addEventListener('click', async () => {
  if (!textOutput.value) return;
  try {
    await navigator.clipboard.writeText(textOutput.value);
    copyLabel.textContent = 'Copied!';
    setTimeout(() => copyLabel.textContent = 'Copy', 2000);
  } catch (e) {
    textOutput.select();
    document.execCommand('copy');
  }
});

btnDownloadOutput?.addEventListener('click', () => {
  const content = textOutput.value;
  if (!content) return;
  const filename = currentOp === 'encode' ? 'encoded-base64.txt' : 'decoded-output.txt';
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
});

// Copy Checksums
document.querySelectorAll('.cs-copy').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const el = document.getElementById(targetId);
    if (el && el.textContent !== '—') {
      navigator.clipboard.writeText(el.textContent);
      const prev = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => btn.textContent = prev, 1500);
    }
  });
});

// ================= TAB 2: FILE TO BASE64 =================
const fileDropZone = document.getElementById('fileDropZone');
const fileInput = document.getElementById('fileInput');
const fileDetailsCard = document.getElementById('fileDetailsCard');
const fileThumbBox = document.getElementById('fileThumbBox');
const fileNameEl = document.getElementById('fileName');
const fileSizeEl = document.getElementById('fileSize');
const fileMimeEl = document.getElementById('fileMime');
const btnRemoveFile = document.getElementById('btnRemoveFile');
const fileOutputText = document.getElementById('fileOutputText');
const fileStatsText = document.getElementById('fileStatsText');
const btnCopyFileOutput = document.getElementById('btnCopyFileOutput');
const btnDownloadB64Txt = document.getElementById('btnDownloadB64Txt');
const fileSubtabBtns = document.querySelectorAll('.subtab-btn');

let currentFileData = {
  name: '',
  mime: '',
  size: 0,
  rawB64: '',
  dataUri: ''
};
let currentSubtab = 'datauri';

fileSubtabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    fileSubtabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSubtab = btn.dataset.subtab;
    renderFileOutput();
  });
});

function handleSelectedFile(file) {
  if (!file) return;

  currentFileData.name = file.name;
  currentFileData.mime = file.type || 'application/octet-stream';
  currentFileData.size = file.size;

  fileNameEl.textContent = file.name;
  fileSizeEl.textContent = bytesToSize(file.size);
  fileMimeEl.textContent = currentFileData.mime;

  // Render thumbnail
  fileThumbBox.innerHTML = '';
  if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    fileThumbBox.appendChild(img);
  } else if (file.type.startsWith('audio/')) {
    fileThumbBox.innerHTML = '<span style="font-size:24px">🎵</span>';
  } else if (file.type.includes('pdf')) {
    fileThumbBox.innerHTML = '<span style="font-size:24px">📄</span>';
  } else {
    fileThumbBox.innerHTML = '<span style="font-size:24px">📁</span>';
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUri = e.target.result;
    currentFileData.dataUri = dataUri;
    const b64Parts = dataUri.split(',');
    currentFileData.rawB64 = b64Parts[1] || '';

    fileDropZone.querySelector('.drop-content').style.display = 'none';
    fileDetailsCard.style.display = 'flex';

    renderFileOutput();
  };
  reader.readAsDataURL(file);
}

function renderFileOutput() {
  if (!currentFileData.rawB64) {
    fileOutputText.value = '';
    fileStatsText.textContent = 'Awaiting file...';
    return;
  }

  let text = '';
  if (currentSubtab === 'datauri') {
    text = currentFileData.dataUri;
  } else if (currentSubtab === 'rawb64') {
    text = currentFileData.rawB64;
  } else if (currentSubtab === 'html') {
    if (currentFileData.mime.startsWith('image/')) {
      text = `<img src="${currentFileData.dataUri}" alt="${currentFileData.name}" />`;
    } else if (currentFileData.mime.startsWith('audio/')) {
      text = `<audio controls src="${currentFileData.dataUri}"></audio>`;
    } else if (currentFileData.mime.startsWith('video/')) {
      text = `<video controls src="${currentFileData.dataUri}"></video>`;
    } else {
      text = `<a href="${currentFileData.dataUri}" download="${currentFileData.name}">Download ${currentFileData.name}</a>`;
    }
  } else if (currentSubtab === 'css') {
    text = `background-image: url("${currentFileData.dataUri}");`;
  }

  fileOutputText.value = text;
  const b64Bytes = text.length;
  fileStatsText.textContent = `Raw File: ${bytesToSize(currentFileData.size)} ➜ Base64: ${bytesToSize(b64Bytes)} (${text.length.toLocaleString()} characters)`;
}

fileInput?.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    handleSelectedFile(e.target.files[0]);
  }
});

fileDropZone?.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileDropZone.classList.add('dragover');
});

fileDropZone?.addEventListener('dragleave', () => {
  fileDropZone.classList.remove('dragover');
});

fileDropZone?.addEventListener('drop', (e) => {
  e.preventDefault();
  fileDropZone.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleSelectedFile(e.dataTransfer.files[0]);
  }
});

btnRemoveFile?.addEventListener('click', (e) => {
  e.stopPropagation();
  currentFileData = { name: '', mime: '', size: 0, rawB64: '', dataUri: '' };
  fileInput.value = '';
  fileDetailsCard.style.display = 'none';
  fileDropZone.querySelector('.drop-content').style.display = 'block';
  renderFileOutput();
});

btnCopyFileOutput?.addEventListener('click', async () => {
  if (!fileOutputText.value) return;
  await navigator.clipboard.writeText(fileOutputText.value);
  alert('Copied to clipboard!');
});

btnDownloadB64Txt?.addEventListener('click', () => {
  if (!fileOutputText.value) return;
  const blob = new Blob([fileOutputText.value], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${currentFileData.name || 'file'}-base64.txt`;
  a.click();
});

// ================= TAB 3: BASE64 TO FILE (PREVIEW & DECODER) =================
const b64FileInput = document.getElementById('b64FileInput');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const btnDownloadDecodedFile = document.getElementById('btnDownloadDecodedFile');
const btnClearB64File = document.getElementById('btnClearB64File');
const btnSampleB64File = document.getElementById('btnSampleB64File');

let decodedBlob = null;
let detectedExtension = 'bin';
let detectedMime = 'application/octet-stream';

function detectMimeFromBytes(bytes) {
  if (bytes.length < 4) return { mime: 'application/octet-stream', ext: 'bin' };

  // PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return { mime: 'image/png', ext: 'png' };
  }
  // JPEG
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return { mime: 'image/jpeg', ext: 'jpg' };
  }
  // GIF
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return { mime: 'image/gif', ext: 'gif' };
  }
  // WEBP
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    return { mime: 'image/webp', ext: 'webp' };
  }
  // PDF
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return { mime: 'application/pdf', ext: 'pdf' };
  }
  // ZIP
  if (bytes[0] === 0x50 && bytes[1] === 0x4B && (bytes[2] === 0x03 || bytes[2] === 0x05)) {
    return { mime: 'application/zip', ext: 'zip' };
  }
  // MP3
  if ((bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) || (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0)) {
    return { mime: 'audio/mpeg', ext: 'mp3' };
  }

  // Check SVG string
  try {
    const textSample = new TextDecoder('utf-8').decode(bytes.slice(0, 100));
    if (textSample.includes('<svg') || textSample.includes('<?xml')) {
      return { mime: 'image/svg+xml', ext: 'svg' };
    }
  } catch (e) {}

  return { mime: 'application/octet-stream', ext: 'bin' };
}

function processB64ToFile() {
  const input = b64FileInput.value.trim();
  if (!input) {
    filePreviewContainer.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p>Paste a Base64 string on the left to auto-detect file type and preview</p>
      </div>`;
    btnDownloadDecodedFile.disabled = true;
    decodedBlob = null;
    return;
  }

  try {
    let base64Data = input;
    let explicitMime = null;

    if (input.startsWith('data:')) {
      const match = input.match(/^data:([^;]+);base64,(.*)$/s);
      if (match) {
        explicitMime = match[1];
        base64Data = match[2];
      }
    }

    base64Data = base64Data.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    while (base64Data.length % 4 !== 0) base64Data += '=';

    const bytes = base64ToBytes(base64Data);
    const detected = detectMimeFromBytes(bytes);
    detectedMime = explicitMime || detected.mime;
    detectedExtension = detected.ext;

    decodedBlob = new Blob([bytes], { type: detectedMime });
    const blobUrl = URL.createObjectURL(decodedBlob);

    filePreviewContainer.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'preview-rendered-box';

    if (detectedMime.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = blobUrl;
      box.appendChild(img);
    } else if (detectedMime.startsWith('audio/')) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = blobUrl;
      box.appendChild(audio);
    } else {
      const fileInfo = document.createElement('div');
      fileInfo.innerHTML = `
        <div style="font-size:48px; text-align:center;">📄</div>
        <p style="margin-top:8px; font-weight:600;">Detected Binary Document</p>
      `;
      box.appendChild(fileInfo);
    }

    const pill = document.createElement('div');
    pill.className = 'preview-meta-pill';
    pill.textContent = `Type: ${detectedMime} · Size: ${bytesToSize(bytes.byteLength)} · Extension: .${detectedExtension}`;
    box.appendChild(pill);

    filePreviewContainer.appendChild(box);
    btnDownloadDecodedFile.disabled = false;

  } catch (err) {
    filePreviewContainer.innerHTML = `
      <div class="empty-state" style="color:var(--danger)">
        <p>Invalid Base64 payload: ${err.message}</p>
      </div>`;
    btnDownloadDecodedFile.disabled = true;
    decodedBlob = null;
  }
}

b64FileInput?.addEventListener('input', processB64ToFile);

btnSampleB64File?.addEventListener('click', () => {
  // 1x1 blue PNG sample or tiny rocket SVG
  b64FileInput.value = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiMzYjgyZjYiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiPuKaojwvdGV4dD48L3N2Zz4=`;
  processB64ToFile();
});

btnClearB64File?.addEventListener('click', () => {
  b64FileInput.value = '';
  processB64ToFile();
});

btnDownloadDecodedFile?.addEventListener('click', () => {
  if (!decodedBlob) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(decodedBlob);
  a.download = `decoded-file.${detectedExtension}`;
  a.click();
});

// ================= TAB 4: HEX <-> BASE64 =================
const hexDirToggle = document.querySelectorAll('#hexDirToggle .pill');
const hexDelimiter = document.getElementById('hexDelimiter');
const hexUppercase = document.getElementById('hexUppercase');
const hexInput = document.getElementById('hexInput');
const hexOutput = document.getElementById('hexOutput');
const hexInputTitle = document.getElementById('hexInputTitle');
const hexOutputTitle = document.getElementById('hexOutputTitle');
const btnHexSwap = document.getElementById('btnHexSwap');
const btnHexSample = document.getElementById('btnHexSample');
const btnHexClear = document.getElementById('btnHexClear');
const btnHexCopy = document.getElementById('btnHexCopy');

let hexDirection = 'hex-to-b64';

hexDirToggle.forEach((btn) => {
  btn.addEventListener('click', () => {
    hexDirToggle.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    hexDirection = btn.dataset.dir;
    if (hexDirection === 'hex-to-b64') {
      hexInputTitle.textContent = 'Hexadecimal Input';
      hexOutputTitle.textContent = 'Base64 Output';
    } else {
      hexInputTitle.textContent = 'Base64 Input';
      hexOutputTitle.textContent = 'Hexadecimal Output';
    }
    processHex();
  });
});

function processHex() {
  const input = hexInput.value.trim();
  if (!input) {
    hexOutput.value = '';
    return;
  }

  try {
    if (hexDirection === 'hex-to-b64') {
      // Clean hex
      const cleanHex = input.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '');
      if (cleanHex.length % 2 !== 0) {
        hexOutput.value = 'Error: Incomplete hex byte sequence (must be pairs of hex digits)';
        return;
      }
      const bytes = new Uint8Array(cleanHex.length / 2);
      for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
      }
      hexOutput.value = bytesToBase64(bytes);
    } else {
      // Base64 to Hex
      const bytes = base64ToBytes(input.replace(/\s+/g, ''));
      const delim = hexDelimiter.value;
      const isUpper = hexUppercase.checked;

      const hexArr = Array.from(bytes).map(b => {
        let hex = b.toString(16).padStart(2, '0');
        return isUpper ? hex.toUpperCase() : hex.toLowerCase();
      });

      if (delim === 'none') {
        hexOutput.value = hexArr.join('');
      } else if (delim === 'space') {
        hexOutput.value = hexArr.join(' ');
      } else if (delim === 'colon') {
        hexOutput.value = hexArr.join(':');
      } else if (delim === 'prefix') {
        hexOutput.value = hexArr.map(h => '0x' + h).join(', ');
      }
    }
  } catch (err) {
    hexOutput.value = `Error: ${err.message}`;
  }
}

hexInput?.addEventListener('input', processHex);
hexDelimiter?.addEventListener('change', processHex);
hexUppercase?.addEventListener('change', processHex);

btnHexSample?.addEventListener('click', () => {
  if (hexDirection === 'hex-to-b64') {
    hexInput.value = '48 65 6c 6c 6f 20 57 6f 72 6c 64 21';
  } else {
    hexInput.value = 'SGVsbG8gV29ybGQh';
  }
  processHex();
});

btnHexClear?.addEventListener('click', () => {
  hexInput.value = '';
  hexOutput.value = '';
});

btnHexCopy?.addEventListener('click', () => {
  if (!hexOutput.value) return;
  navigator.clipboard.writeText(hexOutput.value);
  alert('Copied output!');
});

btnHexSwap?.addEventListener('click', () => {
  const out = hexOutput.value;
  if (!out || out.startsWith('Error')) return;
  hexDirection = hexDirection === 'hex-to-b64' ? 'b64-to-hex' : 'hex-to-b64';
  hexDirToggle.forEach(b => b.classList.toggle('active', b.dataset.dir === hexDirection));
  hexInputTitle.textContent = hexDirection === 'hex-to-b64' ? 'Hexadecimal Input' : 'Base64 Input';
  hexOutputTitle.textContent = hexDirection === 'hex-to-b64' ? 'Base64 Output' : 'Hexadecimal Output';
  hexInput.value = out;
  processHex();
});

// ================= TAB 5: DATA URI INSPECTOR =================
const uriInput = document.getElementById('uriInput');
const uriMime = document.getElementById('uriMime');
const uriEncoding = document.getElementById('uriEncoding');
const uriCharset = document.getElementById('uriCharset');
const uriPayloadSize = document.getElementById('uriPayloadSize');
const uriPreviewArea = document.getElementById('uriPreviewArea');
const btnCopyUriPayload = document.getElementById('btnCopyUriPayload');
const btnDownloadUriFile = document.getElementById('btnDownloadUriFile');
const btnUriSample = document.getElementById('btnUriSample');
const btnUriClear = document.getElementById('btnUriClear');

function parseDataUri() {
  const val = uriInput.value.trim();
  if (!val || !val.startsWith('data:')) {
    uriMime.textContent = '—';
    uriEncoding.textContent = '—';
    uriCharset.textContent = '—';
    uriPayloadSize.textContent = '—';
    uriPreviewArea.innerHTML = '<span class="placeholder-text">Enter a valid data: URI above</span>';
    return;
  }

  const match = val.match(/^data:([^;,]+)?(;charset=[^;,]+)?(;base64)?,(.*)$/s);
  if (!match) {
    uriPreviewArea.innerHTML = '<span style="color:var(--danger)">Malformed Data URI</span>';
    return;
  }

  const mime = match[1] || 'text/plain';
  const charset = match[2] ? match[2].replace(';charset=', '') : 'US-ASCII';
  const isBase64 = !!match[3];
  const payload = match[4] || '';

  uriMime.textContent = mime;
  uriEncoding.textContent = isBase64 ? 'Base64' : 'Plain text / URL-encoded';
  uriCharset.textContent = charset;
  uriPayloadSize.textContent = bytesToSize(payload.length);

  uriPreviewArea.innerHTML = '';
  if (mime.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = val;
    uriPreviewArea.appendChild(img);
  } else if (mime.startsWith('audio/')) {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = val;
    uriPreviewArea.appendChild(audio);
  } else {
    const pre = document.createElement('pre');
    pre.style.fontSize = '12px';
    pre.style.maxHeight = '140px';
    pre.style.overflow = 'auto';
    pre.textContent = isBase64 ? atob(payload.substring(0, 500)) : decodeURIComponent(payload);
    uriPreviewArea.appendChild(pre);
  }
}

uriInput?.addEventListener('input', parseDataUri);

btnUriSample?.addEventListener('click', () => {
  uriInput.value = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="%233b82f6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
  parseDataUri();
});

btnUriClear?.addEventListener('click', () => {
  uriInput.value = '';
  parseDataUri();
});

btnCopyUriPayload?.addEventListener('click', () => {
  const match = uriInput.value.trim().match(/^data:[^,]*,?(.*)$/s);
  if (match && match[1]) {
    navigator.clipboard.writeText(match[1]);
    alert('Copied payload!');
  }
});

btnDownloadUriFile?.addEventListener('click', () => {
  const val = uriInput.value.trim();
  if (!val.startsWith('data:')) return;
  const a = document.createElement('a');
  a.href = val;
  a.download = `data-uri-file`;
  a.click();
});

// Run initial text calculation
processText();

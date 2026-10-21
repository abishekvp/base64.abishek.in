'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  bytesToSize,
  bytesToBase64,
  base64ToBytes,
  wrapLines,
  md5,
  computeSha256
} from '@/lib/base64';
import {
  ArrowLeftRight,
  Copy,
  Check,
  Download,
  Trash2,
  FileText,
  ClipboardPaste,
  Sparkles,
  AlertCircle,
  Hash,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { TextCharset, TextVariant, TextPadding, TextLineBreak } from '@/types';

export const TextStudio: React.FC = () => {
  const [op, setOp] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('Hello, World! 🚀 Antigravity Base64 Studio');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [live, setLive] = useState<boolean>(true);

  // Settings
  const [charset, setCharset] = useState<TextCharset>('utf-8');
  const [variant, setVariant] = useState<TextVariant>('standard');
  const [padding, setPadding] = useState<TextPadding>('pad');
  const [lineBreak, setLineBreak] = useState<TextLineBreak>('none');

  // Checksums
  const [md5Hash, setMd5Hash] = useState<string>('—');
  const [sha256Hash, setSha256Hash] = useState<string>('—');

  const executeConversion = useCallback(async () => {
    setError('');
    if (!input) {
      setOutput('');
      setMd5Hash('—');
      setSha256Hash('—');
      return;
    }

    try {
      if (op === 'encode') {
        let bytes: Uint8Array;
        if (charset === 'utf-8') {
          bytes = new TextEncoder().encode(input);
        } else if (charset === 'ascii') {
          bytes = new Uint8Array(input.length);
          for (let i = 0; i < input.length; i++) {
            bytes[i] = input.charCodeAt(i) & 0x7f;
          }
        } else {
          // latin-1
          bytes = new Uint8Array(input.length);
          for (let i = 0; i < input.length; i++) {
            bytes[i] = input.charCodeAt(i) & 0xff;
          }
        }

        let b64 = bytesToBase64(bytes);

        // Variant: urlsafe
        if (variant === 'urlsafe') {
          b64 = b64.replace(/\+/g, '-').replace(/\//g, '_');
        }

        // Padding
        if (padding === 'nopad') {
          b64 = b64.replace(/=+$/, '');
        }

        // Line break
        if (lineBreak === '64') {
          b64 = wrapLines(b64, 64);
        } else if (lineBreak === '76') {
          b64 = wrapLines(b64, 76);
        }

        setOutput(b64);
        setMd5Hash(md5(b64));
        computeSha256(b64).then(setSha256Hash);
      } else {
        // Decode
        let sanitized = input.replace(/\s+/g, '');
        // normalize URL-safe chars
        sanitized = sanitized.replace(/-/g, '+').replace(/_/g, '/');
        // add padding if missing
        while (sanitized.length % 4 !== 0) {
          sanitized += '=';
        }

        const bytes = base64ToBytes(sanitized);
        let decodedStr = '';
        if (charset === 'utf-8') {
          decodedStr = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        } else if (charset === 'ascii') {
          for (let i = 0; i < bytes.length; i++) {
            decodedStr += String.fromCharCode(bytes[i] & 0x7f);
          }
        } else {
          // latin1
          for (let i = 0; i < bytes.length; i++) {
            decodedStr += String.fromCharCode(bytes[i]);
          }
        }

        setOutput(decodedStr);
        setMd5Hash(md5(decodedStr));
        computeSha256(decodedStr).then(setSha256Hash);
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid Base64 sequence or character decoding error');
      setOutput('');
      setMd5Hash('—');
      setSha256Hash('—');
    }
  }, [input, op, charset, variant, padding, lineBreak]);

  useEffect(() => {
    if (live) {
      executeConversion();
    }
  }, [executeConversion, live]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setOp(op === 'encode' ? 'decode' : 'encode');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSample = () => {
    if (op === 'encode') {
      setInput('JWT Payload: {"sub": "1234567890", "name": "Abishek", "admin": true, "iat": 1516239022}');
    } else {
      setInput('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnpkV0lpT2lJeE1qTTBOVFlM09UQXNJbTVoYldVaU9pSkJZbWx6YUdWcklpd2lZV1J0YVc0aU9uc2laWEh3YVhKbGN5STZNVFV4TmpJek9UQXlJbjA=');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (e) {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = op === 'encode' ? 'encoded-base64.txt' : 'decoded-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inByteLen = new TextEncoder().encode(input).length;
  const outByteLen = new TextEncoder().encode(output).length;
  const ratio = inByteLen > 0 ? ((outByteLen / inByteLen) * 100).toFixed(0) : '0';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-darker">
      {/* Control Ribbon */}
      <div className="bg-surface-card border-b border-surface-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Op Switcher */}
          <div className="inline-flex rounded-lg bg-surface-subtle p-0.5 border border-surface-border">
            <button
              onClick={() => setOp('encode')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                op === 'encode' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Encode (Text → Base64)
            </button>
            <button
              onClick={() => setOp('decode')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                op === 'decode' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Decode (Base64 → Text)
            </button>
          </div>

          <div className="h-4 w-px bg-surface-border hidden md:block" />

          {/* Options */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium hidden sm:inline">Charset:</span>
            <select
              value={charset}
              onChange={(e) => setCharset(e.target.value as TextCharset)}
              className="bg-surface-subtle border border-surface-border rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="utf-8">UTF-8 (Standard)</option>
              <option value="ascii">ASCII (7-bit)</option>
              <option value="latin1">ISO-8859-1 (Latin-1)</option>
            </select>
          </div>

          {op === 'encode' && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium hidden sm:inline">Variant:</span>
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value as TextVariant)}
                  className="bg-surface-subtle border border-surface-border rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="standard">Standard (+ /)</option>
                  <option value="urlsafe">URL-Safe (- _)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium hidden sm:inline">Padding:</span>
                <select
                  value={padding}
                  onChange={(e) => setPadding(e.target.value as TextPadding)}
                  className="bg-surface-subtle border border-surface-border rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="pad">Pad with =</option>
                  <option value="nopad">No padding</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium hidden lg:inline">Line Break:</span>
                <select
                  value={lineBreak}
                  onChange={(e) => setLineBreak(e.target.value as TextLineBreak)}
                  className="bg-surface-subtle border border-surface-border rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="none">No Breaks</option>
                  <option value="64">64 chars (PEM)</option>
                  <option value="76">76 chars (MIME)</option>
                </select>
              </div>
            </>
          )}

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 ml-1">
            <input
              type="checkbox"
              checked={live}
              onChange={(e) => setLive(e.target.checked)}
              className="rounded bg-surface-subtle border-surface-border text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span>Live Auto-run</span>
          </label>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          {!live && (
            <button
              onClick={executeConversion}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convert</span>
            </button>
          )}

          <button
            onClick={handleSample}
            className="px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white transition-colors"
          >
            Sample
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-red-500/10 border border-surface-border hover:border-red-500/30 text-slate-300 hover:text-red-400 transition-colors"
            title="Clear all text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">Error: {error}</span>
        </div>
      )}

      {/* Dual Fullscreen Editor Pane */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-border min-h-0">
        {/* Input Column */}
        <div className="flex flex-col h-full bg-surface-card min-h-0">
          <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>{op === 'encode' ? 'Plain Text Input' : 'Base64 Input'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                {input.length.toLocaleString()} chars · {bytesToSize(inByteLen)}
              </span>
              <button
                onClick={handlePaste}
                className="p-1 hover:text-white rounded hover:bg-surface-hover"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative min-h-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={op === 'encode' ? 'Type or paste plain text here...' : 'Paste Base64 string here to decode...'}
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none selection:bg-blue-600/30"
            />
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col h-full bg-surface-card min-h-0">
          <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>{op === 'encode' ? 'Base64 Output' : 'Decoded Text Output'}</span>
              {inByteLen > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {ratio}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-2">
                {output.length.toLocaleString()} chars · {bytesToSize(outByteLen)}
              </span>

              <button
                onClick={handleSwap}
                disabled={!output}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none"
                title="Swap input & output"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1 px-2 py-0.5 text-xs text-slate-300 hover:text-white rounded hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none font-medium"
                title="Copy output to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={!output}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none"
                title="Download as file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative min-h-0">
            <textarea
              readOnly
              value={output}
              placeholder="Result will appear here..."
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none selection:bg-blue-600/30"
            />
          </div>
        </div>
      </div>

      {/* Checksum & Security Bar */}
      <div className="h-10 bg-surface-card border-t border-surface-border px-4 flex items-center justify-between text-xs text-slate-400 select-none flex-shrink-0">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Hash className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-sans font-semibold">MD5:</span>
            <span className="text-slate-200 select-all">{md5Hash}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-sans font-semibold">SHA-256:</span>
            <span className="text-slate-200 select-all">{sha256Hash}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium hidden md:block">
          100% Client-side · Zero Server Uploads · RFC 4648 Compliant
        </div>
      </div>
    </div>
  );
};

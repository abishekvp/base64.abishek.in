'use client';

import React, { useState, useEffect } from 'react';
import {
  bytesToBase64,
  base64ToBytes
} from '@/lib/base64';
import {
  Hexagon,
  ArrowLeftRight,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const HexStudio: React.FC = () => {
  const [direction, setDirection] = useState<'hex2b64' | 'b642hex'>('hex2b64');
  const [input, setInput] = useState<string>('48 65 6c 6c 6f 20 57 6f 72 6c 64 21');
  const [output, setOutput] = useState<string>('');
  const [delimiter, setDelimiter] = useState<'none' | 'space' | 'colon' | 'comma'>('space');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (direction === 'hex2b64') {
        const cleanHex = input.replace(/[^0-9a-fA-F]/g, '');
        if (cleanHex.length % 2 !== 0) {
          setError('Hex string must contain an even number of characters');
          return;
        }
        const bytes = new Uint8Array(cleanHex.length / 2);
        for (let i = 0; i < cleanHex.length; i += 2) {
          bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
        }
        setOutput(bytesToBase64(bytes));
      } else {
        // Base64 to Hex
        let cleanB64 = input.replace(/\s+/g, '');
        while (cleanB64.length % 4 !== 0) cleanB64 += '=';
        const bytes = base64ToBytes(cleanB64);
        const hexParts: string[] = [];
        for (let i = 0; i < bytes.length; i++) {
          let h = bytes[i].toString(16).padStart(2, '0');
          if (uppercase) h = h.toUpperCase();
          hexParts.push(h);
        }

        let delimChar = '';
        if (delimiter === 'space') delimChar = ' ';
        else if (delimiter === 'colon') delimChar = ':';
        else if (delimiter === 'comma') delimChar = ', ';

        setOutput(hexParts.join(delimChar));
      }
    } catch (err: any) {
      setError(err?.message || 'Conversion error');
      setOutput('');
    }
  }, [input, direction, delimiter, uppercase]);

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setDirection(direction === 'hex2b64' ? 'b642hex' : 'hex2b64');
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSample = () => {
    if (direction === 'hex2b64') {
      setInput('41 6e 74 69 67 72 61 76 69 74 79 20 50 72 6f');
    } else {
      setInput('QW50aWdyYXZpdHkgUHJv');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-darker">
      {/* Action Toolbar */}
      <div className="bg-surface-card border-b border-surface-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-surface-subtle p-0.5 border border-surface-border">
            <button
              onClick={() => setDirection('hex2b64')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                direction === 'hex2b64' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hex → Base64
            </button>
            <button
              onClick={() => setDirection('b642hex')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                direction === 'b642hex' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Base64 → Hex
            </button>
          </div>

          {direction === 'b642hex' && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Delimiter:</span>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value as any)}
                  className="bg-surface-subtle border border-surface-border rounded-md px-2 py-1 text-slate-200"
                >
                  <option value="none">None</option>
                  <option value="space">Space</option>
                  <option value="colon">Colon (:)</option>
                  <option value="comma">Comma (, )</option>
                </select>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded bg-surface-subtle border-surface-border text-blue-600"
                />
                <span>Uppercase HEX</span>
              </label>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSample}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Sample</span>
          </button>

          <button
            onClick={() => setInput('')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-red-500/10 border border-surface-border hover:border-red-500/30 text-slate-300 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Panes */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-border min-h-0">
        <div className="flex flex-col h-full bg-surface-card min-h-0">
          <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
            <span className="font-semibold text-slate-200">
              {direction === 'hex2b64' ? 'Hexadecimal Input' : 'Base64 Input'}
            </span>
            <span>{input.length} chars</span>
          </div>
          <div className="flex-1 relative min-h-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={direction === 'hex2b64' ? 'e.g. 48 65 6c 6c 6f' : 'e.g. SGVsbG8='}
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent text-slate-100 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-blue-600/30"
            />
          </div>
        </div>

        <div className="flex flex-col h-full bg-surface-card min-h-0">
          <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
            <span className="font-semibold text-slate-200">
              {direction === 'hex2b64' ? 'Base64 Output' : 'Hexadecimal Output'}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSwap}
                disabled={!output}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-surface-hover disabled:opacity-30"
                title="Swap"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1 px-2 py-0.5 text-xs text-slate-300 hover:text-white rounded hover:bg-surface-hover disabled:opacity-30"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 relative min-h-0">
            <textarea
              readOnly
              value={output}
              placeholder="Conversion result..."
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent text-slate-100 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-blue-600/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

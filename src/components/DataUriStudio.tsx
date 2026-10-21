'use client';

import React, { useState, useEffect } from 'react';
import {
  Link2,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export const DataUriStudio: React.FC = () => {
  const [dataUri, setDataUri] = useState<string>(
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMyAyaC0ybC0xIDcgNCAzLTMgMTB2MmgxbDgtMTBsLTUtMyA2LTh6Ii8+PC9zdmc+'
  );
  const [mime, setMime] = useState<string>('image/svg+xml');
  const [isBase64, setIsBase64] = useState<boolean>(true);
  const [payload, setPayload] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!dataUri.startsWith('data:')) {
      setError('A valid Data URI must begin with "data:"');
      return;
    }
    setError('');

    const commaIdx = dataUri.indexOf(',');
    if (commaIdx === -1) {
      setError('Data URI is missing a payload comma delimiter');
      return;
    }

    const meta = dataUri.substring(5, commaIdx);
    const dataPart = dataUri.substring(commaIdx + 1);
    setPayload(dataPart);

    const metaParts = meta.split(';');
    setMime(metaParts[0] || 'text/plain');
    setIsBase64(metaParts.includes('base64'));
  }, [dataUri]);

  const handleCopy = () => {
    if (!dataUri) return;
    navigator.clipboard.writeText(dataUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSample = () => {
    setDataUri('data:text/html;charset=utf-8,<h1>Hello%20World</h1>');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-darker">
      {/* Top Bar */}
      <div className="bg-surface-card border-b border-surface-border px-4 py-2.5 flex items-center justify-between gap-3 text-xs flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-white">Data URI Inspector & Visualizer</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSample}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Load HTML Sample</span>
          </button>

          <button
            onClick={() => setDataUri('')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-red-500/10 border border-surface-border hover:border-red-500/30 text-slate-300 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2 text-xs text-red-400 flex items-center gap-2 flex-shrink-0">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-border min-h-0">
        {/* Left: Raw Data URI Input & Breakdown */}
        <div className="flex flex-col h-full bg-surface-card min-h-0">
          <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
            <span className="font-semibold text-slate-200">Data URI Input</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-0.5 text-xs text-slate-300 hover:text-white rounded hover:bg-surface-hover"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy URI'}</span>
              </button>
            </div>
          </div>

          <div className="h-44 border-b border-surface-border p-3">
            <textarea
              value={dataUri}
              onChange={(e) => setDataUri(e.target.value)}
              placeholder="data:[<mediatype>][;base64],<data>"
              spellCheck={false}
              className="w-full h-full p-2 bg-surface-subtle border border-surface-border rounded-lg text-slate-100 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Breakdown Inspector */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              URI Component Decomposition
            </div>

            <div className="bg-surface-subtle rounded-lg border border-surface-border p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Media Type (MIME):</span>
                <span className="font-mono text-blue-400 font-semibold">{mime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Encoding Scheme:</span>
                <span className="font-mono text-indigo-400 font-semibold">
                  {isBase64 ? 'Base64' : 'Percent / Plain'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Payload Length:</span>
                <span className="font-mono text-slate-300">{payload.length.toLocaleString()} bytes</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Extracted Data Payload:</span>
              <textarea
                readOnly
                value={payload}
                className="w-full h-32 p-3 bg-surface-subtle border border-surface-border rounded-lg text-slate-300 font-mono text-xs resize-none focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Sandbox Visualizer */}
        <div className="flex flex-col h-full bg-surface-card min-h-0">
          <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
            <span className="font-semibold text-slate-200">Sandbox Preview</span>
            {dataUri && (
              <a
                href={dataUri}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto min-h-0">
            {dataUri && !error ? (
              mime.startsWith('image/') ? (
                <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dataUri}
                    alt="Preview"
                    className="max-h-80 max-w-full object-contain rounded"
                  />
                </div>
              ) : (
                <iframe
                  src={dataUri}
                  title="Data URI Render"
                  className="w-full h-full bg-white rounded-xl border border-surface-border shadow-xl"
                  sandbox="allow-scripts"
                />
              )
            ) : (
              <div className="text-center text-slate-500">
                <Layers className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-sm font-medium">No valid Data URI preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

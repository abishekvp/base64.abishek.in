'use client';

import React, { useState, useEffect } from 'react';
import { base64ToBytes, detectMimeFromBytes, bytesToSize } from '@/lib/base64';
import {
  Download,
  AlertCircle,
  FileCheck,
  FileDown,
  Trash2,
  Eye,
  Sparkles
} from 'lucide-react';

export const DecodeFileStudio: React.FC = () => {
  const [b64Input, setB64Input] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [decodedBytes, setDecodedBytes] = useState<Uint8Array | null>(null);
  const [mimeType, setMimeType] = useState<string>('application/octet-stream');
  const [fileExt, setFileExt] = useState<string>('bin');
  const [customName, setCustomName] = useState<string>('decoded-file');
  const [blobUrl, setBlobUrl] = useState<string>('');

  useEffect(() => {
    if (!b64Input.trim()) {
      setDecodedBytes(null);
      setError('');
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setBlobUrl('');
      return;
    }

    try {
      setError('');
      let clean = b64Input.trim();
      let explicitMime = '';

      // Check for Data URI prefix
      if (clean.startsWith('data:')) {
        const commaIdx = clean.indexOf(',');
        if (commaIdx !== -1) {
          const meta = clean.substring(5, commaIdx);
          const parts = meta.split(';');
          explicitMime = parts[0];
          clean = clean.substring(commaIdx + 1);
        }
      }

      // Sanitize whitespace and URL-safe chars
      clean = clean.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
      while (clean.length % 4 !== 0) {
        clean += '=';
      }

      const bytes = base64ToBytes(clean);
      setDecodedBytes(bytes);

      const detected = detectMimeFromBytes(bytes);
      const finalMime = explicitMime || detected.mime;
      setMimeType(finalMime);
      setFileExt(detected.ext);

      const blob = new Blob([bytes as unknown as BlobPart], { type: finalMime });
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
    } catch (err: any) {
      setError(err?.message || 'Invalid Base64 sequence');
      setDecodedBytes(null);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setBlobUrl('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b64Input]);

  const handleDownload = () => {
    if (!blobUrl || !decodedBytes) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${customName}.${fileExt}`;
    a.click();
  };

  const handleSample = () => {
    // 1x1 transparent red PNG
    setB64Input('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
    setCustomName('sample-dot');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-darker">
      {/* Top Action Ribbon */}
      <div className="bg-surface-card border-b border-surface-border px-4 py-2.5 flex items-center justify-between gap-3 text-xs flex-shrink-0">
        <div className="flex items-center gap-2 text-slate-300">
          <FileDown className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-white">Base64 to File Reconstructor</span>
          <span className="text-slate-500 hidden sm:inline">| Sniffs file signatures and restores binary data</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSample}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Load Sample PNG</span>
          </button>

          <button
            onClick={() => setB64Input('')}
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
          <span className="font-medium">Decoding Error: {error}</span>
        </div>
      )}

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-border min-h-0">
        {/* Left: Input */}
        <div className="flex flex-col h-full bg-surface-card min-h-0">
          <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
            <span className="font-semibold text-slate-200">Paste Raw Base64 or Data URI</span>
            <span>{b64Input.length.toLocaleString()} characters</span>
          </div>

          <div className="flex-1 relative min-h-0">
            <textarea
              value={b64Input}
              onChange={(e) => setB64Input(e.target.value)}
              placeholder="Paste Base64 payload here (e.g. iVBORw0KGgoAAAANSUhEUgAA... or data:image/png;base64,...)"
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent text-slate-100 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-blue-600/30"
            />
          </div>
        </div>

        {/* Right: Decoded Artifact & Preview */}
        <div className="flex flex-col h-full bg-surface-card min-h-0">
          <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Decoded File Artifact</span>
            </div>
            {decodedBytes && (
              <span className="text-[11px] text-emerald-400 font-medium">
                {bytesToSize(decodedBytes.length)}
              </span>
            )}
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto min-h-0">
            {!decodedBytes ? (
              <div className="text-center text-slate-500">
                <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
                <p className="text-sm font-medium">No valid Base64 data supplied</p>
                <p className="text-xs text-slate-500 mt-1">Paste Base64 code on the left to reconstruct the file</p>
              </div>
            ) : (
              <div className="w-full max-w-md bg-surface-subtle border border-surface-border rounded-xl p-5 flex flex-col gap-4 shadow-xl">
                {/* Visual Preview */}
                {mimeType.startsWith('image/') ? (
                  <div className="flex items-center justify-center p-3 bg-surface-card rounded-lg border border-surface-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blobUrl}
                      alt="Decoded Preview"
                      className="max-h-48 max-w-full object-contain rounded"
                    />
                  </div>
                ) : mimeType.startsWith('audio/') ? (
                  <audio controls src={blobUrl} className="w-full" />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-surface-card rounded-lg border border-surface-border">
                    <FileCheck className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">Binary Payload Restored</div>
                      <div className="text-xs text-slate-400">{mimeType}</div>
                    </div>
                  </div>
                )}

                {/* Metadata Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-surface-border">
                    <span className="text-slate-400">Detected MIME:</span>
                    <span className="font-mono text-slate-200">{mimeType}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-surface-border">
                    <span className="text-slate-400">Restored File Size:</span>
                    <span className="font-mono text-slate-200">{bytesToSize(decodedBytes.length)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <span className="text-slate-400 flex-shrink-0">Save As:</span>
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="bg-surface-card border border-surface-border rounded px-2 py-1 text-slate-200 text-xs w-full focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-slate-400 font-mono">.{fileExt}</span>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {customName}.{fileExt}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useRef } from 'react';
import { bytesToSize } from '@/lib/base64';
import {
  UploadCloud,
  FileCode,
  Copy,
  Check,
  Download,
  Trash2,
  Image as ImageIcon,
  Code,
  FileText
} from 'lucide-react';

export const FileStudio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string>('');
  const [dataUri, setDataUri] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<'raw' | 'uri' | 'html' | 'css'>('raw');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) processFile(dropped);
  };

  const processFile = (fileItem: File) => {
    setFile(fileItem);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setDataUri(result);
      const commaIdx = result.indexOf(',');
      const raw = commaIdx !== -1 ? result.substring(commaIdx + 1) : result;
      setBase64(raw);

      if (fileItem.type.startsWith('image/')) {
        setPreviewUrl(result);
      } else {
        setPreviewUrl('');
      }
    };
    reader.readAsDataURL(fileItem);
  };

  const handleClear = () => {
    setFile(null);
    setBase64('');
    setDataUri('');
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const htmlSnippet = file?.type.startsWith('image/')
    ? `<img src="${dataUri}" alt="${file.name}" />`
    : `<a href="${dataUri}" download="${file?.name || 'file'}">Download ${file?.name || 'File'}</a>`;

  const cssSnippet = `background-image: url("${dataUri}");`;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-darker">
      {!file ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-2xl border-2 border-dashed border-surface-border hover:border-blue-500/50 bg-surface-card hover:bg-surface-subtle/50 rounded-2xl p-12 text-center cursor-pointer transition-all flex flex-col items-center gap-4 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Drag & Drop any file to convert to Base64
              </h3>
              <p className="text-xs text-slate-400">
                Supports Images (PNG, JPG, SVG, WebP), PDFs, Audio, Fonts, Documents & Binaries
              </p>
            </div>
            <button className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-sm">
              Browse Local File
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Bar for File Details */}
          <div className="bg-surface-card border-b border-surface-border px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                {file.type.startsWith('image/') ? <ImageIcon className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{file.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{bytesToSize(file.size)}</span>
                  <span>•</span>
                  <span className="font-mono">{file.type || 'application/octet-stream'}</span>
                  <span>•</span>
                  <span>Base64 length: {base64.length.toLocaleString()} chars</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-red-500/10 border border-surface-border hover:border-red-500/30 text-slate-300 hover:text-red-400 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Choose Another File</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-surface-border min-h-0">
            {/* Left Preview Pane (if image) */}
            {previewUrl && (
              <div className="lg:col-span-4 bg-surface-subtle/30 flex flex-col items-center justify-center p-6 overflow-hidden min-h-0">
                <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider self-start">
                  Live Rendered Preview
                </div>
                <div className="w-full flex-1 flex items-center justify-center min-h-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="max-h-64 lg:max-h-80 max-w-full object-contain rounded-lg border border-surface-border shadow-lg bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px]"
                  />
                </div>
              </div>
            )}

            {/* Right Output Snippets Pane */}
            <div className={`${previewUrl ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col h-full bg-surface-card min-h-0`}>
              {/* Snippet Tabs */}
              <div className="h-10 px-4 border-b border-surface-border flex items-center justify-between text-xs bg-surface-subtle/40 select-none flex-shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveSnippet('raw')}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      activeSnippet === 'raw' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Raw Base64
                  </button>
                  <button
                    onClick={() => setActiveSnippet('uri')}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      activeSnippet === 'uri' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Data URI
                  </button>
                  <button
                    onClick={() => setActiveSnippet('html')}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      activeSnippet === 'html' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    HTML Tag
                  </button>
                  <button
                    onClick={() => setActiveSnippet('css')}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      activeSnippet === 'css' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    CSS Background
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text =
                        activeSnippet === 'raw'
                          ? base64
                          : activeSnippet === 'uri'
                          ? dataUri
                          : activeSnippet === 'html'
                          ? htmlSnippet
                          : cssSnippet;
                      copyToClipboard(text, activeSnippet);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition-colors"
                  >
                    {copiedType === activeSnippet ? (
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedType === activeSnippet ? 'Copied!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={() => downloadText(base64, `${file.name}.base64.txt`)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-surface-hover"
                    title="Download Base64 as text file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <div className="flex-1 relative min-h-0">
                <textarea
                  readOnly
                  value={
                    activeSnippet === 'raw'
                      ? base64
                      : activeSnippet === 'uri'
                      ? dataUri
                      : activeSnippet === 'html'
                      ? htmlSnippet
                      : cssSnippet
                  }
                  spellCheck={false}
                  className="w-full h-full p-4 bg-transparent text-slate-100 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-blue-600/30"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

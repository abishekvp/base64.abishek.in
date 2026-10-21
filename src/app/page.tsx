'use client';

import React, { useState } from 'react';
import { ActiveTab } from '@/types';
import { Header } from '@/components/Header';
import { TextStudio } from '@/components/TextStudio';
import { FileStudio } from '@/components/FileStudio';
import { DecodeFileStudio } from '@/components/DecodeFileStudio';
import { HexStudio } from '@/components/HexStudio';
import { DataUriStudio } from '@/components/DataUriStudio';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('text');

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-surface-darker text-slate-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === 'text' && <TextStudio />}
        {activeTab === 'file' && <FileStudio />}
        {activeTab === 'decode-file' && <DecodeFileStudio />}
        {activeTab === 'hex' && <HexStudio />}
        {activeTab === 'uri' && <DataUriStudio />}
      </div>
    </main>
  );
}

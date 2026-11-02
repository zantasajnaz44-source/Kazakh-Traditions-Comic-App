import { useMemo, useState } from 'react';
import type { TraditionComic } from '@workspace/api-client-react';
import { Copy, Download, LoaderCircle } from 'lucide-react';
import { createComicPng } from '@/lib/comic-png';

export function ComicCopyActions({ comic }: { comic: TraditionComic }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const cache = useMemo(() => ({ png: null as Promise<Blob> | null }), [comic]);
  const png = () => {
    if (!cache.png) {
      cache.png = createComicPng(comic).catch((error) => {
        cache.png = null;
        throw error;
      });
    }
    return cache.png;
  };

  const copy = async () => {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined' ||
      (ClipboardItem.supports && !ClipboardItem.supports('image/png'))) {
      setStatus('Бұл браузер суретті көшіруді қолдамайды. «PNG сақтау» батырмасын қолдан.');
      return;
    }
    setBusy(true);
    setStatus('');
    const image = png();
    try {
      // Pass the promise immediately to preserve Safari's user-gesture permission.
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': image })]);
      setStatus('Комикс көшірілді! Оны сурет қабылдайтын жерге қоя аласың.');
    } catch {
      try {
        await image;
        setStatus('Браузер көшіруге рұқсат бермеді. «PNG сақтау» арқылы суретті жүктеп ал.');
      } catch {
        setStatus('Суретті дайындау мүмкін болмады. Қайталап көр.');
      }
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    setBusy(true);
    setStatus('');
    try {
      const url = URL.createObjectURL(await png());
      const link = document.createElement('a');
      link.href = url;
      link.download = `${comic.title.replace(/[^\p{L}\p{N}_-]+/gu, '-').slice(0, 80) || 'comic'}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setStatus('PNG файлы жүктеуге жіберілді.');
    } catch {
      setStatus('Суретті сақтау мүмкін болмады. Қайталап көр.');
    } finally {
      setBusy(false);
    }
  };

  const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[hsl(var(--primary))]/40 px-3 py-2 text-sm font-semibold text-[hsl(var(--primary))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))] disabled:cursor-wait disabled:opacity-60';
  return (
    <div data-testid="comic-copy-actions">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copy} disabled={busy} className={buttonClass} data-testid="button-copy-comic">
          {busy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          Комиксті көшіру
        </button>
        <button type="button" onClick={download} disabled={busy} className={buttonClass} data-testid="button-download-comic">
          <Download size={16} aria-hidden="true" /> PNG сақтау
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 text-xs text-[hsl(var(--muted-foreground))]" data-testid="status-copy-comic">
        {status || 'Үш кадр, барлық реплика және дәстүрдің мәні бір суретке біріктіріледі.'}
      </p>
    </div>
  );
}

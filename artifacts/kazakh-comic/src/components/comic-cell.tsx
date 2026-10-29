import type { ReactNode } from 'react';

type ComicCellProps = {
  src: string;
  index: number;
  alt: string;
  testId?: string;
  dialogue?: ReactNode;
  badge?: ReactNode;
};

/** Framed comic panel: reserved speech area on top, then unobstructed square artwork.
 * Artwork is one of the first three cells of a square 2x2 storyboard: 0 top-left, 1 top-right, 2 bottom-left. */
export function ComicCell({ src, index, alt, testId, dialogue, badge }: ComicCellProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border-2 comic-frame">
      {dialogue && (
        <div className="flex-1 space-y-3 border-b-2 comic-speech p-2.5 pb-3.5">{dialogue}</div>
      )}
      <div className="relative aspect-square shrink-0 overflow-hidden comic-art">
        <img
          data-testid={testId}
          src={src}
          alt={alt}
          className="absolute h-[200%] w-[200%] max-w-none object-cover"
          style={{ left: index === 1 ? '-100%' : '0', top: index === 2 ? '-100%' : '0' }}
        />
        {badge}
      </div>
    </div>
  );
}

type BubbleProps = { who: string; text: string; tone: 'girl' | 'elder' };

export function SpeechBubble({ who, text, tone }: BubbleProps) {
  const girl = tone === 'girl';
  return (
    <div className={`relative bubble rounded-xl border-2 px-2.5 py-1.5 ${girl ? 'mr-4 bubble-child' : 'ml-4 bubble-elder'}`}>
      <span className={`text-[10px] font-bold uppercase tracking-wide ${girl ? 'bubble-child-name' : 'text-[hsl(var(--primary))]'}`}>{who}</span>
      <p className="mt-0.5 text-xs font-medium leading-[1.45] ">«{text}»</p>
      <span aria-hidden="true" className={`absolute -bottom-[7px] h-3 w-3 rotate-45 border-b-2 border-r-2 bubble ${girl ? 'left-6 bubble-child' : 'right-6 bubble-elder'}`} />
    </div>
  );
}

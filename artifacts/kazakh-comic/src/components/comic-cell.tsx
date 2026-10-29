import type { ReactNode } from 'react';

type ComicCellProps = {
  src: string;
  index: number;
  alt: string;
  testId?: string;
  children?: ReactNode;
};

/** Shows one of the first three cells of a square 2x2 storyboard: 0 top-left, 1 top-right, 2 bottom-left. */
export function ComicCell({ src, index, alt, testId, children }: ComicCellProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-[#2f3b38] bg-[#f5ead2]">
      <img
        data-testid={testId}
        src={src}
        alt={alt}
        className="absolute h-[200%] w-[200%] max-w-none object-cover"
        style={{ left: index === 1 ? '-100%' : '0', top: index === 2 ? '-100%' : '0' }}
      />
      {children}
    </div>
  );
}

type BubbleProps = { who: string; text: string; tone: 'girl' | 'elder' };

export function SpeechBubble({ who, text, tone }: BubbleProps) {
  const girl = tone === 'girl';
  return (
    <div className={`relative rounded-2xl border-2 border-[#2f3b38] px-3 py-2 shadow-md ${girl ? 'bg-[#fffaf0]/95' : 'bg-[#e2efe5]/95'}`}>
      <span className={`text-[10px] font-bold uppercase tracking-wide ${girl ? 'text-[#b06a51]' : 'text-[hsl(var(--primary))]'}`}>{who}</span>
      <p className="mt-0.5 text-[13px] font-medium leading-5 text-[hsl(var(--foreground))]">«{text}»</p>
      <span aria-hidden="true" className={`absolute -bottom-[7px] h-3 w-3 rotate-45 border-b-2 border-r-2 border-[#2f3b38] ${girl ? 'left-6 bg-[#fffaf0]' : 'right-6 bg-[#e2efe5]'}`} />
    </div>
  );
}

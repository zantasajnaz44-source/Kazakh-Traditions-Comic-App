type ComicCellProps = {
  src: string;
  index: number;
  alt: string;
  testId?: string;
};

/** Shows one of the first three cells of a square 2x2 storyboard: 0 top-left, 1 top-right, 2 bottom-left. */
export function ComicCell({ src, index, alt, testId }: ComicCellProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-[#2f3b38] bg-[#f5ead2]">
      <img
        data-testid={testId}
        src={src}
        alt={alt}
        className="absolute h-[200%] w-[200%] max-w-none object-cover"
        style={{ left: index === 1 ? '-100%' : '0', top: index === 2 ? '-100%' : '0' }}
      />
    </div>
  );
}

type BubbleProps = { who: string; text: string; tone: 'girl' | 'elder' };

export function SpeechBubble({ who, text, tone }: BubbleProps) {
  const girl = tone === 'girl';
  return (
    <div className={`rounded-2xl border-2 border-[#2f3b38] px-4 py-3 ${girl ? 'rounded-bl-sm bg-[#fffaf0]' : 'rounded-br-sm bg-[#e2efe5]'}`}>
      <span className={`text-[11px] font-bold uppercase tracking-wide ${girl ? 'text-[#b06a51]' : 'text-[hsl(var(--primary))]'}`}>{who}</span>
      <p className="mt-1 text-[15px] leading-6 text-[hsl(var(--foreground))]">«{text}»</p>
    </div>
  );
}

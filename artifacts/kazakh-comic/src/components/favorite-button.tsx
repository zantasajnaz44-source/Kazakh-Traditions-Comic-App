import { Heart } from 'lucide-react';

export function FavoriteButton({ active, label, onToggle, testId }: { active: boolean; label: string; onToggle: () => void; testId: string }) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={active}
      aria-label={active ? `«${label}» сүйіктілерден алып тастау` : `«${label}» сүйіктілерге қосу`}
      title={active ? 'Сүйіктілерден алып тастау' : 'Сүйіктілерге қосу'}
      onClick={onToggle}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))] ${active ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))]'}`}
    >
      <Heart size={18} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}

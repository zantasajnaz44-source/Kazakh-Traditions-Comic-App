import { Heart } from 'lucide-react';

export function FavoriteButton({ active, label, onToggle, testId, disabled = false }: { active: boolean; label: string; onToggle: () => void; testId: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      data-testid={testId}
      disabled={disabled}
      aria-pressed={active}
      aria-label={disabled ? 'Сүйіктіге қосу үшін дәстүрді таңдаңыз' : active ? `«${label}» сүйіктілерден алып тастау` : `«${label}» сүйіктілерге қосу`}
      title={disabled ? 'Алдымен дәстүрді таңдаңыз' : active ? 'Сүйіктілерден алып тастау' : 'Сүйіктілерге қосу'}
      onClick={onToggle}
      className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))] ${active ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))]' : 'border-[hsl(var(--accent))]/50 text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]'}`}
    >
      <Heart size={18} fill={active ? 'currentColor' : 'none'} />
      <span>{active ? 'Сүйіктілерде' : 'Сүйіктіге қосу'}</span>
    </button>
  );
}

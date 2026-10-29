import { CircleAlert, Heart, X } from 'lucide-react';

type Props = { favorites: string[]; error: string; selected: string; onSelect: (v: string) => void; onRemove: (v: string) => void };

export function FavoritesList({ favorites, error, selected, onSelect, onRemove }: Props) {
  return (
    <section className="mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-3" aria-labelledby="favorites-title" data-testid="section-favorites">
      <h3 id="favorites-title" className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">
        <Heart size={13} className="text-[hsl(var(--accent))]" /> Менің сүйікті дәстүрлерім
      </h3>
      {error && <p role="alert" data-testid="status-favorites-error" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--destructive))]"><CircleAlert size={14} />{error}</p>}
      {favorites.length === 0 ? (
        <p className="text-xs leading-5 text-[hsl(var(--muted-foreground))]" data-testid="status-favorites-empty">Әзірге бос. Комикс тақырыбының жанындағы жүрекшені басып, дәстүрді осында сақтаңыз.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {favorites.map((f, i) => (
            <li key={f} className={`flex items-center rounded-full border text-xs font-semibold ${selected.trim() === f ? 'border-[hsl(var(--primary))] bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--background))]'}`}>
              <button type="button" data-testid={`button-favorite-select-${i}`} onClick={() => onSelect(f)} aria-label={`«${f}» тақырыбын таңдау`} className="rounded-l-full py-2 pl-3 pr-1.5 hover:text-[hsl(var(--primary))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--primary))]">{f}</button>
              <button type="button" data-testid={`button-favorite-remove-${i}`} onClick={() => onRemove(f)} aria-label={`«${f}» сүйіктілерден өшіру`} className="grid h-8 w-8 place-items-center rounded-r-full text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--primary))]"><X size={13} /></button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

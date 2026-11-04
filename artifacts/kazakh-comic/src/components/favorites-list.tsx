import { CircleAlert, Heart, X } from 'lucide-react';

type Props = { favorites: string[]; error: string; selected: string; onSelect: (v: string) => void; onRemove: (v: string) => void };

export function FavoritesList({ favorites, error, selected, onSelect, onRemove }: Props) {
  return (
    <section className="bg-fav flex gap-3 rounded-xl border border-[#f1d3d3] p-3 dark:border-[var(--line)]" aria-labelledby="favorites-title" data-testid="section-favorites">
      <Heart size={24} className="mt-0.5 shrink-0 text-[#d0454c]" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <h3 id="favorites-title" className="text-[13px] font-extrabold uppercase tracking-wide">Менің таңдаулы дәстүрлерім</h3>
        {error && <p role="alert" data-testid="status-favorites-error" className="mt-1 flex items-center gap-1.5 text-xs text-[hsl(var(--destructive))]"><CircleAlert size={14} />{error}</p>}
        {favorites.length === 0 ? (
          <p className="mt-0.5 text-[12px] leading-snug opacity-80" data-testid="status-favorites-empty">Әзірге таңдаулы дәстүрлер жоқ. Ұнаған дәстүрді осы бөлімге сақтау үшін оның жанындағы жүрекше белгісін басыңыз.</p>
        ) : (
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {favorites.map((f, i) => (
              <li key={f} className={`flex items-center rounded-full border text-xs font-semibold ${selected.trim() === f ? 'btn-teal border-transparent' : 'ref-input'}`}>
                <button type="button" data-testid={`button-favorite-select-${i}`} onClick={() => onSelect(f)} aria-label={`«${f}» тақырыбын таңдау`} className="rounded-l-full py-1.5 pl-3 pr-1">{f}</button>
                <button type="button" data-testid={`button-favorite-remove-${i}`} onClick={() => onRemove(f)} aria-label={`«${f}» сүйіктілерден өшіру`} className="grid h-7 w-7 place-items-center rounded-r-full opacity-70 hover:opacity-100"><X size={12} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

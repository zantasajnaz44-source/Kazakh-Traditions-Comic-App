import { Check } from 'lucide-react';

const GROUPS: { title: string; items: string[] }[] = [
  { title: 'Баланың дүниеге келуі мен ержетуіне байланысты дәстүрлер', items: ['Шілдехана', 'Бесікке салу', 'Тұсаукесер'] },
  { title: 'Отбасын құру және үйлену дәстүрлері', items: ['Құда түсу', 'Қыз ұзату', 'Ұрын бару'] },
  { title: 'Қоғамдық қарым-қатынас және өзара көмек дәстүрлері', items: ['Қонақасы', 'Бата беру', 'Асар'] },
  { title: 'Ұлттық мерекелер мен тұрмыс-салт дәстүрлері', items: ['Наурыз мерекесіне дайындық', 'Шашу', 'Тоқымқағар'] },
];

export function TraditionTopics({ selected, onChoose }: { selected: string; onChoose: (value: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {GROUPS.map((group, gi) => (
        <div key={group.title} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-3" data-testid={`group-topics-${gi + 1}`}>
          <p className="mb-2.5 flex gap-2 text-xs font-bold leading-snug text-[hsl(var(--foreground))]">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[10px] text-[hsl(var(--primary))]">{gi + 1}</span>
            {group.title}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((idea) => {
              const active = selected === idea;
              return (
                <button
                  type="button"
                  key={idea}
                  data-testid={`button-idea-${idea}`}
                  aria-pressed={active}
                  onClick={() => onChoose(idea)}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] ${active ? 'border-[hsl(var(--primary))] bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]'}`}
                >{active && <Check size={12} className="mr-1 inline" />}{idea}</button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

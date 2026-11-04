import { Baby, Check, HandHeart, Heart, Sprout } from 'lucide-react';

const GROUPS = [
  { title: 'Баланың дүниеге келуі мен тәрбиесіне байланысты дәстүрлер', items: ['Шілдехана', 'Бесікке салу', 'Тұсаукесер'], bg: 'bg-tyellow', Icon: Baby, tone: '#c9922a' },
  { title: 'Үйлену және отбасын құру дәстүрлері', items: ['Құда түсу', 'Қыз ұзату', 'Ұрын бару'], bg: 'bg-tpink', Icon: Heart, tone: '#c8553d' },
  { title: 'Қоғамдық қарым-қатынас пен өзара көмек дәстүрлері', items: ['Қонақасы', 'Бата беру', 'Асар'], bg: 'bg-tblue', Icon: HandHeart, tone: '#2f7fa3' },
  { title: 'Ұлттық мерекелер мен тұрмыстық салт-дәстүрлер', items: ['Наурыз мерекесіне дайындық', 'Шашу', 'Тоқымқағар'], bg: 'bg-tgreen', Icon: Sprout, tone: '#4f8a2b' },
];

export function TraditionTopics({ selected, onChoose }: { selected: string; onChoose: (value: string) => void }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {GROUPS.map((g, gi) => (
        <div key={g.title} className={`${g.bg} rounded-xl border border-[var(--line)] p-2.5`} data-testid={`group-topics-${gi + 1}`}>
          <p className="mb-2 flex items-start gap-2 text-[12.5px] font-bold leading-snug">
            <g.Icon size={20} style={{ color: g.tone }} className="shrink-0" aria-hidden="true" />
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] text-white" style={{ background: g.tone }}>{gi + 1}</span>
            {g.title}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((idea) => {
              const active = selected === idea;
              return (
                <button type="button" key={idea} data-testid={`button-idea-${idea}`} aria-pressed={active} onClick={() => onChoose(idea)}
                  className={`flex-1 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[12px] font-medium transition hover:border-[var(--teal)] ${active ? 'btn-teal border-transparent' : 'ref-input'}`}
                >{active && <Check size={11} className="mr-1 inline" />}{idea}</button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useId, useState, type ChangeEvent } from 'react';
import { Info, Lightbulb, PenLine } from 'lucide-react';

const ANSWER_STORAGE_KEY = 'kazakh-comic:reflection-answer';

type AnswerDraft = { text: string; status: 'empty' | 'saved' | 'unavailable' };

function readAnswer(): AnswerDraft {
  try {
    const text = window.localStorage.getItem(ANSWER_STORAGE_KEY) ?? '';
    return { text, status: text ? 'saved' : 'empty' };
  } catch {
    return { text: '', status: 'unavailable' };
  }
}

export function ComicAnswer() {
  const id = useId();
  const [draft, setDraft] = useState<AnswerDraft>(readAnswer);

  function updateAnswer(event: ChangeEvent<HTMLTextAreaElement>) {
    const text = event.target.value;
    try {
      window.localStorage.setItem(ANSWER_STORAGE_KEY, text);
      setDraft({ text, status: text ? 'saved' : 'empty' });
    } catch {
      setDraft({ text, status: 'unavailable' });
    }
  }

  return (
    <section className="ref-card p-3" aria-labelledby={`${id}-title`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="btn-teal grid h-6 w-6 place-items-center rounded-full"><PenLine size={13} /></span>
        <h2 id={`${id}-title`} className="serif ref-teal text-lg font-semibold">Менің ойым</h2>
        <p className="bg-hint flex min-w-0 flex-1 basis-full items-center gap-1.5 rounded-md px-2 py-1 text-[12px] sm:basis-0"><Lightbulb size={14} className="shrink-0 text-[#d29a1d]" />Отбасыңдағы үлкендерден осы дәстүр туралы не білдің? Дәстүр қалай орындалады? Оның маңызын қалай түсіндің?</p>
      </div>
      <label htmlFor={id} className="mb-1 mt-2 block text-[12px] font-semibold">Өз ойыңды осында жаз</label>
      <textarea id={id} data-testid="input-reflection-answer" value={draft.text} onChange={updateAnswer} rows={2} maxLength={5000}
        placeholder="Мен отбасымдағы үлкендерден осы дәстүр туралы сұрадым. Олардың айтуынша, бұл дәстүр..."
        aria-describedby={`${id}-storage`}
        className="ref-input block min-h-14 w-full resize-y rounded-lg px-3 py-2 text-[13px] leading-5 outline-none focus:border-[var(--teal)]" />
      <div className="mt-1 flex flex-wrap justify-between gap-2 text-[11px] opacity-80">
        <p id={`${id}-storage`} data-testid="status-answer-storage" role="status" className={`flex items-center gap-1 ${draft.status === 'unavailable' ? 'text-[hsl(var(--destructive))]' : ''}`}>
          <Info size={12} />
          {draft.status === 'unavailable' ? 'Браузерде сақтау мүмкін болмады. Жауабыңды жоғалтпау үшін көшіріп ал.'
            : draft.status === 'saved' ? 'Жазған жауабың осы браузерде автоматты түрде сақталды.' : 'Жазған жауабың осы браузерде автоматты түрде сақталады.'}
        </p>
        <span>{draft.text.length}/5000</span>
      </div>
    </section>
  );
}

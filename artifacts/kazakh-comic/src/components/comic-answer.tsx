import { useId, useState, type ChangeEvent } from 'react';

const ANSWER_STORAGE_KEY = 'kazakh-comic:reflection-answer';

type AnswerDraft = {
  text: string;
  status: 'empty' | 'saved' | 'unavailable';
};

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
      // Keep the current answer visible even when browser storage is unavailable.
      setDraft({ text, status: 'unavailable' });
    }
  }

  return (
    <section className="comic-card rounded-2xl p-4 sm:p-5" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="serif text-xl font-semibold text-[hsl(var(--primary))]">Менің жауабым</h2>
      <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
        Ата-анаң не айтып берді? Дәстүр қалай өтті және оның мәнін қалай түсіндің?
      </p>
      <label htmlFor={id} className="mb-2 mt-3 block text-sm font-semibold">Жауабыңды осында жаз</label>
      <textarea
        id={id}
        data-testid="input-reflection-answer"
        value={draft.text}
        onChange={updateAnswer}
        rows={5}
        maxLength={5000}
        placeholder="Мен ата-анамнан сұрадым… Бұл дәстүрдің мәні…"
        aria-describedby={`${id}-storage`}
        className="block min-h-36 w-full resize-y rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm leading-6 outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary))]/15"
      />
      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
        <p
          id={`${id}-storage`}
          data-testid="status-answer-storage"
          role="status"
          className={draft.status === 'unavailable' ? 'text-[hsl(var(--destructive))]' : 'text-[hsl(var(--muted-foreground))]'}
        >
          {draft.status === 'unavailable'
            ? 'Браузерде сақтау мүмкін болмады. Жауабыңды жоғалтпау үшін көшіріп ал.'
            : draft.status === 'saved'
              ? 'Жауабың осы браузерде автоматты түрде сақталды.'
              : 'Жауабың тек осы браузерде автоматты түрде сақталады.'}
        </p>
        <span className="text-[hsl(var(--muted-foreground))]">{draft.text.length}/5000</span>
      </div>
    </section>
  );
}

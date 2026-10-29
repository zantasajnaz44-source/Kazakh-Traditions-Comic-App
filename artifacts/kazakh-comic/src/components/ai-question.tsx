import { useEffect, useId, useState, type FormEvent } from 'react';
import { useAnswerTraditionQuestion } from '@workspace/api-client-react';
import { Bot, CircleAlert, LoaderCircle, Send } from 'lucide-react';

type Props = { tradition: string; meaning?: string };

export function AiQuestion({ tradition, meaning }: Props) {
  const id = useId();
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const ask = useAnswerTraditionQuestion();
  const { reset } = ask;
  const contextKey = `${tradition}\u0000${meaning ?? ''}`;

  useEffect(() => { reset(); }, [contextKey, reset]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const q = question.trim();
    if (q.length < 2) { setError('Сұрақты кемінде 2 әріппен жазыңыз.'); return; }
    setError('');
    const t = tradition.trim().slice(0, 160);
    ask.mutate({ data: { question: q, ...(t.length >= 2 ? { tradition: t } : {}), ...(meaning ? { comicMeaning: meaning.slice(0, 2000) } : {}) } });
  };

  return (
    <section className="comic-card mt-5 rounded-2xl p-4 sm:p-5" aria-labelledby={`${id}-t`} data-testid="section-ai-question">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><Bot size={18} /></span>
        <div>
          <h2 id={`${id}-t`} className="serif text-xl font-semibold text-[hsl(var(--primary))]">Сұрағың бар ма?</h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Жауапты ИИ-бот береді{tradition.trim() ? ` · тақырып: ${tradition.trim()}` : ''}</p>
        </div>
      </div>
      <form onSubmit={submit} noValidate className="mt-3">
        <label htmlFor={id} className="mb-2 block text-sm font-semibold">Дәстүр туралы сұрағыңды жаз</label>
        <textarea
          id={id}
          data-testid="input-ai-question"
          value={question}
          disabled={ask.isPending}
          onChange={(e) => { setQuestion(e.target.value); setError(''); if (!ask.isPending) reset(); }}
          rows={3}
          maxLength={5000}
          placeholder="Мысалы: Тұсауды неге ала жіппен кеседі?"
          aria-invalid={Boolean(error)}
          className="block w-full resize-y rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 text-sm leading-6 outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary))]/15"
        />
        {error && <p data-testid="status-ai-validation" className="mt-2 flex items-center gap-1.5 text-xs text-[hsl(var(--destructive))]"><CircleAlert size={14} />{error}</p>}
        <button type="submit" data-testid="button-ask-ai" disabled={ask.isPending} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-bold text-[hsl(var(--primary-foreground))] hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))] disabled:cursor-wait disabled:opacity-75">
          {ask.isPending ? <><LoaderCircle size={16} className="animate-spin" /> ИИ ойланып жатыр</> : <><Send size={15} /> ИИ-ден сұра</>}
        </button>
      </form>
      <div aria-live="polite">
        {ask.isPending && (
          <div role="status" data-testid="status-ai-loading" className="mt-4 space-y-2"><div className="skeleton-shimmer h-3 w-full rounded-full" /><div className="skeleton-shimmer h-3 w-4/5 rounded-full" /></div>
        )}
        {ask.isError && (
          <div role="alert" data-testid="status-ai-error" className="mt-4 rounded-xl border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 p-3 text-sm">
            <p className="font-semibold text-[hsl(var(--destructive))]">ИИ-бот әзірге жауап бере алмады.</p>
            <button type="button" data-testid="button-ai-retry" onClick={() => submit()} className="mt-2 rounded-lg border border-[hsl(var(--destructive))]/35 px-3 py-1.5 text-xs font-bold text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/10">Қайта сұрау</button>
          </div>
        )}
        {ask.isSuccess && ask.data && (
          <div data-testid="text-ai-answer" className="mt-4 rounded-xl bg-[hsl(var(--secondary))]/60 p-3 sm:p-4">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]"><Bot size={13} /> ИИ-бот жауабы</p>
            <p className="content-copy text-sm leading-6">{ask.data.answer}</p>
            <p className="mt-2 text-[11px] text-[hsl(var(--muted-foreground))]">ИИ қателесуі мүмкін — үлкендермен бірге талқыла.</p>
          </div>
        )}
      </div>
    </section>
  );
}

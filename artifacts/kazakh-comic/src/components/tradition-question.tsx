import { useEffect, useId, useState, type FormEvent } from 'react';
import { useAnswerTraditionQuestion } from '@workspace/api-client-react';
import { CircleHelp, LoaderCircle, Send } from 'lucide-react';

type Props = { tradition: string; meaning?: string };

export function TraditionQuestion({ tradition, meaning }: Props) {
  const id = useId();
  const [question, setQuestion] = useState('');
  const [validation, setValidation] = useState('');
  const answer = useAnswerTraditionQuestion({ mutation: { retry: false } });
  const { reset } = answer;

  // An answer about the previous topic must not appear under the new topic.
  useEffect(() => { reset(); }, [tradition, meaning, reset]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (answer.isPending) return;
    const text = question.trim();
    if (text.length < 2) {
      setValidation('Сұрағыңды кемінде екі таңбамен жаз.');
      return;
    }
    setValidation('');
    const topic = tradition.trim();
    answer.mutate({
      data: {
        question: text,
        ...(topic.length >= 2 && topic.length <= 160 ? { tradition: topic } : {}),
        ...(meaning ? { comicMeaning: meaning.slice(0, 2000) } : {}),
      },
    });
  };

  return (
    <section className="comic-card mt-5 rounded-2xl p-4 sm:p-5" aria-labelledby={`${id}-title`} data-testid="section-tradition-question">
      <h2 id={`${id}-title`} className="serif flex items-center gap-2 text-xl font-semibold text-[hsl(var(--primary))]">
        <CircleHelp size={22} aria-hidden="true" />
        Түсінбегеніңді сұра
      </h2>
      <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
        Дәстүр туралы сұрағыңды жаз. Жауапты көркем тілмен де, қарапайым сөзбен де оқи аласың.
      </p>
      <form onSubmit={submit} className="mt-4">
        <label htmlFor={id} className="mb-2 block text-sm font-semibold">Сенің сұрағың</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={id}
            type="text"
            value={question}
            maxLength={5000}
            disabled={answer.isPending}
            onChange={(event) => {
              setQuestion(event.target.value);
              setValidation('');
              reset();
            }}
            placeholder="Мысалы: Тұсауды неге ала жіппен кеседі?"
            aria-invalid={Boolean(validation)}
            aria-describedby={validation ? `${id}-error` : undefined}
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 text-sm outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary))]/20 disabled:opacity-70"
            data-testid="input-tradition-question"
          />
          <button
            type="submit"
            disabled={answer.isPending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-bold text-[hsl(var(--primary-foreground))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))] disabled:cursor-wait disabled:opacity-70"
            data-testid="button-submit-question"
          >
            {answer.isPending ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
            {answer.isPending ? 'Күте тұр…' : 'Сұрау'}
          </button>
        </div>
        {validation && <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-[hsl(var(--destructive))]">{validation}</p>}
      </form>
      <div aria-live="polite" aria-busy={answer.isPending}>
        {answer.isPending && <p role="status" className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">Жауап дайындалып жатыр…</p>}
        {answer.isError && <p role="alert" className="mt-3 text-sm text-[hsl(var(--destructive))]">Жауап алу мүмкін болмады. «Сұрау» батырмасын басып, қайталап көр.</p>}
        {answer.isSuccess && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2" data-testid="text-question-answer">
            <section className="rounded-xl bg-[hsl(var(--secondary))]/60 p-4">
              <h3 className="mb-2 text-sm font-bold text-[hsl(var(--primary))]">Көркем жауап</h3>
              <p className="content-copy text-sm leading-6" data-testid="text-literary-answer">{answer.data.answer}</p>
            </section>
            <section className="rounded-xl border border-[hsl(var(--primary))]/25 bg-[hsl(var(--background))] p-4">
              <h3 className="mb-2 text-sm font-bold text-[hsl(var(--primary))]">Қарапайым сөзбен</h3>
              <p className="content-copy text-sm leading-6" data-testid="text-simple-answer">{answer.data.simpleAnswer}</p>
            </section>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">Жауапты жасанды интеллект дайындайды. Күмәнің болса, үлкендерден де сұра.</p>
    </section>
  );
}

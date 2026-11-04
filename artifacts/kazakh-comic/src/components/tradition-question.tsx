import { useEffect, useId, useState, type FormEvent } from 'react';
import { useAnswerTraditionQuestion } from '@workspace/api-client-react';
import { BookOpen, CircleHelp, LoaderCircle, MessagesSquare, Send } from 'lucide-react';

type Props = { tradition: string; meaning?: string };

export function TraditionQuestion({ tradition, meaning }: Props) {
  const id = useId();
  const [question, setQuestion] = useState('');
  const [validation, setValidation] = useState('');
  const answer = useAnswerTraditionQuestion({ mutation: { retry: false } });
  const { reset } = answer;

  useEffect(() => { reset(); }, [tradition, meaning, reset]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (answer.isPending) return;
    const text = question.trim();
    if (text.length < 2) { setValidation('Сұрағыңды кемінде екі таңбамен жаз.'); return; }
    setValidation('');
    const topic = tradition.trim();
    answer.mutate({ data: {
      question: text,
      ...(topic.length >= 2 && topic.length <= 160 ? { tradition: topic } : {}),
      ...(meaning ? { comicMeaning: meaning.slice(0, 2000) } : {}),
    } });
  };

  return (
    <section className="bg-qa rounded-[14px] border border-[#e3d2ef] p-3 dark:border-[var(--line)]" aria-labelledby={`${id}-title`} data-testid="section-tradition-question">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <h2 id={`${id}-title`} className="serif text-purple flex shrink-0 items-center gap-2 text-xl font-bold">
          <MessagesSquare size={26} aria-hidden="true" /> Білгің келсе, сұра!
        </h2>
        <p className="text-[12px] leading-snug opacity-85 sm:border-l sm:border-[var(--purple)]/40 sm:pl-3">Салт-дәстүр туралы сұрағың бар ма? Қызықтырған немесе түсінбеген нәрселерді осы жерден сұра. Біз саған қарапайым әрі түсінікті тілмен жауап береміз!</p>
      </div>
      <form onSubmit={submit} className="mt-2.5">
        <label htmlFor={id} className="sr-only">Сенің сұрағың</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="ref-input flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2">
            <CircleHelp size={20} className="text-purple shrink-0" aria-hidden="true" />
            <input id={id} type="text" value={question} maxLength={5000} disabled={answer.isPending}
              onChange={(e) => { setQuestion(e.target.value); setValidation(''); reset(); }}
              placeholder="Сұрағыңды осында жаз... Мысалы: Неліктен баланың тұсауын кеседі?"
              aria-invalid={Boolean(validation)} aria-describedby={validation ? `${id}-error` : undefined}
              className="min-h-10 min-w-0 flex-1 bg-transparent text-[13px] outline-none disabled:opacity-70" data-testid="input-tradition-question" />
          </div>
          <button type="submit" disabled={answer.isPending} className="btn-purple inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold hover:brightness-110 disabled:cursor-wait disabled:opacity-70" data-testid="button-submit-question">
            {answer.isPending ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
            {answer.isPending ? 'Күте тұр…' : 'Сұрақ қою'}
          </button>
        </div>
        {validation && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-[hsl(var(--destructive))]">{validation}</p>}
      </form>
      <div aria-live="polite" aria-busy={answer.isPending} className="ref-input mt-2 rounded-lg px-3 py-2 text-[12.5px]">
        <p className="flex items-center gap-2"><BookOpen size={16} className="text-purple" /><b>Сұрағыңа жауап:</b>
          {!answer.isSuccess && <span className="opacity-75">{answer.isPending ? 'Жауап дайындалып жатыр…' : answer.isError ? '' : 'Сұрағыңның жауабы осы жерде көрсетіледі.'}</span>}</p>
        {answer.isError && <p role="alert" className="mt-1 text-[hsl(var(--destructive))]">Жауап алу мүмкін болмады. «Сұрақ қою» батырмасын басып, қайталап көр.</p>}
        {answer.isSuccess && (
          <div className="mt-2 grid gap-2 sm:grid-cols-2" data-testid="text-question-answer">
            <section className="bg-qa rounded-lg p-2.5"><h3 className="text-purple mb-1 font-bold">Көркем жауап</h3><p className="content-copy leading-5" data-testid="text-literary-answer">{answer.data.answer}</p></section>
            <section className="rounded-lg border border-[var(--line)] p-2.5"><h3 className="text-purple mb-1 font-bold">Қарапайым сөзбен</h3><p className="content-copy leading-5" data-testid="text-simple-answer">{answer.data.simpleAnswer}</p></section>
          </div>
        )}
      </div>
    </section>
  );
}

import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGenerateTraditionComic, type TraditionComic } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowUpRight, BookOpen, Check, ChevronRight, CircleAlert, LoaderCircle, Sparkles } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [tradition, setTradition] = useState('');
  const [validationError, setValidationError] = useState('');
  const [comic, setComic] = useState<TraditionComic | null>(null);
  const generateComic = useGenerateTraditionComic();
  const ideas = ['Тұсаукесер', 'Бесікке салу', 'Наурыз көже', 'Шашу', 'Бата беру', 'Сүйінші', 'Қазақ дәстүрлерін сақтау'];

  const chooseTradition = (value: string) => {
    setTradition(value);
    setValidationError('');
    setComic(null);
    generateComic.reset();
  };

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const cleaned = tradition.trim();
    if (cleaned.length < 2) {
      setValidationError('Дәстүр атауын кемінде 2 әріппен жазыңыз.');
      return;
    }
    if (cleaned.length > 160) {
      setValidationError('Атауы 160 таңбадан аспауы керек.');
      return;
    }
    setValidationError('');
    setComic(null);
    generateComic.mutate(
      { data: { tradition: cleaned } },
      { onSuccess: setComic },
    );
  };

  return (
    <main className="page-shell">
      <div className="page-content mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <header className="flex items-center justify-between border-b border-[hsl(var(--border))] py-5">
          <div className="flex items-center gap-3" data-testid="brand-komekshi">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm">
              <BookOpen size={21} strokeWidth={2.1} />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[hsl(var(--background))] bg-[hsl(var(--accent))]" />
            </div>
            <div>
              <p className="serif text-lg font-semibold leading-tight tracking-tight">Әдет пен әңгіме</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">дәстүрді бірге танимыз</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/75 px-3.5 py-2 text-xs font-semibold text-[hsl(var(--muted-foreground))] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
            Үлкенге де, кішіге де
          </div>
        </header>

        <section className="grid gap-10 pb-12 pt-10 md:grid-cols-[.9fr_1.1fr] md:items-center md:gap-14 md:pb-16 md:pt-16">
          <div className="fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-3 py-1.5 text-xs font-bold text-[hsl(var(--primary))]">
              <Sparkles size={14} />
              Қазақы таным — жеңіл тілмен
            </div>
            <h1 className="serif max-w-xl text-[2.8rem] font-semibold leading-[1.04] tracking-[-.045em] text-[hsl(var(--foreground))] sm:text-6xl">
              Дәстүрдің мәнін <span className="relative whitespace-nowrap text-[hsl(var(--primary))]">оқиғаға <span className="absolute -bottom-1 left-0 h-[7px] w-full rounded-full bg-[hsl(var(--accent))]/55" /></span> айналдыр.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[hsl(var(--muted-foreground))] sm:text-lg">
              Бір дәстүрді таңдаңыз. Кішкентай Айша әжесінен немесе атасынан сұрап, оның мәнін әңгіме арқылы таниды.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-[hsl(var(--foreground))]">
              <div className="flex -space-x-2" aria-hidden="true">
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[hsl(var(--background))] bg-[#f2c879] text-xs">Ә</span>
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[hsl(var(--background))] bg-[#a9d7c8] text-xs">Б</span>
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[hsl(var(--background))] bg-[#edaa94] text-xs">А</span>
              </div>
              <span>Әңгіме бастауға бір қадам</span>
              <ArrowUpRight size={16} className="text-[hsl(var(--primary))]" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px] md:justify-self-end">
            <div className="absolute -right-6 -top-7 h-24 w-24 rounded-full border border-[hsl(var(--accent))]/40" />
            <div className="absolute -bottom-6 -left-7 h-20 w-20 rotate-12 rounded-[1.8rem] border border-[hsl(var(--primary))]/25" />
            <div className="comic-card relative overflow-hidden rounded-[1.7rem] p-3.5 sm:p-4">
              <div className="ornament h-2 rounded-full" />
              <div className="grid grid-cols-[1fr_86px] gap-3 p-3 sm:grid-cols-[1fr_110px] sm:p-4">
                <div className="flex min-h-[206px] flex-col justify-between rounded-[1.2rem] bg-[#e8f1df] p-5 sm:min-h-[230px] sm:p-6">
                  <span className="w-fit rounded-full bg-[hsl(var(--card))]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--primary))]">шағын көрініс</span>
                  <div>
                    <p className="serif text-2xl font-semibold leading-tight text-[#244b48] sm:text-3xl">«Әже, бұл дәстүрді неге сақтаймыз?»</p>
                    <p className="mt-3 max-w-[240px] text-sm leading-5 text-[#526d63]">«Балам, дәстүр — ұрпаққа жеткен ізгі аманат.»</p>
                  </div>
                </div>
                <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[1.2rem] bg-[#f1d795] p-2">
                  <div className="absolute -right-6 -top-5 h-24 w-24 rounded-full border-[12px] border-[#e6bd62]/45" />
                  <svg viewBox="0 0 120 110" className="relative w-full max-w-[108px]" role="img" aria-label="Айша әжесімен сөйлесіп отыр">
                    <path d="M7 105c1-23 12-35 29-35s28 12 29 35H7Z" fill="#528c79" />
                    <path d="M59 105c1-23 12-35 29-35s24 12 25 35H59Z" fill="#e8896e" />
                    <circle cx="36" cy="43" r="19" fill="#edbd9e" />
                    <circle cx="88" cy="43" r="19" fill="#f2c8a5" />
                    <path d="M17 41c0-18 10-29 23-27 11 1 17 10 16 22-7-7-14-9-23-8-4 7-9 11-16 13Z" fill="#e5e0d2" />
                    <path d="M70 40c2-15 12-23 21-22 11 0 18 8 19 21-8-6-14-8-22-8-5 5-10 8-18 9Z" fill="#51433a" />
                    <circle cx="30" cy="45" r="1.6" fill="#365854" /><circle cx="42" cy="45" r="1.6" fill="#365854" />
                    <circle cx="82" cy="45" r="1.6" fill="#365854" /><circle cx="94" cy="45" r="1.6" fill="#365854" />
                    <path d="M32 53q4 4 8 0M84 53q4 4 8 0" fill="none" stroke="#365854" strokeLinecap="round" strokeWidth="1.8" />
                    <path d="M60 28h34a8 8 0 0 1 8 8v4H66a7 7 0 0 1-7-7v-5Z" fill="#fffaf0" stroke="#528c79" strokeWidth="1.5" />
                    <circle cx="68" cy="35" r="1" fill="#528c79" /><circle cx="74" cy="35" r="1" fill="#528c79" /><circle cx="80" cy="35" r="1" fill="#528c79" />
                  </svg>
                  <span className="relative mt-1 rounded-full bg-white/70 px-2 py-1 text-[9px] font-bold text-[#365854]">Айша · Әже</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 pb-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">дәстүр • оқиға • ұрпақ</span>
                <span className="panel-number font-mono text-xs text-[hsl(var(--primary))]">01 / 03</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-7 border-t border-[hsl(var(--border))] pt-8 md:grid-cols-[.78fr_1.22fr] md:gap-10 md:pt-10" aria-label="Дәстүр таңдау және комикс">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[hsl(var(--primary))] text-xs font-bold text-[hsl(var(--primary-foreground))]">1</span>
              <h2 className="serif text-2xl font-semibold">Қай дәстүрді ашамыз?</h2>
            </div>
            <form onSubmit={handleSubmit} noValidate className="comic-card rounded-2xl p-4 sm:p-5">
              <label htmlFor="tradition-input" className="mb-2 block text-sm font-semibold">Дәстүр атауы</label>
              <div className={`rounded-xl border bg-[hsl(var(--background))] p-1 transition-colors focus-within:border-[hsl(var(--primary))] ${validationError ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--input))]'}`}>
                <textarea
                  id="tradition-input"
                  data-testid="input-tradition"
                  value={tradition}
                  onChange={(event) => { setTradition(event.target.value); setValidationError(''); }}
                  placeholder="Мысалы: тұсаукесер немесе дәстүрді сақтау"
                  rows={2}
                  maxLength={160}
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? 'tradition-error' : 'tradition-hint'}
                  className="block w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-[hsl(var(--muted-foreground))]/75"
                />
              </div>
              {validationError ? (
                <p id="tradition-error" data-testid="status-validation-error" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--destructive))]"><CircleAlert size={14} />{validationError}</p>
              ) : (
                <p id="tradition-hint" className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">2–160 таңба. Дайын үлгіден де таңдауға болады.</p>
              )}
              <button
                type="submit"
                data-testid="button-generate"
                disabled={generateComic.isPending}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))] disabled:cursor-wait disabled:opacity-75"
              >
                {generateComic.isPending ? <><LoaderCircle size={17} className="animate-spin" /> Әңгіме құрастырылып жатыр</> : <>Комикс-сценарий құрастыру <ChevronRight size={17} /></>}
              </button>
            </form>

            <div className="mt-5">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Бастауға болатын тақырыптар</p>
              <div className="flex flex-wrap gap-2">
                {ideas.map((idea) => (
                  <button
                    type="button"
                    key={idea}
                    data-testid={`button-idea-${idea}`}
                    onClick={() => chooseTradition(idea)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] ${tradition === idea ? 'border-[hsl(var(--primary))] bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]/75 text-[hsl(var(--foreground))]'}`}
                  >{tradition === idea && <Check size={12} className="mr-1 inline" />}{idea}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[hsl(var(--accent))] text-xs font-bold text-[hsl(var(--foreground))]">2</span>
                <h2 className="serif text-2xl font-semibold">Комикс-сценарий</h2>
              </div>
              {comic && <span className="rounded-full bg-[hsl(var(--secondary))] px-3 py-1 text-xs font-bold text-[hsl(var(--primary))]" data-testid="status-complete">Дайын</span>}
            </div>
            {generateComic.isPending ? (
              <div className="comic-card rounded-2xl p-5 sm:p-7" role="status" data-testid="status-loading">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><BookOpen size={19} /></span>
                  <div className="flex-1"><div className="skeleton-shimmer h-3 w-2/5 rounded-full" /><div className="skeleton-shimmer mt-2 h-2.5 w-1/4 rounded-full" /></div>
                </div>
                <div className="space-y-3"><div className="skeleton-shimmer h-3 w-full rounded-full" /><div className="skeleton-shimmer h-3 w-11/12 rounded-full" /><div className="skeleton-shimmer h-3 w-3/4 rounded-full" /></div>
                <p className="mt-5 text-sm text-[hsl(var(--muted-foreground))]">Дәстүрдің мәнін түсінікті оқиғаға айналдырып жатырмыз…</p>
              </div>
            ) : generateComic.isError ? (
              <div className="rounded-2xl border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 p-5 sm:p-7" role="alert" data-testid="status-api-error">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]"><CircleAlert size={18} /></span>
                  <div>
                    <h3 className="font-bold">Әңгіме әзірге жасалмады</h3>
                    <p className="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Байланыс үзілген болуы мүмкін. Қайта байқап көріңіз.</p>
                    <button type="button" data-testid="button-retry" onClick={() => handleSubmit()} className="mt-3 rounded-lg border border-[hsl(var(--destructive))]/35 px-3 py-2 text-sm font-bold text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/10">Қайта көру</button>
                  </div>
                </div>
              </div>
            ) : comic ? (
              <article className="comic-card fade-up overflow-hidden rounded-2xl" data-testid="content-comic">
                <div className="ornament h-2" />
                <div className="border-b border-[hsl(var(--border))] px-5 py-4 sm:px-7">
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">сіз таңдаған дәстүр</p>
                  <h3 className="serif mt-1 text-2xl font-semibold text-[hsl(var(--primary))]">{comic.title || tradition.trim()}</h3>
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                  {comic.panels.map((panel, index) => (
                    <section key={index} className={`rounded-xl border p-4 ${index % 2 === 0 ? 'border-[#d6e6d8] bg-[#f1f6ec]' : 'border-[#f0dfbd] bg-[#fbf4e5]'}`} aria-label={`Кадр ${index + 1}`}>
                      <span className="panel-number mb-3 inline-block text-[10px] font-bold uppercase tracking-[.15em] text-[hsl(var(--primary))]">Кадр {String(index + 1).padStart(2, '0')}</span>
                      <p className="mb-3 text-xs leading-5 text-[hsl(var(--muted-foreground))]">{panel.scene}</p>
                      <div className="mb-2 rounded-2xl rounded-bl-sm border border-[#e3d7c8] bg-white/85 px-3 py-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#b06a51]">Айша сұрайды</span>
                        <p className="mt-1 text-sm leading-6 text-[hsl(var(--foreground))]">«{panel.girlLine}»</p>
                      </div>
                      <div className="rounded-2xl rounded-br-sm border border-[#cddfd3] bg-[#e2efe5] px-3 py-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--primary))]">{comic.elderRole} жауап береді</span>
                        <p className="mt-1 text-sm leading-6 text-[hsl(var(--foreground))]">«{panel.elderLine}»</p>
                      </div>
                    </section>
                  ))}
                </div>
                <div className="mx-4 mb-4 rounded-xl bg-[hsl(var(--secondary))]/55 p-4 sm:mx-6 sm:mb-6 sm:p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Дәстүрдің мәні</p>
                  <p className="mt-2 text-sm leading-6 text-[hsl(var(--foreground))]">{comic.meaning}</p>
                  <p className="mt-3 border-t border-[hsl(var(--primary))]/15 pt-3 text-sm font-semibold leading-6 text-[hsl(var(--primary))]">{comic.closingQuestion}</p>
                </div>
                <div className="flex items-center gap-2 border-t border-[hsl(var(--border))] px-5 py-3 text-xs text-[hsl(var(--muted-foreground))] sm:px-7">
                  <Sparkles size={14} className="text-[hsl(var(--accent))]" /> Дәстүр туралы жаңа әңгіме осы жерден басталады.
                </div>
              </article>
            ) : (
              <div className="comic-card flex min-h-[250px] flex-col items-center justify-center rounded-2xl border-dashed px-6 py-10 text-center sm:min-h-[300px]" data-testid="status-empty">
                <div className="relative mb-4 grid h-16 w-16 place-items-center rounded-[1.35rem] bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]">
                  <BookOpen size={27} />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"><Sparkles size={11} /></span>
                </div>
                <h3 className="serif text-xl font-semibold">Әңгіме осында ашылады</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">Дәстүр атауын енгізіп, алғашқы комикс-сценарийіңізді құрастырыңыз.</p>
              </div>
            )}
          </div>
        </section>
        <footer className="mt-12 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-5 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
          <span>Әдет пен әңгіме · Дәстүрді ұрпаққа жақындатамыз</span>
          <span>Құрметпен, ықыласпен және түсінікті тілмен</span>
        </footer>
      </div>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGenerateTraditionComic } from '@workspace/api-client-react';
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
  const [comic, setComic] = useState('');
  const generateComic = useGenerateTraditionComic();
  const ideas = ['Тұсаукесер', 'Бесікке салу', 'Наурыз көже', 'Шашу', 'Бата беру', 'Сүйінші'];

  const chooseTradition = (value: string) => {
    setTradition(value);
    setValidationError('');
    setComic('');
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
    setComic('');
    generateComic.mutate(
      { data: { tradition: cleaned } },
      { onSuccess: (result) => setComic(result.content) },
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
              Бір дәстүрді таңдаңыз. Біз оның тарихы мен мағынасын шағын комикс-сценарий етіп түсіндіреміз.
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
                    <p className="serif text-3xl font-semibold leading-tight text-[#244b48] sm:text-4xl">«Алдымен<br />ақ тілегін айт…»</p>
                    <p className="mt-3 max-w-[220px] text-sm leading-5 text-[#526d63]">Әр дәстүрдің артында ұрпаққа жеткен бір ізгі ой бар.</p>
                  </div>
                </div>
                <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[1.2rem] bg-[#f1d795]">
                  <div className="absolute -right-6 -top-5 h-24 w-24 rounded-full border-[12px] border-[#e6bd62]/45" />
                  <div className="relative grid h-[88px] w-[72px] place-items-center rounded-t-[2.8rem] rounded-b-[1.8rem] border-2 border-[#365854] bg-[#9bcbb6] shadow-[inset_-8px_-5px_0_rgba(30,75,65,.1)]">
                    <div className="absolute top-8 flex gap-3"><i className="h-1.5 w-1.5 rounded-full bg-[#244b48]" /><i className="h-1.5 w-1.5 rounded-full bg-[#244b48]" /></div>
                    <div className="absolute bottom-5 h-2 w-4 rounded-full border-b-2 border-[#244b48]" />
                    <div className="absolute -top-2 h-5 w-16 rounded-full border-2 border-[#365854] bg-[#e8896e]" />
                  </div>
                  <div className="mt-3 h-1.5 w-14 rounded-full bg-[#4e7b6a]/35" />
                  <div className="mt-1.5 h-1.5 w-9 rounded-full bg-[#4e7b6a]/25" />
                  <div className="absolute bottom-4 right-4 h-5 w-5 rotate-45 border-2 border-[#365854]/50" />
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
                  placeholder="Мысалы: тұсаукесер"
                  rows={2}
                  maxLength={180}
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
                  <h3 className="serif mt-1 text-2xl font-semibold text-[hsl(var(--primary))]">{tradition.trim()}</h3>
                </div>
                <div className="space-y-3 p-4 sm:p-6">
                  {comic.split(/\n\s*\n/).filter((part) => part.trim()).map((part, index) => (
                    <div key={`${index}-${part.slice(0, 16)}`} className={`relative rounded-xl border p-4 sm:p-5 ${index % 2 === 0 ? 'border-[#d6e6d8] bg-[#f1f6ec]' : 'border-[#f0dfbd] bg-[#fbf4e5]'}`}>
                      <span className="panel-number mb-2 inline-block text-[10px] font-bold uppercase tracking-[.15em] text-[hsl(var(--primary))]">Көрініс {String(index + 1).padStart(2, '0')}</span>
                      <p className="content-copy text-sm leading-7 text-[hsl(var(--foreground))] sm:text-[15px]">{part.trim()}</p>
                    </div>
                  ))}
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

import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGenerateTraditionComic, type TraditionComic } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ComicCell, SpeechBubble } from '@/components/comic-cell';
import { ComicReflection } from '@/components/comic-reflection';
import { ComicAnswer } from '@/components/comic-answer';
import NotFound from '@/pages/not-found';
import { TraditionTopics } from '@/components/tradition-topics';
import { AiQuestion } from '@/components/ai-question';
import { FavoriteButton } from '@/components/favorite-button';
import { FavoritesList } from '@/components/favorites-list';
import { useTheme } from '@/hooks/use-theme';
import { useFavorites } from '@/hooks/use-favorites';
import { BookOpen, ChevronRight, CircleAlert, LoaderCircle, Moon, Sparkles, Sun } from 'lucide-react';
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
  const [comicTopic, setComicTopic] = useState('');
  const generateComic = useGenerateTraditionComic();
  const { theme, toggle: toggleTheme } = useTheme();
  const fav = useFavorites();
  const selectedTopic = tradition.trim();
  const comicMatches = Boolean(comic) && comicTopic === selectedTopic;

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
      { onSuccess: (result) => { setComic(result); setComicTopic(cleaned); } },
    );
  };

  return (
    <main className="page-shell">
      <div className="page-content mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <header className="flex items-center justify-between border-b border-[hsl(var(--border))] py-3">
          <div className="flex items-center gap-3" data-testid="brand-komekshi">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm">
              <BookOpen size={18} strokeWidth={2.1} />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[hsl(var(--background))] bg-[hsl(var(--accent))]" />
            </div>
            <div>
              <p className="serif text-base font-semibold leading-tight tracking-tight">Әдет пен әңгіме</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">дәстүрді бірге танимыз</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="button-theme-toggle"
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Күндізгі режимге ауысу' : 'Түнгі режимге ауысу'}
            onClick={toggleTheme}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-xs font-bold text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]"
          >
            {theme === 'dark' ? <><Moon size={15} /> Түн</> : <><Sun size={15} /> Күн</>}
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/75 px-3.5 py-2 text-xs font-semibold text-[hsl(var(--muted-foreground))] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
            Үлкенге де, кішіге де
          </div>
          </div>
        </header>

        <section className="pb-7 pt-6 md:pb-9 md:pt-8">
          <div className="fade-up mx-auto max-w-4xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-2.5 py-1 text-[11px] font-bold text-[hsl(var(--primary))]">
              <Sparkles size={14} />
              Қазақы таным — жеңіл тілмен
            </div>
            <h1 className="serif text-[1.75rem] font-semibold leading-[1.12] tracking-[-.035em] text-[hsl(var(--foreground))] sm:text-4xl lg:text-[2.7rem]">
              Қазақ халқының дәстүрлерін <span className="text-[hsl(var(--primary))]">комикс арқылы насихаттау</span>
            </h1>
          </div>
          <div className="fade-up mt-5 flex flex-col items-center gap-4" data-testid="content-hero-decoration">
            <svg aria-hidden="true" viewBox="0 0 180 32" className="h-7 w-44 text-[hsl(var(--primary))]/65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 16h29m118 0h29M39 16c-12-14-19-3-12 3 6 5 14-1 14-7M141 16c12-14 19-3 12 3-6 5-14-1-14-7M57 16c-17-20-28-3-16 5 9 6 21-2 16-12m66 7c17-20 28-3 16 5-9 6-21-2-16-12M65 16l14-10 11 10-11 10-14-10Zm50 0L101 6 90 16l11 10 14-10Z" />
            </svg>
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[hsl(var(--muted-foreground))]">Мұра · Өнеге · Ұрпақ</p>
            <a href="#comic-generator" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-bold text-[hsl(var(--primary-foreground))] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]">
              Комикс жасау <ChevronRight size={16} />
            </a>
          </div>
        </section>

        <section id="comic-generator" className="grid scroll-mt-5 gap-5 border-t border-[hsl(var(--border))] pt-6" aria-label="Дәстүр таңдау және комикс">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[hsl(var(--primary))] text-xs font-bold text-[hsl(var(--primary-foreground))]">1</span>
              <h2 className="serif text-xl font-semibold">Қай дәстүрді ашамыз?</h2>
            </div>
            <form onSubmit={handleSubmit} noValidate className="comic-card rounded-2xl p-3 sm:p-4">
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
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-3 py-2.5 text-sm font-bold text-[hsl(var(--primary-foreground))] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))] disabled:cursor-wait disabled:opacity-75"
              >
                {generateComic.isPending ? <><LoaderCircle size={17} className="animate-spin" /> Комикс жасалып жатыр</> : <>Комикс жасау <ChevronRight size={17} /></>}
              </button>
            </form>

            <div className="mt-5">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Бастауға болатын тақырыптар</p>
              <TraditionTopics selected={tradition} onChoose={chooseTradition} />
            </div>
            <FavoritesList favorites={fav.favorites} error={fav.error} selected={tradition} onSelect={chooseTradition} onRemove={fav.remove} />
          </div>

          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[hsl(var(--accent))] text-xs font-bold text-[hsl(var(--foreground))]">2</span>
                <h2 className="serif text-xl font-semibold">Комикс</h2>
              </div>
              <div className="flex items-center gap-2">
              {selectedTopic.length >= 2 && !comic && <FavoriteButton testId="button-favorite-selected" active={fav.isFavorite(selectedTopic)} label={selectedTopic} onToggle={() => fav.toggle(selectedTopic)} />}
              {comic && <span className="rounded-full bg-[hsl(var(--secondary))] px-3 py-1 text-xs font-bold text-[hsl(var(--primary))]" data-testid="status-complete">Дайын</span>}
              </div>
            </div>
            {generateComic.isPending ? (
              <div className="comic-card rounded-2xl p-5 sm:p-7" role="status" data-testid="status-loading">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><BookOpen size={19} /></span>
                  <div className="flex-1"><div className="skeleton-shimmer h-3 w-2/5 rounded-full" /><div className="skeleton-shimmer mt-2 h-2.5 w-1/4 rounded-full" /></div>
                </div>
                <div className="space-y-3"><div className="skeleton-shimmer h-3 w-full rounded-full" /><div className="skeleton-shimmer h-3 w-11/12 rounded-full" /><div className="skeleton-shimmer h-3 w-3/4 rounded-full" /></div>
                <p className="mt-5 text-sm text-[hsl(var(--muted-foreground))]">Үш кадрдың суреті мен кейіпкерлердің диалогы жасалып жатыр…</p>
              </div>
            ) : generateComic.isError ? (
              <div className="rounded-2xl border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 p-5 sm:p-7" role="alert" data-testid="status-api-error">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]"><CircleAlert size={18} /></span>
                  <div>
                    <h3 className="font-bold">Әңгіме әзірге жасалмады</h3>
                    <p className="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Суретті комикс әзірге жасалмады. Қайта байқап көріңіз.</p>
                    <button type="button" data-testid="button-retry" onClick={() => handleSubmit()} className="mt-3 rounded-lg border border-[hsl(var(--destructive))]/35 px-3 py-2 text-sm font-bold text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/10">Қайта көру</button>
                  </div>
                </div>
              </div>
            ) : comic ? (
              <article className="comic-card fade-up overflow-hidden rounded-2xl" data-testid="content-comic">
                <div className="ornament h-2" />
                <div className="border-b border-[hsl(var(--border))] px-5 py-4 sm:px-7">
                  <div className="flex items-start justify-between gap-3">
                  <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">сіз таңдаған дәстүр</p>
                  <h3 className="serif mt-1 text-xl font-semibold text-[hsl(var(--primary))]" data-testid="text-comic-title">{comic.title || comicTopic}</h3>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]" data-testid="text-comic-characters">Кейіпкерлер: {comic.childName} және {comic.elderRole.toLocaleLowerCase('kk-KZ')}</p>
                  </div>
                  <FavoriteButton testId="button-favorite-comic" active={fav.isFavorite(comicTopic)} label={comicTopic} onToggle={() => fav.toggle(comicTopic)} />
                  </div>
                </div>
                <div className="grid grid-cols-[repeat(3,minmax(260px,1fr))] gap-3 overflow-x-auto p-3 sm:p-4" tabIndex={0} aria-label="Үш кадрлы комикс, көлденең айналдыру">
                  {comic.panels.map((panel, index) => (
                    <section key={index} className="w-full" aria-label={`Кадр ${index + 1}`}>
                      <ComicCell
                        src={`data:${comic.comicImageMimeType};base64,${comic.comicImageData}`}
                        index={index}
                        alt={`Комикстің ${index + 1}-кадрындағы сурет`}
                        testId={`img-comic-panel-${index + 1}`}
                        dialogue={<>
                          <SpeechBubble who={comic.childName} text={panel.girlLine} tone="girl" />
                          <SpeechBubble who={comic.elderRole} text={panel.elderLine} tone="elder" />
                        </>}
                        badge={<span className="absolute bottom-2 left-2 rounded-full comic-badge border px-2 py-0.5 text-[10px] font-bold text-[hsl(var(--primary))]">{String(index + 1).padStart(2, '0')}</span>}
                      />
                    </section>
                  ))}
                </div>
                <div className="mx-4 mb-4 sm:mx-6 sm:mb-6">
                  <ComicReflection tradition={comic.title || comicTopic} meaning={comic.meaning} question={comic.closingQuestion} />
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
                <h3 className="serif text-xl font-semibold">Суретті комикс осында шығады</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">Дәстүрді таңдап, «Комикс жасау» батырмасын басыңыз: бала мен үлкеннің әңгімесі үш кадрлы суретті комикс болып шығады.</p>
              </div>
            )}
          </div>
        </section>
        <div className="mt-5">
          <ComicAnswer />
          <AiQuestion tradition={selectedTopic} meaning={comicMatches && comic ? comic.meaning : undefined} />
        </div>
        <footer className="mt-8 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
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

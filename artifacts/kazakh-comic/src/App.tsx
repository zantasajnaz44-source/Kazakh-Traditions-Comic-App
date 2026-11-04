import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGenerateTraditionComic, type TraditionComic } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ComicCell, SpeechBubble } from '@/components/comic-cell';
import { ComicReflection } from '@/components/comic-reflection';
import { ComicAnswer } from '@/components/comic-answer';
import { ComicCopyActions } from '@/components/comic-copy-actions';
import { TraditionQuestion } from '@/components/tradition-question';
import NotFound from '@/pages/not-found';
import { TraditionTopics } from '@/components/tradition-topics';
import { FavoriteButton } from '@/components/favorite-button';
import { FavoritesList } from '@/components/favorites-list';
import { useTheme } from '@/hooks/use-theme';
import { useFavorites } from '@/hooks/use-favorites';
import { BookOpen, ChevronDown, ChevronRight, CircleAlert, Layers, LoaderCircle, Moon, Sparkles, Sun, Users } from 'lucide-react';
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

  const base = import.meta.env.BASE_URL;
  const comicView = comic ? (
    <article className="ref-card fade-up overflow-hidden" data-testid="content-comic">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] opacity-70">сіз таңдаған дәстүр</p>
          <h3 className="serif ref-teal mt-0.5 text-xl font-semibold" data-testid="text-comic-title">{comic.title || comicTopic}</h3>
          <p className="mt-0.5 text-xs opacity-75" data-testid="text-comic-characters">Кейіпкерлер: {comic.childName} және {comic.elderRole.toLocaleLowerCase('kk-KZ')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-tgreen rounded-full px-3 py-1 text-xs font-bold" data-testid="status-complete">Дайын</span>
          <FavoriteButton testId="button-favorite-comic" active={fav.isFavorite(comicTopic)} label={comicTopic} onToggle={() => fav.toggle(comicTopic)} />
        </div>
      </div>
      <div className="px-4 pt-3"><ComicCopyActions key={`${comicTopic}-${comic.comicImageData.length}`} comic={comic} /></div>
      <div className="grid grid-cols-[repeat(3,minmax(260px,1fr))] gap-3 overflow-x-auto p-3" tabIndex={0} aria-label="Үш кадрлы комикс, көлденең айналдыру">
        {comic.panels.slice(0, 3).map((panel, index) => (
          <section key={index} className="w-full" aria-label={`Кадр ${index + 1}`}>
            <ComicCell src={`data:${comic.comicImageMimeType};base64,${comic.comicImageData}`} index={index} alt={`Комикстің ${index + 1}-кадрындағы сурет`} testId={`img-comic-panel-${index + 1}`}
              dialogue={<><SpeechBubble who={comic.childName} text={panel.girlLine} tone="girl" /><SpeechBubble who={comic.elderRole} text={panel.elderLine} tone="elder" /></>}
              badge={<span className="absolute bottom-2 left-2 rounded-full comic-badge border px-2 py-0.5 text-[10px] font-bold">{String(index + 1).padStart(2, '0')}</span>} />
          </section>
        ))}
      </div>
      <div className="mx-3 mb-3"><ComicReflection tradition={comic.title || comicTopic} meaning={comic.meaning} question={comic.closingQuestion} /></div>
    </article>
  ) : null;

  return (
    <main className="ref-page flex min-h-[100dvh] flex-col">
      <header className="relative flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-2 sm:px-8">
        <Corner className="pointer-events-none absolute left-0 top-0 hidden h-12 w-12 sm:block" />
        <div className="flex items-center gap-3 sm:pl-8" data-testid="brand-komekshi">
          <span className="btn-teal grid h-10 w-10 shrink-0 place-items-center rounded-lg"><BookOpen size={22} /></span>
          <div className="sm:border-r sm:border-[var(--line)] sm:pr-5">
            <p className="serif ref-ink text-xl font-bold leading-tight">Әдет пен әңгіме</p>
            <p className="ref-teal text-[12.5px] font-medium">Дәстүрді бірге танып-білеміз!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" data-testid="button-theme-toggle" aria-pressed={theme === 'dark'} aria-label={theme === 'dark' ? 'Күндізгі режимге ауысу' : 'Түнгі режимге ауысу'} onClick={toggleTheme}
            className="ref-input inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-medium hover:border-[var(--teal)]">
            {theme === 'dark' ? <><Moon size={16} className="text-[#d6a83a]" /> Түнгі режим</> : <><Sun size={16} className="text-[#e5a21f]" /> Күндізгі режим</>}
          </button>
          <details className="relative hidden sm:block" data-testid="details-audience">
            <summary className="ref-input flex min-h-9 cursor-pointer list-none items-center gap-2 rounded-lg px-3 text-[12.5px] font-medium"><Users size={16} className="ref-teal" />Балалар мен ересектерге арналған<ChevronDown size={14} /></summary>
            <div className="ref-card absolute right-0 z-20 mt-1 w-72 p-3 text-[12px] leading-5 shadow-lg">Комикстер балаларға түсінікті тілмен жазылады, ал ата-аналар мен ұстаздар оларды отбасылық әңгімеге немесе сабаққа пайдалана алады.</div>
          </details>
        </div>
      </header>

      <section className="hero-band relative overflow-hidden">
        <img src={`${base}reference-yurt.png`} alt="" aria-hidden="true" className="fade-l absolute bottom-0 left-0 hidden h-full w-auto max-w-[30%] object-cover lg:block" />
        <img src={`${base}reference-family.png`} alt="" aria-hidden="true" className="fade-r absolute bottom-0 right-0 hidden h-full w-auto max-w-[36%] object-cover lg:block" />
        <div className="fade-up relative mx-auto flex max-w-[760px] flex-col items-center px-4 py-3 text-center">
          <span className="bg-tgreen ref-ink inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[12px] font-medium"><Sparkles size={13} className="text-[#7a9b2a]" />Қазақы таным – түсінікті тілмен</span>
          <h1 className="serif ref-ink mt-1.5 text-[1.6rem] font-bold leading-[1.1] sm:text-[2.1rem]">Қазақ халқының салт-дәстүрлерін <span className="ref-teal block">комикс арқылы танып-білу</span></h1>
          <p className="mt-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.25em] opacity-80"><Rule />Мұра · Өнеге · Ұрпақ<Rule /></p>
          <a href="#comic-generator" className="btn-teal mt-2 inline-flex min-h-9 items-center gap-2 rounded-lg px-8 text-sm font-bold hover:brightness-110">Комикс жасау <ChevronRight size={16} /></a>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 gap-4 px-3 py-2 sm:px-6 lg:grid-cols-[40%_1fr]">
        <section id="comic-generator" className="flex min-w-0 scroll-mt-4 flex-col gap-2.5" aria-label="Дәстүр таңдау және комикс">
          <div className="flex items-center gap-2"><span className="btn-teal grid h-6 w-6 place-items-center rounded-full text-xs font-bold">1</span><h2 className="serif ref-ink text-lg font-bold">Қай дәстүрмен танысамыз?</h2></div>
          <form onSubmit={handleSubmit} noValidate className="ref-card p-3">
            <label htmlFor="tradition-input" className="mb-1.5 block text-[13px] font-semibold">Дәстүрдің атауы</label>
            <textarea id="tradition-input" data-testid="input-tradition" value={tradition} onChange={(e) => { setTradition(e.target.value); setValidationError(''); }}
              placeholder="Мысалы: шілдехана, бесікке салу немесе тұсаукесер" rows={1} maxLength={160} aria-invalid={Boolean(validationError)} aria-describedby={validationError ? 'tradition-error' : 'tradition-hint'}
              className={`ref-input block w-full resize-none rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[var(--teal)] ${validationError ? '!border-[hsl(var(--destructive))]' : ''}`} />
            {validationError ? <p id="tradition-error" data-testid="status-validation-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-[hsl(var(--destructive))]"><CircleAlert size={14} />{validationError}</p>
              : <p id="tradition-hint" className="mt-1.5 text-[11.5px] leading-snug opacity-75">Дәстүр атауын енгізіңіз немесе төменде ұсынылған дайын тақырыптардың бірін таңдаңыз. Мәтін ұзындығы 2–160 таңба аралығында.</p>}
            <button type="submit" data-testid="button-generate" disabled={generateComic.isPending} className="btn-teal mt-2 flex min-h-9 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold hover:brightness-110 disabled:cursor-wait disabled:opacity-75">
              {generateComic.isPending ? <><LoaderCircle size={16} className="animate-spin" /> Комикс жасалып жатыр</> : <>Комикс жасау <ChevronRight size={16} /></>}
            </button>
          </form>
          <FavoritesList favorites={fav.favorites} error={fav.error} selected={tradition} onSelect={chooseTradition} onRemove={fav.remove} />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e8892f] text-xs font-bold text-white">2</span><h2 className="serif ref-ink text-lg font-bold">Комикс</h2></div>
            {!comic && <FavoriteButton testId="button-favorite-selected" active={fav.isFavorite(selectedTopic)} label={selectedTopic} disabled={selectedTopic.length < 2 || selectedTopic.length > 160} onToggle={() => fav.toggle(selectedTopic)} />}
          </div>
          {generateComic.isPending ? (
            <div className="ref-card p-4" role="status" data-testid="status-loading">
              <div className="space-y-2.5"><div className="skeleton-shimmer h-3 w-2/5 rounded-full" /><div className="skeleton-shimmer h-3 w-full rounded-full" /><div className="skeleton-shimmer h-3 w-3/4 rounded-full" /></div>
              <p className="mt-3 text-[13px] opacity-75">Үш кадрдың суреті мен кейіпкерлердің диалогы жасалып жатыр…</p>
            </div>
          ) : generateComic.isError ? (
            <div className="rounded-[14px] border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 p-4" role="alert" data-testid="status-api-error">
              <h3 className="font-bold">Әңгіме әзірге жасалмады</h3>
              <p className="mt-1 text-[13px] opacity-80">Суретті комикс әзірге жасалмады. Қайта байқап көріңіз.</p>
              <button type="button" data-testid="button-retry" onClick={() => handleSubmit()} className="mt-2 rounded-lg border border-[hsl(var(--destructive))]/35 px-3 py-1.5 text-sm font-bold text-[hsl(var(--destructive))]">Қайта көру</button>
            </div>
          ) : comic ? (
            <a href="#comic-result" className="ref-card block p-3 text-[13px] font-semibold ref-teal" data-testid="link-comic-result">Комикс дайын — төменде көріңіз <ChevronDown size={14} className="inline" /></a>
          ) : (
            <div className="ref-card flex flex-col items-center gap-3 p-3 sm:flex-row" data-testid="status-empty">
              <img src={`${base}reference-comic-placeholder.png`} alt="" aria-hidden="true" className="w-[180px] shrink-0" />
              <div className="sm:border-l sm:border-[var(--line)] sm:pl-3">
                <h3 className="serif ref-teal text-base font-bold">Комикс осы жерде көрсетіледі</h3>
                <p className="mt-1 text-[11.5px] leading-snug opacity-80">Өзіңізді қызықтырған салт-дәстүрді таңдап, «Комикс жасау» батырмасын басыңыз. Таңдалған дәстүр бала мен ересек адамның әңгімесі арқылы үш кадрдан тұратын суретті комикс түрінде ұсынылады.</p>
                <p className="mt-1 text-[11.5px] leading-snug opacity-80">Комикс арқылы дәстүрдің шығу тарихымен, орындалу ерекшеліктерімен және тәрбиелік мәнімен танысасыз.</p>
              </div>
            </div>
          )}
        </section>

        <div className="flex min-w-0 flex-col gap-2.5">
          <div className="ref-card p-2.5 !border-transparent !bg-transparent !p-0">
            <p className="mb-2 flex items-center justify-center gap-2 text-[13px] font-extrabold uppercase tracking-wide"><Rule /><Layers size={15} />Таңдауға болатын салт-дәстүрлер<Rule /></p>
            <TraditionTopics selected={tradition} onChoose={chooseTradition} />
          </div>
          <TraditionQuestion tradition={selectedTopic} meaning={comic && comicTopic === selectedTopic ? comic.meaning : undefined} />
          <ComicAnswer />
        </div>
      </div>

      {comicView && <section id="comic-result" className="mx-auto w-full max-w-[1600px] scroll-mt-4 px-3 pb-4 sm:px-6">{comicView}</section>}

      <footer className="ref-footer relative mt-2 flex flex-col items-center justify-center gap-2 px-14 py-3 text-center text-[13px] sm:flex-row sm:gap-10">
        <Corner className="pointer-events-none absolute bottom-0 left-0 h-10 w-10 -scale-y-100" gold />
        <Corner className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 -scale-100" gold />
        <span className="flex items-center gap-2"><BookOpen size={17} />Әдет пен әңгіме · Ұлттық дәстүрді жас ұрпаққа танытамыз</span>
        <span className="hidden h-5 w-px bg-white/40 sm:block" />
        <span className="flex items-center gap-2"><Sparkles size={16} className="text-[#e3b94f]" />Ұлттық мұраға құрмет, дәстүрге адалдық – бәрімізге ортақ міндет!</span>
      </footer>
    </main>
  );
}

function Rule() {
  return <svg aria-hidden="true" viewBox="0 0 60 10" className="h-2.5 w-12 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M0 5h40m4 0 5-4 5 4-5 4-5-4Z" /></svg>;
}

function Corner({ className, gold }: { className?: string; gold?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={className} fill="none" stroke={gold ? '#d7b155' : 'var(--teal)'} strokeWidth="2" strokeLinecap="round">
      <path d="M2 2h30M2 2v30M2 14c10 0 14 4 14 14M14 2c0 10 4 14 14 14M20 20c4-6 12-6 12 0s-8 6-8 0" />
    </svg>
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

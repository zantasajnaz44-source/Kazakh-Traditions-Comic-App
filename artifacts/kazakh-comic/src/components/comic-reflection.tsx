type ComicReflectionProps = {
  tradition: string;
  meaning: string;
  question?: string;
};

export function ComicReflection({ tradition, meaning, question }: ComicReflectionProps) {
  const familyQuestion = /тұсау/i.test(tradition)
    ? 'Сен кішкентай кезіңде тұсаукесер тойың болғанын білесің бе?'
    : /бесік/i.test(tradition)
      ? 'Сені кішкентай кезіңде бесікке салғанын білесің бе?'
      : `Отбасыңда «${tradition}» дәстүрі қалай орындалады?`;

  return (
    <section className="rounded-xl bg-[hsl(var(--secondary))]/60 p-3 sm:p-4" aria-label="Дәстүрдің мәні және тапсырма">
      <h3 className="serif text-xl font-semibold text-[hsl(var(--primary))]">Дәстүрдің мәні</h3>
      <p className="mt-1.5 text-sm leading-6">{meaning}</p>
      <div className="mt-3 border-t border-[hsl(var(--primary))]/20 pt-3">
        <h4 className="text-base font-bold text-[hsl(var(--primary))]">{familyQuestion}</h4>
        <p className="mt-2 text-sm font-semibold">Ата-анаңнан сұрап, жауабыңды жаз:</p>
        <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-[13px] leading-5">
          <li>Бұл дәстүр сенің отбасыңда өткізілді ме? Өткізілсе, қалай өтті және кімдер қатысты? Өткізілмесе, неліктен?</li>
          <li>Ата-анаң не айтып берді? Есіңде қалған қызықты мәліметті жаз.</li>
          <li>Осы дәстүрдің мәнін қалай түсіндің? Оны сақтау неліктен маңызды деп ойлайсың?</li>
        </ol>
        {question && !/тұсау|бесік/i.test(tradition) && (
          <p className="mt-4 text-sm font-semibold leading-6 text-[hsl(var(--primary))]">{question}</p>
        )}
      </div>
    </section>
  );
}

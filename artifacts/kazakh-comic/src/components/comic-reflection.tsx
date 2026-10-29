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
    <section className="rounded-xl bg-[hsl(var(--secondary))]/60 p-5 sm:p-6" aria-label="Дәстүрдің мәні және тапсырма">
      <h3 className="serif text-2xl font-semibold text-[hsl(var(--primary))]">Дәстүрдің мәні</h3>
      <p className="mt-2 text-base leading-7">{meaning}</p>
      <div className="mt-5 border-t border-[hsl(var(--primary))]/20 pt-5">
        <h4 className="text-lg font-bold text-[hsl(var(--primary))]">{familyQuestion}</h4>
        <p className="mt-3 font-semibold">Ата-анаңнан сұрап, жауабыңды жаз:</p>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6">
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

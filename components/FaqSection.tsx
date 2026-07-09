import { FaqItem } from "@/lib/posts";

export default function FaqSection({ items }: { items: FaqItem[] }) {
  if (!items || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="mt-16 pt-10 border-t border-ink/10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="font-serif text-xl font-bold mb-5">よくある質問</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="border border-ink/10 bg-washi-warm p-5">
            <p className="font-serif font-bold text-sm mb-2">
              <span className="text-yamabuki-deep mr-2">Q.</span>
              {item.q}
            </p>
            <p className="text-sm text-ink-soft leading-loose">
              <span className="text-yamabuki-deep mr-2 font-bold">A.</span>
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

type ConclusionBoxProps = {
  items: string[];
};

export default function ConclusionBox({ items }: ConclusionBoxProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8 border-l-4 border-yamabuki bg-yamabuki/10 px-5 py-4">
      <p className="text-xs font-bold text-indigo-deep tracking-wide mb-2">
        結論:まずここだけ読めばOK
      </p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed flex gap-2">
            <span className="text-yamabuki-deep font-bold shrink-0">
              {i + 1}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-ink-soft mt-3">
        詳しい手順・原因は、この下で解説しています。
      </p>
    </div>
  );
}

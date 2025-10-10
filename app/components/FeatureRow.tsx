type Props = { title: string; desc: string; bullet: string[]; reverse?: boolean; };

export default function FeatureRow({ title, desc, bullet, reverse }: Props) {
  return (
    <section className="py-10">
      <div className={`mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="glass p-5 h-56 rounded-2xl" />
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-zinc-300/90 mt-2">{desc}</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300/90 list-disc list-inside">
            {bullet.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

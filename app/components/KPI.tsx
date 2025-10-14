export default function KPI({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-zinc-400">{label}{sub ? ` • ${sub}` : ""}</div>
    </div>
  );
}

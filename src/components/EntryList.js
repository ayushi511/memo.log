import { categoryStyles } from "@/lib/categoryStyles";
import { fieldsConfig } from "@/lib/fieldsConfig";

function renderValue(category, key, val) {
  const fieldDef = fieldsConfig[category]?.find((f) => f.name === key);
  if (!val) return null;
  if (fieldDef?.type === "rating") {
    const n = parseInt(val) || 0;
    return (
      <p key={key} className="text-sm text-ink/80 mb-2">
        <span className="text-butter">{"★".repeat(n)}</span>
        <span className="text-ink/20">{"★".repeat(5 - n)}</span>
      </p>
    );
  }
  return (
    <div key={key} className="mb-2">
      {fieldDef?.label && <p className="text-xs font-semibold text-ink/40">{fieldDef.label}</p>}
      <p className="text-sm text-ink/80">{val}</p>
    </div>
  );
}

export default function EntryList({ entries, loading, category }) {
  const style = categoryStyles[category] || { bgLight: "bg-white/50", pastLabel: "Past entries" };

  return (
    <div>
      <h3 className="font-display text-lg mb-4 text-ink/80">{style.pastLabel}</h3>
      {loading && <p className="text-ink/40 text-sm">Loading...</p>}
      {!loading && entries.length === 0 && (
        <p className="text-ink/50 text-sm">No entries yet — write your first one above. 🌱</p>
      )}
      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className={`${style.bgLight} rounded-xl p-4`}>
            <p className="text-xs text-ink/40 mb-2">{entry.date}</p>
            {entry.imageUrl && (
              <img src={entry.imageUrl} alt="" className="rounded-lg mb-2 max-h-56 w-full object-contain bg-white/40" />
            )}
            {Object.entries(entry.fields || {}).map(([key, val]) => renderValue(category, key, val))}
          </div>
        ))}
      </div>
    </div>
  );
}
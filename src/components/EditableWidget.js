"use client";
import { useState, useEffect } from "react";

export default function EditableWidget({ icon, title, value, onSave, placeholder, multiline = false }) {
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  function handleBlur() {
    if (text !== value) onSave(text);
  }

  const Field = multiline ? "textarea" : "input";

  return (
    <div>
      <p className="font-semibold text-sm mb-2">{icon} {title}</p>
      <Field
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={multiline ? 2 : undefined}
        className="w-full bg-transparent text-sm text-ink/80 placeholder:text-ink/40 focus:outline-none resize-none border-b border-transparent focus:border-ink/20"
      />
    </div>
  );
}
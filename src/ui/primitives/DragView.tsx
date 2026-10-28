import { useState } from "react";
import type { DragPrimitive } from "../../schemas/primitive.js";

interface Props {
  primitive: DragPrimitive;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled: boolean;
  showResult: boolean;
}

export function DragView({ primitive, value, onChange, disabled, showResult }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const assign = (targetId: string, itemId: string | null) => {
    if (disabled) return;
    const next: Record<string, string> = { ...value };
    for (const [key, assigned] of Object.entries(next)) {
      if (assigned === itemId) delete next[key];
    }
    if (itemId) next[targetId] = itemId;
    else delete next[targetId];
    onChange(next);
    setSelected(null);
  };

  const assignedItems = new Set(Object.values(value));

  return (
    <div className={`drag-widget${showResult ? " is-locked" : ""}`}>
      <p className="drag-help">Drag an item onto a target, or select an item and then a target.</p>
      <div className="drag-palette" role="group" aria-label="Items">
        {primitive.items.map((item) => {
          const assigned = assignedItems.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              draggable={!disabled && !assigned}
              className={`drag-item${selected === item.id ? " is-selected" : ""}${assigned ? " is-assigned" : ""}`}
              aria-pressed={selected === item.id}
              disabled={disabled || assigned}
              onClick={() => setSelected(selected === item.id ? null : item.id)}
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", item.id);
                event.dataTransfer.effectAllowed = "move";
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="drag-targets">
        {primitive.targets.map((target) => {
          const assignedId = value[target.id];
          const assignedItem = primitive.items.find((item) => item.id === assignedId);
          return (
            <div
              key={target.id}
              className={`drag-target${assignedId ? " has-item" : ""}`}
              onDragOver={(event) => {
                if (!disabled) event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                const itemId = event.dataTransfer.getData("text/plain");
                if (itemId) assign(target.id, itemId);
              }}
            >
              <span className="drag-target-label">{target.label}</span>
              <button
                type="button"
                className="drag-slot"
                onClick={() => {
                  if (disabled) return;
                  if (selected) assign(target.id, selected);
                  else if (assignedId) assign(target.id, null);
                }}
                aria-label={
                  assignedItem
                    ? `${target.label}: ${assignedItem.label}. Activate to clear.`
                    : `${target.label}: empty. Select an item first.`
                }
                disabled={disabled}
              >
                {assignedItem ? assignedItem.label : "Drop here"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

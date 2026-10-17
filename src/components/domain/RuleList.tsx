import { useId, useState } from 'react';
import type { RuleBook, RuleItem, RuleSection } from '@/data/rules/types';
import { formatSource } from '@/logic/ruleFilter';

// Static tag lookup: Tailwind never generates classes built from variables
const BOOK_TAGS: Partial<Record<RuleBook, string>> = { cc: 'C&C', he: 'HE' };
const BOOK_TAG_CLASS = 'inline-block mr-1 px-1 rounded bg-neutral-800 text-[10px] font-bold uppercase tracking-wide text-neutral-400';

interface RuleListProps {
  items: readonly RuleItem[];
  // Checkboxes for the setup list: local state only, reset on reload (r156).
  checkable?: boolean;
  // Marks items from the mini expansions (C&C / HE) with a tag before the text.
  expansionTag?: boolean;
}

// One rule paraphrase with its source. The text is the label of the checkbox,
// so the whole item is clickable.
export function RuleList({ items, checkable = false, expansionTag = false }: RuleListProps) {
  const listId = useId();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleChecked = (id: string) => {
    setChecked((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const tag = expansionTag ? BOOK_TAGS[item.source.book] : undefined;
        const text = (
          <>
            {tag !== undefined && <span className={BOOK_TAG_CLASS}>{tag}</span>}
            {item.text}{' '}
            <span className="text-xs text-neutral-500">{formatSource(item.source)}</span>
          </>
        );
        return (
          <li key={item.id} className="text-sm text-neutral-300 leading-relaxed">
            {checkable ? (
              <label htmlFor={`${listId}-${item.id}`} className="flex items-start gap-2 cursor-pointer">
                <input
                  id={`${listId}-${item.id}`}
                  type="checkbox"
                  checked={checked.has(item.id)}
                  onChange={() => toggleChecked(item.id)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-blue-400"
                />
                <span>{text}</span>
              </label>
            ) : (
              text
            )}
          </li>
        );
      })}
    </ul>
  );
}

interface RuleSectionsProps {
  sections: readonly RuleSection[];
  checkable?: boolean;
  expansionTag?: boolean;
}

export function RuleSections({ sections, checkable = false, expansionTag = false }: RuleSectionsProps) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <section key={section.id}>
          <h3 className="text-base font-bold text-neutral-200 mb-2">{section.title}</h3>
          <RuleList items={section.items} checkable={checkable} expansionTag={expansionTag} />
        </section>
      ))}
    </div>
  );
}

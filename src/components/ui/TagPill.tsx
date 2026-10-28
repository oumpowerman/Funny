import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { isStagingTagId } from '../../services/seedData';
import { CategoryTag } from '../../types/tag.types';

interface TagPillProps {
  tag: CategoryTag | undefined;
  parentTag?: CategoryTag | undefined;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  count?: number;
  showEntityIcon?: boolean;
  showParent?: boolean;
  size?: 'sm' | 'md';
  activeLayoutId?: string;
}

const COLOR_TEXT_MAP: Record<string, string> = {
  blue: 'text-sky-800',
  emerald: 'text-emerald-800',
  amber: 'text-amber-800',
  purple: 'text-purple-800',
  rose: 'text-rose-800',
  cyan: 'text-cyan-800',
  indigo: 'text-indigo-800',
  slate: 'text-slate-700',
};

export const getEntityIcon = (tag: CategoryTag): string => {
  if (isStagingTagId(tag.id) || tag.groupType === 'STAGING') return '📥';
  if (tag.entityType === 'PERSON' || tag.groupType === 'PERSON') return '👤';
  if (tag.entityType === 'ANIMAL') return '🐾';
  if (tag.entityType === 'TOPIC') return '🎯';
  if (tag.groupType === 'ACTION') return '⚡';
  return '🏷️';
};

export const TagPill: React.FC<TagPillProps> = ({
  tag,
  parentTag,
  selected = false,
  onClick,
  onRemove,
  count,
  showEntityIcon = true,
  showParent = false,
  size = 'sm',
  activeLayoutId,
}) => {
  if (!tag) return null;

  const textColor = COLOR_TEXT_MAP[tag.color] || 'text-slate-700';
  const icon = showEntityIcon ? getEntityIcon(tag) : null;
  const isStaging = isStagingTagId(tag.id) || tag.groupType === 'STAGING';
  const isSubcategory = tag.tier === 2 || !!tag.parentId;
  const paddingClass = size === 'md' ? 'px-3.5 py-1.5 text-sm' : 'px-3 py-1 text-xs';

  if (onClick || onRemove) {
    return (
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        onClick={onClick}
        className={`relative inline-flex items-center gap-1.5 ${paddingClass} font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer overflow-hidden ${
          selected
            ? activeLayoutId
              ? 'text-white border-indigo-600 shadow-xs'
              : 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
            : isStaging
            ? 'bg-amber-100/90 text-amber-950 border-amber-300 hover:bg-amber-200/80'
            : isSubcategory
            ? 'bg-amber-50/90 text-amber-900 border-amber-200 hover:bg-amber-100'
            : 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200 hover:text-slate-900'
        }`}
      >
        {selected && activeLayoutId && (
          <motion.span
            layoutId={activeLayoutId}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="absolute inset-0 bg-indigo-600 rounded-[7px] z-0"
          />
        )}
        <span className="relative z-10 inline-flex items-center gap-1.5">
          {icon && <span className="text-sm">{icon}</span>}
          {showParent && parentTag && (
            <span className="text-slate-400 font-normal">{parentTag.name} &rsaquo;</span>
          )}
          <span>#{tag.name}</span>
          {count !== undefined && (
            <span className="font-mono tabular-nums opacity-85 text-xs">({count})</span>
          )}
          {onRemove && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onRemove();
                }
              }}
              className="ml-0.5 hover:text-rose-500 transition-colors"
              title="ลบแท็กนี้"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </span>
      </motion.button>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${paddingClass} font-semibold ${
        isStaging
          ? 'bg-amber-100/90 text-amber-950 border border-amber-300 rounded-md'
          : isSubcategory
          ? 'bg-amber-50 text-amber-900 border border-amber-200/70 rounded-md'
          : textColor
      } whitespace-nowrap shrink-0`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {showParent && parentTag && (
        <span className="text-slate-400 font-normal">{parentTag.name} &rsaquo;</span>
      )}
      <span>#{tag.name}</span>
      {count !== undefined && (
        <span className="font-mono tabular-nums text-slate-500 text-xs">({count})</span>
      )}
    </span>
  );
};

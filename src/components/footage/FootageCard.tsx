import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { ComputedFootage } from '../../types/footage.types';
import { StatusBadge } from '../ui/StatusBadge';
import { TagPill } from '../ui/TagPill';

interface FootageCardProps {
  footage: ComputedFootage;
  onSelectForTraceability: (footageId: string) => void;
  onQuickTagClick?: (tagId: string) => void;
}

export const FootageCard: React.FC<FootageCardProps> = ({
  footage,
  onSelectForTraceability,
  onQuickTagClick,
}) => {
  const { tagMap, settings } = useCMS();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelectForTraceability(footage.id)}
      className="group bg-white border border-slate-200/90 rounded-2xl p-4 hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-3.5"
    >
      <div className="space-y-2.5">
        {/* Top Row: ID + Clean Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-slate-500 tabular-nums">
            {footage.id}
          </span>

          <StatusBadge
            status={footage.cooldownStatus}
            daysSinceLastUse={footage.daysSinceLastUsed}
            cooldownDays={settings.cooldownDays}
            greenReadyDays={settings.greenReadyDays}
            usageLast90Days={footage.usageLast90Days}
            totalUsageCount={footage.totalUsageCount}
            maxTotalUsageCount={settings.maxTotalUsageCount}
            compact
          />
        </div>

        {/* Clip Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-950 transition-colors">
          {footage.title}
        </h3>
      </div>

      {/* Bottom Row: Category Tags + Open Details Trigger */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div
          className="flex flex-wrap items-center gap-1 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          {footage.tags.length === 0 ? (
            <span className="text-xs font-medium text-rose-600">
              ยังไม่ระบุหมวดหมู่
            </span>
          ) : (
            footage.tags.map((tid) => (
              <TagPill
                key={tid}
                tag={tagMap[tid]}
                onClick={onQuickTagClick ? () => onQuickTagClick(tid) : undefined}
              />
            ))
          )}
        </div>

        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-400 group-hover:text-slate-900 transition-colors shrink-0">
          <span>รายละเอียด</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { CooldownStatus } from '../../types/footage.types';

interface StatusBadgeProps {
  status: CooldownStatus;
  daysSinceLastUse?: number | null;
  cooldownDays?: number;
  greenReadyDays?: number;
  usageLast90Days?: number;
  totalUsageCount?: number;
  maxTotalUsageCount?: number;
  compact?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  daysSinceLastUse,
  cooldownDays = 14,
  greenReadyDays = 21,
  usageLast90Days,
  totalUsageCount,
  maxTotalUsageCount = 8,
  compact = false,
}) => {
  switch (status) {
    case 'NEW_UNTOUCHED':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 whitespace-nowrap shrink-0">
          <span>🔵</span>
          <span>{compact ? 'ใหม่แกะกล่อง' : 'ใหม่ · ยังไม่เคยใช้ (0 ครั้ง)'}</span>
        </span>
      );

    case 'READY_FRESH':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 whitespace-nowrap shrink-0">
          <span>🟢</span>
          <span>
            {compact
              ? `พร้อมใช้ (พัก ${daysSinceLastUse ?? 0}วัน${
                  totalUsageCount !== undefined ? ` · ใช้ ${totalUsageCount}x` : ''
                })`
              : `พร้อมผสมใหม่ · พัก ${daysSinceLastUse ?? 0} วัน`}
          </span>
        </span>
      );

    case 'HIGH_VELOCITY_WARNING': {
      const isRestingTowardsGreen =
        daysSinceLastUse !== null &&
        daysSinceLastUse !== undefined &&
        daysSinceLastUse < greenReadyDays;

      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 whitespace-nowrap shrink-0">
          <span>🟡</span>
          <span>
            {isRestingTowardsGreen
              ? compact
                ? `เพิ่งพ้นพัก (${daysSinceLastUse}/${greenReadyDays}วัน)`
                : `เพิ่งพ้นพัก · พัก ${daysSinceLastUse}/${greenReadyDays} วัน`
              : compact
              ? `ใช้ถี่ (${usageLast90Days ?? 3}x/90วัน)`
              : `ใช้ถี่ · ${usageLast90Days ?? 3} ครั้งใน 90 วัน`}
          </span>
        </span>
      );
    }

    case 'RECENT_COOLDOWN': {
      const isMaxedOut =
        totalUsageCount !== undefined && totalUsageCount >= maxTotalUsageCount;
      const remaining =
        daysSinceLastUse !== null && daysSinceLastUse !== undefined
          ? Math.max(1, cooldownDays - daysSinceLastUse)
          : cooldownDays;
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 whitespace-nowrap shrink-0">
          <span>🔴</span>
          <span>
            {isMaxedOut
              ? compact
                ? `ครบเพดาน (${totalUsageCount} ครั้ง)`
                : `ห้ามซ้ำ · ใช้ครบ ${totalUsageCount} ครั้ง`
              : compact
              ? `รอพัก ${remaining} วัน`
              : `ห้ามซ้ำ · รออีก ${remaining} วัน`}
          </span>
        </span>
      );
    }
  }
};

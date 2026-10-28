import React from 'react';
import { ChevronRight, FolderTree, Sparkles } from 'lucide-react';
import { ActiveNavTab, CategoryMatrixStat } from '../../../context/CMSContext';
import { EpisodeProductionTarget } from '../../../types/episode.types';
import { CategoryGroup, CategoryTag } from '../../../types/tag.types';

interface BuilderStudioHeaderProps {
  nextEpisodeId: string;
  selectedCount: number;
  activeGroup: CategoryGroup | null;
  activeCategoryStat: CategoryMatrixStat | null;
  productionTarget: EpisodeProductionTarget;
  activeSubcategory: CategoryTag | null;
  onOpenThreeTierManager: () => void;
  preselectNotice: string | null;
  onDismissPreselectNotice: () => void;
  savedBannerMessage: string | null;
  onNavigateTab: (tab: ActiveNavTab) => void;
}

export const BuilderStudioHeader: React.FC<BuilderStudioHeaderProps> = ({
  nextEpisodeId,
  selectedCount,
  activeGroup,
  activeCategoryStat,
  productionTarget,
  activeSubcategory,
  onOpenThreeTierManager,
  preselectNotice,
  onDismissPreselectNotice,
  savedBannerMessage,
  onNavigateTab,
}) => {
  return (
    <>
      {/* Compact Studio Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
              🏆 จัดชุดคลิป 5 อันดับ (4 ขั้นตอนง่ายๆ: เลือกกลุ่ม & หมวด → เลือกสูตร → ลากจัดอันดับ 1–5 → บันทึก)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              คัดฟุตเทจตามโครงสร้างหมวดหมู่ 3 ชั้น (กลุ่มหมวดหมู่ ➔ หมวดหลัก ➔ หมวดย่อย) พร้อมเช็กสต็อกฟุตใหม่และฟุตเก่าพักสดแบบเรียลไทม์
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={onOpenThreeTierManager}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 border border-slate-200 hover:border-indigo-300 font-sans font-bold transition-colors cursor-pointer"
            >
              <FolderTree className="w-3.5 h-3.5 text-indigo-600" />
              <span>จัดการหมวดหมู่ 3 ชั้น</span>
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold">
              รหัสโปรเจกต์: {nextEpisodeId}
            </span>
            <span
              className={`px-3 py-1.5 rounded-xl font-extrabold ${
                selectedCount === 5
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              เลือกแล้ว {selectedCount}/5 อันดับ
            </span>
          </div>
        </div>

        {/* Live 3-Tier Breadcrumb Context Bar */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-500 mr-1">
              🧭 เส้นทางหมวดหมู่ที่กำลังจัดชุด:
            </span>
            {/* Tier 0: Group */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 font-bold">
              <span>{activeGroup?.icon || '📁'}</span>
              <span>กลุ่ม: {activeGroup?.name || 'ไม่ได้ระบุกลุ่ม'}</span>
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {/* Tier 1: Main Category */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 border border-sky-200 font-bold">
              <span>🏷️ หมวดหลัก: #{activeCategoryStat?.tag.name || 'เลือกหมวด'}</span>
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {/* Tier 2: Subcategory / Target */}
            {productionTarget === 'SINGLE_SUBCATEGORY_SPECIAL' && activeSubcategory ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 font-bold">
                <span>🎯 หมวดย่อยเฉพาะเรื่อง: {activeSubcategory.name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                <span>🌟 หมวดย่อย: รวมหลากประเด็นในหมวดหลัก (ไม่ซ้ำหัวข้อ)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preselect Notice */}
      {preselectNotice && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs font-bold text-sky-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{preselectNotice}</span>
          </div>
          <button
            type="button"
            onClick={onDismissPreselectNotice}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            รับทราบ
          </button>
        </div>
      )}

      {/* Saved Episode Confirmation Banner */}
      {savedBannerMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-bold text-emerald-900">{savedBannerMessage}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('MASTER_ARCHIVE')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg whitespace-nowrap cursor-pointer"
            >
              เปิดดูภาพรวมคลังคลิปหลัก →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

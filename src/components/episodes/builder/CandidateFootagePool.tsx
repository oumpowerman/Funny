import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpDown, ChevronRight, Globe, GripVertical, Search } from 'lucide-react';
import { CategoryMatrixStat } from '../../../context/CMSContext';
import {
  EpisodeProductionTarget,
  EpisodeRankingSlot,
} from '../../../types/episode.types';
import { ComputedFootage } from '../../../types/footage.types';
import {
  CategoryGroup,
  CategoryTag,
  SystemSettings,
} from '../../../types/tag.types';
import { PaginationBar } from '../../ui/PaginationBar';
import { StatusBadge } from '../../ui/StatusBadge';
import { TagPill } from '../../ui/TagPill';
import {
  LiveCategoryStock,
  PickerSortBy,
  PoolQuickFilter,
  RANK_ORDER_1_TO_5,
  RankNumber,
} from './builder.types';

interface CandidateFootagePoolProps {
  categoryGroups: CategoryGroup[];
  activeGroup: CategoryGroup | null;
  activeCategoryStat: CategoryMatrixStat | null;
  productionTarget: EpisodeProductionTarget;
  activeSubcategory: CategoryTag | null;
  liveCategoryStock: LiveCategoryStock;
  allowCrossCategory: boolean;
  onToggleCrossCategory: () => void;
  onEnableCrossCategory: () => void;
  poolFilterGroupId: string;
  onChangePoolFilterGroupId: (groupId: string) => void;
  poolQuickFilter: PoolQuickFilter;
  onChangePoolQuickFilter: (filter: PoolQuickFilter) => void;
  pickerSearch: string;
  onChangePickerSearch: (q: string) => void;
  pickerSortBy: PickerSortBy;
  onChangePickerSortBy: (sort: PickerSortBy) => void;
  pickerCandidatesCount: number;
  paginatedPickerCandidates: ComputedFootage[];
  pickerPage: number;
  pickerPageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  rankings: EpisodeRankingSlot[];
  selectedFootageIds: string[];
  footageToAssignedRankMap: Record<string, RankNumber>;
  onAssignFootageToRank: (rank: RankNumber, footageId: string) => void;
  tagMap: Record<string, CategoryTag>;
  settings: SystemSettings;
}

export const CandidateFootagePool: React.FC<CandidateFootagePoolProps> = ({
  categoryGroups,
  activeGroup,
  activeCategoryStat,
  productionTarget,
  activeSubcategory,
  liveCategoryStock,
  allowCrossCategory,
  onToggleCrossCategory,
  onEnableCrossCategory,
  poolFilterGroupId,
  onChangePoolFilterGroupId,
  poolQuickFilter,
  onChangePoolQuickFilter,
  pickerSearch,
  onChangePickerSearch,
  pickerSortBy,
  onChangePickerSortBy,
  pickerCandidatesCount,
  paginatedPickerCandidates,
  pickerPage,
  pickerPageSize,
  onPageChange,
  onPageSizeChange,
  rankings,
  selectedFootageIds,
  footageToAssignedRankMap,
  onAssignFootageToRank,
  tagMap,
  settings,
}) => {
  return (
    <div className="xl:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3.5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-900">
            🎞️ คลังฟุตเทจพร้อมหยิบ{' '}
            {allowCrossCategory ? (
              <span className="text-indigo-700">(เปิดโหมดดึงข้ามหมวด)</span>
            ) : (
              <span className="text-sky-700">
                (ตามหมวดที่เลือก)
              </span>
            )}
          </h3>
          {!allowCrossCategory ? (
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              {activeGroup && (
                <>
                  <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200 font-bold">
                    {activeGroup.icon} {activeGroup.name}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </>
              )}
              <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-200 font-bold">
                #{activeCategoryStat?.tag.name}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-950 border border-amber-200 font-bold">
                {productionTarget === 'SINGLE_SUBCATEGORY_SPECIAL' && activeSubcategory
                  ? `🎯 ${activeSubcategory.name}`
                  : '🌟 รวมหลากประเด็น'}
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              กดเลือกกลุ่มหมวดหมู่ (Tier 0) ด้านล่างเพื่อกรองฟุตเทจข้ามหมวดได้ตามต้องการ
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCrossCategory}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
            allowCrossCategory
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>
            {allowCrossCategory
              ? 'กำลังดึงข้ามหมวด (คลิกเพื่อกลับหมวดเดิม)'
              : 'ดึงฟุตข้ามหมวดอื่นมาผสมด้วย'}
          </span>
        </button>
      </div>

      {/* Tier 0 CategoryGroup Filter Bar when Cross-Category Mode is Active */}
      {allowCrossCategory && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-2.5 space-y-1.5">
          <div className="text-[11px] font-bold text-purple-950">
            🗂️ กรองคลังฟุตเทจตามกลุ่มหมวดหมู่ (Tier 0):
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onChangePoolFilterGroupId('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                poolFilterGroupId === 'ALL'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-purple-200 hover:bg-purple-100/60'
              }`}
            >
              🌐 ทุกกลุ่มหมวดหมู่
            </button>
            {categoryGroups.map((grp) => (
              <button
                key={grp.id}
                type="button"
                onClick={() => onChangePoolFilterGroupId(grp.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  poolFilterGroupId === grp.id
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-purple-200 hover:bg-purple-100/60'
                }`}
              >
                <span>{grp.icon}</span>
                <span>{grp.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stock Filter Tabs + Search & Sort */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap gap-1">
          {(
            [
              {
                id: 'AVAILABLE_USABLE',
                label: `⚡ พร้อมใช้ที่ยังว่าง (${
                  liveCategoryStock.remainingNew +
                  liveCategoryStock.remainingFresh
                })`,
              },
              {
                id: 'ONLY_NEW',
                label: `🔵 เฉพาะฟุตใหม่ที่ว่าง (${liveCategoryStock.remainingNew})`,
              },
              {
                id: 'ONLY_FRESH',
                label: `🟢 เฉพาะฟุตเก่าสดที่ว่าง (${liveCategoryStock.remainingFresh})`,
              },
              {
                id: 'ALL',
                label: '📋 ดูทั้งหมดในหมวด',
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangePoolQuickFilter(tab.id)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                poolQuickFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={pickerSearch}
              onChange={(e) => onChangePickerSearch(e.target.value)}
              placeholder="ค้นหารหัส FT-XXXX หรือชื่อช็อตฮา..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-slate-900"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={pickerSortBy}
              onChange={(e) => onChangePickerSortBy(e.target.value as PickerSortBy)}
              className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="REST_DAYS_DESC">⏱️ พักนานสุดขึ้นก่อน</option>
              <option value="USAGE_90D_ASC">📉 ใช้ใน 90 วันน้อยสุด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Draggable Candidate Footage Cards */}
      <div className="space-y-2.5">
        {paginatedPickerCandidates.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="text-xs font-bold text-slate-700">
              ไม่มีฟุตเทจที่ว่างตามตัวกรองนี้ในหมวด #{activeCategoryStat?.tag.name}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onChangePoolQuickFilter('ALL')}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ดูฟุตทั้งหมดในหมวดนี้
              </button>
              <button
                type="button"
                onClick={onEnableCrossCategory}
                className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
              >
                🌐 ดึงฟุตข้ามหมวดอื่นมาช่วยผสม
              </button>
            </div>
          </div>
        ) : (
          paginatedPickerCandidates.map((ft) => {
            const assignedRank = footageToAssignedRankMap[ft.id];
            const collidingPartnerIds = selectedFootageIds.filter(
              (selId) => selId !== ft.id && (ft.coUsedWithMap[selId] || 0) > 0
            );

            return (
              <div
                key={ft.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({ type: 'FOOTAGE', footageId: ft.id })
                  );
                  e.dataTransfer.effectAllowed = 'move';
                }}
                className={`p-3 border rounded-xl transition-all space-y-2 cursor-grab active:cursor-grabbing ${
                  assignedRank
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-400 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-extrabold text-slate-900">
                      {ft.id}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {ft.ingestionFlow === 'DIRECT_1_TO_1'
                        ? '📹 1:1'
                        : `✂️ ${ft.sourceId}`}
                    </span>
                  </div>

                  <StatusBadge
                    status={ft.cooldownStatus}
                    daysSinceLastUse={ft.daysSinceLastUsed}
                    cooldownDays={settings.cooldownDays}
                    greenReadyDays={settings.greenReadyDays}
                    usageLast90Days={ft.usageLast90Days}
                    totalUsageCount={ft.totalUsageCount}
                    maxTotalUsageCount={settings.maxTotalUsageCount}
                    compact
                  />
                </div>

                <div className="text-xs font-bold text-slate-900 line-clamp-1">
                  {ft.title}
                </div>

                {collidingPartnerIds.length > 0 && !assignedRank && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                    ⚠️ เคยผสมคู่กับ {collidingPartnerIds.join(', ')} ใน EP ก่อนหน้า
                  </div>
                )}

                {/* Bottom Row: Tags + Direct [1][2][3][4][5] Quick Rank Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1">
                    {ft.tags.map((tid) => (
                      <TagPill key={tid} tag={tagMap[tid]} />
                    ))}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 mr-0.5">
                      ใส่อันดับ:
                    </span>
                    {RANK_ORDER_1_TO_5.map((rankNum) => {
                      const isAssignedHere = assignedRank === rankNum;
                      const slotHasOtherClip =
                        !isAssignedHere &&
                        Boolean(
                          rankings.find((r) => r.rank === rankNum)?.footageId
                        );

                      return (
                        <motion.button
                          key={rankNum}
                          type="button"
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onAssignFootageToRank(rankNum, ft.id)}
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-extrabold transition-colors cursor-pointer ${
                            isAssignedHere
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : slotHasOtherClip
                              ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-indigo-600 hover:text-white'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                          title={
                            isAssignedHere
                              ? `อยู่ในอันดับที่ ${rankNum} แล้ว`
                              : slotHasOtherClip
                              ? `แทนที่ฟุตในอันดับที่ ${rankNum}`
                              : `ใส่ในอันดับที่ ${rankNum}`
                          }
                        >
                          {rankNum}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <PaginationBar
          currentPage={pickerPage}
          totalItems={pickerCandidatesCount}
          pageSize={pickerPageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[4, 5, 8, 12]}
          itemLabel="ฟุตเทจ"
          compact
        />
      </div>
    </div>
  );
};

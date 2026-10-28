import React from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
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
import { RankSlotCard } from '../RankSlotCard';
import { CandidateFootagePool } from './CandidateFootagePool';
import {
  LiveCategoryStock,
  PickerSortBy,
  PoolQuickFilter,
  RankNumber,
  SlotDropPayload,
} from './builder.types';

interface BuilderStep3RankingWorkspaceProps {
  rankings: EpisodeRankingSlot[];
  computedFootageMap: Record<string, ComputedFootage>;
  selectedFootageIds: string[];
  activeSlotRank: RankNumber;
  onActivatePickerSlot: (rank: RankNumber) => void;
  onClearSlotByRank: (rank: RankNumber) => void;
  onClearAllSlots: () => void;
  onMoveSlotByIndex: (index: number, direction: 'UP' | 'DOWN') => void;
  onUpdateSlotScript: (rank: RankNumber, script: string) => void;
  onDropItemOnSlot: (targetRank: RankNumber, payload: SlotDropPayload) => void;
  onAssignFootageToRank: (targetRank: RankNumber, footageId: string) => void;
  footageToAssignedRankMap: Record<string, RankNumber>;
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
  tagMap: Record<string, CategoryTag>;
  settings: SystemSettings;
}

export const BuilderStep3RankingWorkspace: React.FC<
  BuilderStep3RankingWorkspaceProps
> = ({
  rankings,
  computedFootageMap,
  selectedFootageIds,
  activeSlotRank,
  onActivatePickerSlot,
  onClearSlotByRank,
  onClearAllSlots,
  onMoveSlotByIndex,
  onUpdateSlotScript,
  onDropItemOnSlot,
  onAssignFootageToRank,
  footageToAssignedRankMap,
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
  tagMap,
  settings,
}) => {
  return (
    <section className="rounded-2xl border border-emerald-200/90 bg-emerald-50/30 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold">
              ขั้นที่ 3️⃣
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                จัดเรียงอันดับ 1 ถึง 5 (ลากสลับอันดับได้ · ลากฟุตจากขวามาวางได้ · หรือกดเลข [1]–[5] บนฟุตเทจ)
              </h2>
              <p className="text-[11px] text-slate-600">
                เรียงจากอันดับ 1 ไป 5 ตามลำดับตัวเลข ช่องเขียนบทมาสคอตถูกพับเก็บไว้ กดปุ่ม &ldquo;🎙️ บทพากย์&rdquo; เมื่อต้องการแก้ไข
              </p>
            </div>
          </div>

          {/* 3-Tier Context Strip in Step 3 */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] pl-1">
            <span className="text-slate-600 font-semibold">กำลังจัดอันดับใน:</span>
            {activeGroup && (
              <>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">
                  {activeGroup.icon} {activeGroup.name}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </>
            )}
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-bold">
              #{activeCategoryStat?.tag.name}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-bold">
              {productionTarget === 'SINGLE_SUBCATEGORY_SPECIAL' && activeSubcategory
                ? `🎯 ${activeSubcategory.name}`
                : '🌟 รวมหลากประเด็น'}
            </span>
          </div>
        </div>

        {selectedFootageIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAllSlots}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างช่องอันดับ 1–5 ทั้งหมด</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Column (6 cols): Rank Slots 1 -> 2 -> 3 -> 4 -> 5 */}
        <div className="xl:col-span-6 space-y-2.5">
          {rankings.map((slot, index) => (
            <RankSlotCard
              key={slot.rank}
              slot={slot}
              footage={slot.footageId ? computedFootageMap[slot.footageId] : null}
              isActivePickerSlot={activeSlotRank === slot.rank}
              onActivatePicker={() => onActivatePickerSlot(slot.rank)}
              onClearSlot={() => onClearSlotByRank(slot.rank)}
              onMoveRank={(dir) => onMoveSlotByIndex(index, dir)}
              onScriptChange={(script) => onUpdateSlotScript(slot.rank, script)}
              canMoveUp={index > 0}
              canMoveDown={index < rankings.length - 1}
              onSlotDragStart={(rank) => onActivatePickerSlot(rank)}
              onDropItemOnSlot={onDropItemOnSlot}
            />
          ))}
        </div>

        {/* Right Column (6 cols): Draggable Footage Pool */}
        <CandidateFootagePool
          categoryGroups={categoryGroups}
          activeGroup={activeGroup}
          activeCategoryStat={activeCategoryStat}
          productionTarget={productionTarget}
          activeSubcategory={activeSubcategory}
          liveCategoryStock={liveCategoryStock}
          allowCrossCategory={allowCrossCategory}
          onToggleCrossCategory={onToggleCrossCategory}
          onEnableCrossCategory={onEnableCrossCategory}
          poolFilterGroupId={poolFilterGroupId}
          onChangePoolFilterGroupId={onChangePoolFilterGroupId}
          poolQuickFilter={poolQuickFilter}
          onChangePoolQuickFilter={onChangePoolQuickFilter}
          pickerSearch={pickerSearch}
          onChangePickerSearch={onChangePickerSearch}
          pickerSortBy={pickerSortBy}
          onChangePickerSortBy={onChangePickerSortBy}
          pickerCandidatesCount={pickerCandidatesCount}
          paginatedPickerCandidates={paginatedPickerCandidates}
          pickerPage={pickerPage}
          pickerPageSize={pickerPageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          rankings={rankings}
          selectedFootageIds={selectedFootageIds}
          footageToAssignedRankMap={footageToAssignedRankMap}
          onAssignFootageToRank={onAssignFootageToRank}
          tagMap={tagMap}
          settings={settings}
        />
      </div>
    </section>
  );
};

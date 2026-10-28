import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, FolderTree } from 'lucide-react';
import { CategoryMatrixStat } from '../../../context/CMSContext';
import { EpisodeProductionTarget } from '../../../types/episode.types';
import { ComputedFootage } from '../../../types/footage.types';
import { CategoryGroup, CategoryTag } from '../../../types/tag.types';
import { GroupStockStat, LiveCategoryStock } from './builder.types';

interface BuilderStep1CategoryTargetProps {
  groupStockStats: GroupStockStat[];
  selectedGroupId: string;
  activeGroup: CategoryGroup | null;
  categoriesInSelectedGroup: CategoryMatrixStat[];
  mainCategoryTagId: string;
  activeCategoryStat: CategoryMatrixStat | null;
  liveCategoryStock: LiveCategoryStock;
  productionTarget: EpisodeProductionTarget;
  targetSubcategoryId: string | null;
  activeSubcategory: CategoryTag | null;
  currentSubcategories: CategoryTag[];
  computedFootage: ComputedFootage[];
  onSelectGroup: (groupId: string) => void;
  onSelectCategory: (tagId: string, autoFillWithRecipe?: boolean) => void;
  onSelectVarietyMode: () => void;
  onSelectSoloMode: () => void;
  onSelectSubcategory: (subId: string, subName: string) => void;
  onOpenStatusRuleModal: () => void;
  onOpenThreeTierManager: () => void;
}

export const BuilderStep1CategoryTarget: React.FC<BuilderStep1CategoryTargetProps> = ({
  groupStockStats,
  selectedGroupId,
  activeGroup,
  categoriesInSelectedGroup,
  mainCategoryTagId,
  activeCategoryStat,
  liveCategoryStock,
  productionTarget,
  targetSubcategoryId,
  activeSubcategory,
  currentSubcategories,
  computedFootage,
  onSelectGroup,
  onSelectCategory,
  onSelectVarietyMode,
  onSelectSoloMode,
  onSelectSubcategory,
  onOpenStatusRuleModal,
  onOpenThreeTierManager,
}) => {
  return (
    <section className="rounded-2xl border border-sky-200/90 bg-sky-50/50 p-4 space-y-4">
      {/* Step 1 Header + Live Remaining Stock Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-sky-600 text-white text-xs font-extrabold">
            ขั้นที่ 1️⃣
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              เลือกหมวดหมู่ 3 ชั้นที่จะผลิตคลิป (ชั้นที่ 1: กลุ่มหมวดหมู่ ➔ ชั้นที่ 2: หมวดหลัก ➔ ชั้นที่ 3: หมวดย่อย)
            </h2>
            <p className="text-[11px] text-slate-600">
              เริ่มจากเลือกกลุ่มหมวดหมู่ก่อน ระบบจะกางหมวดหลักและหมวดย่อยที่อยู่ในกลุ่มนั้นพร้อมจำนวนฟุตพร้อมใช้แบบสดๆ
            </p>
          </div>
        </div>

        {/* Live Remaining Stock Pill Strip for Selected Category */}
        {activeCategoryStat && (
          <div className="bg-white border border-sky-200 rounded-xl px-3.5 py-2 flex flex-wrap items-center gap-3 shadow-2xs">
            <div className="text-xs font-extrabold text-slate-900">
              🏷️ สต็อก #{activeCategoryStat.tag.name} ที่ว่างให้หยิบ:
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 font-extrabold">
                🔵 ฟุตใหม่เหลือ {liveCategoryStock.remainingNew} อัน{' '}
                <span className="font-normal text-sky-700">
                  (จาก {liveCategoryStock.totalNew})
                </span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold">
                🟢 เก่าพักสดเหลือ {liveCategoryStock.remainingFresh} อัน{' '}
                <span className="font-normal text-emerald-700">
                  (จาก {liveCategoryStock.totalFresh})
                </span>
              </span>
              <button
                type="button"
                onClick={onOpenStatusRuleModal}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-sans font-bold transition-colors cursor-pointer"
                title="ตั้งค่าตัวเลขเกณฑ์สี ฟ้า เขียว เหลือง แดง"
              >
                🎨 ตั้งค่าเกณฑ์สี
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* TIER 0: เลือกกลุ่มหมวดหมู่ (Category Group Selection)                   */}
      {/* ===================================================================== */}
      <div className="bg-white/90 border border-purple-200/80 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[11px] font-bold">
              ชั้นที่ 1 (Tier 0)
            </span>
            <span className="text-xs font-bold text-slate-900">
              🗂️ เลือกกลุ่มหมวดหมู่ก่อน (คลิกเลือกกลุ่มเพื่อดูหมวดหมู่หลักด้านล่าง):
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenThreeTierManager}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[11px] font-bold transition-colors cursor-pointer"
          >
            <FolderTree className="w-3.5 h-3.5 text-purple-700" />
            <span>➕ เพิ่ม/แก้ไขกลุ่มและหมวดหมู่ 3 ชั้น</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {groupStockStats.map((gStat) => {
            const isGroupSelected = gStat.group.id === selectedGroupId;
            return (
              <motion.button
                key={gStat.group.id}
                type="button"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectGroup(gStat.group.id)}
                className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  isGroupSelected
                    ? 'bg-purple-50/95 text-purple-950 border-purple-500 ring-2 ring-purple-300/70 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-extrabold flex items-center gap-1.5 truncate">
                      <span className="text-base leading-none">{gStat.group.icon}</span>
                      <span className="truncate">{gStat.group.name}</span>
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                        isGroupSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {gStat.mainCategoriesCount} หมวดหลัก
                    </span>
                  </div>
                  {gStat.group.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {gStat.group.description}
                    </p>
                  )}
                </div>

                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-600">
                    🔵 <strong>{gStat.newCount}</strong> · 🟢 <strong>{gStat.readyCount}</strong>
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      gStat.producibleEpisodesCount > 0
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    🎬 ผลิตได้ {gStat.producibleEpisodesCount} EP
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TIER 1: เลือกหมวดหมู่หลักในกลุ่มที่เลือก (Main Category Selection)        */}
      {/* ===================================================================== */}
      <div className="bg-white/90 border border-sky-200/90 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white text-[11px] font-bold">
              ชั้นที่ 2 (Tier 1)
            </span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>🏷️ เลือกหมวดหมู่หลักในกลุ่ม</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-extrabold">
                {activeGroup?.icon} {activeGroup?.name}
              </span>
              <span className="text-slate-500 font-normal">
                ({categoriesInSelectedGroup.length} หมวดหลัก)
              </span>
            </span>
          </div>
        </div>

        {categoriesInSelectedGroup.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <p className="text-xs font-bold text-slate-700">
              ยังไม่มีหมวดหมู่หลักในกลุ่ม &ldquo;{activeGroup?.name}&rdquo;
            </p>
            <button
              type="button"
              onClick={onOpenThreeTierManager}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              ➕ เพิ่มหมวดหมู่หลักในกลุ่มนี้
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {categoriesInSelectedGroup.map((stat) => {
              const isSelected = stat.tag.id === mainCategoryTagId;
              const isReady5 = stat.usableCount >= 5;

              return (
                <motion.button
                  key={stat.tag.id}
                  type="button"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectCategory(stat.tag.id, true)}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/90 text-indigo-950 border-indigo-400 shadow-2xs ring-2 ring-indigo-300/60'
                      : isReady5
                      ? 'bg-white text-slate-900 border-emerald-300 hover:border-indigo-400 shadow-2xs'
                      : 'bg-white/70 text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div>
                      <span className="text-xs font-extrabold block truncate">
                        #{stat.tag.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        มีหมวดย่อย {stat.subcategoriesCount} รายการ
                      </span>
                    </div>
                    {isReady5 ? (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        🎬 {stat.producibleEpisodesCount} EP
                      </span>
                    ) : (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        ⏳ {stat.usableCount}/5 ฟุต
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-100 ${
                      isSelected ? 'text-indigo-900' : 'text-slate-600'
                    }`}
                  >
                    <span>
                      🔵 ใหม่ <strong>{stat.newCount}</strong> · 🟢 สด{' '}
                      <strong>{stat.readyCount}</strong>
                    </span>
                    <span className="font-bold">พร้อมใช้ {stat.usableCount}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* TIER 2: เลือกรูปแบบการคัดคลิป & หมวดหมู่ย่อย (Subcategory Target)         */}
      {/* ===================================================================== */}
      <div className="bg-white/90 border border-amber-200/90 rounded-xl p-3.5 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[11px] font-bold">
              ชั้นที่ 3 (Tier 2)
            </span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>🎯 เลือกขอบเขตหมวดหมู่ย่อยภายใต้ #{activeCategoryStat?.tag.name || 'หมวดหลัก'}:</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={onSelectVarietyMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                productionTarget === 'MAIN_CATEGORY_VARIETY'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <span>🌟</span>
              <span>รวมหลากประเด็น / หลายหมวดย่อย (5 ช็อตไม่ซ้ำคน/เรื่อง)</span>
            </button>

            <button
              type="button"
              onClick={onSelectSoloMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                productionTarget === 'SINGLE_SUBCATEGORY_SPECIAL'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <span>🎯</span>
              <span>
                เจาะจงหมวดย่อยเรื่องเดียว ({currentSubcategories.length} หมวดย่อย)
              </span>
            </button>
          </div>
        </div>

        {/* Subcategory Chips (Always previewed in Variety mode, or interactive selector in Solo mode) */}
        <AnimatePresence mode="wait">
          {productionTarget === 'SINGLE_SUBCATEGORY_SPECIAL' ? (
            <motion.div
              key="solo-mode"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1">
                  <span>🎯</span> คลิกเลือกหมวดหมู่ย่อยที่ต้องการทำคลิปเดี่ยวเฉพาะเรื่อง (5 อันดับจากหัวข้อย่อยนี้ล้วน):
                </span>
                <span className="text-[11px] text-amber-800 font-mono">
                  มีหมวดย่อยใน #{activeCategoryStat?.tag.name} ทั้งหมด {currentSubcategories.length} รายการ
                </span>
              </div>

              {currentSubcategories.length === 0 ? (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
                  <span>หมวดหลักนี้ยังไม่มีหมวดหมู่ย่อย (Tier 2)</span>
                  <button
                    type="button"
                    onClick={onOpenThreeTierManager}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 cursor-pointer"
                  >
                    ➕ เพิ่มหมวดหมู่ย่อยในจัดการหมวดหมู่ 3 ชั้น
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentSubcategories.map((sub) => {
                    const isSubSelected = targetSubcategoryId === sub.id;
                    const subClips = computedFootage.filter((ft) => ft.tags.includes(sub.id));
                    const subUsable = subClips.filter(
                      (f) =>
                        f.cooldownStatus === 'NEW_UNTOUCHED' || f.cooldownStatus === 'READY_FRESH'
                    ).length;
                    const canMakeSolo = subUsable >= 5;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => onSelectSubcategory(sub.id, sub.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSubSelected
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-xs ring-2 ring-amber-300'
                            : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/60'
                        }`}
                      >
                        <span>
                          {sub.entityType === 'PERSON'
                            ? '👤'
                            : sub.entityType === 'ANIMAL'
                            ? '🐾'
                            : sub.entityType === 'ACTION'
                            ? '⚡'
                            : '🎯'}
                        </span>
                        <span>{sub.name}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                            canMakeSolo
                              ? 'bg-emerald-100 text-emerald-800 font-bold'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          พร้อมใช้ {subUsable} ฟุต
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="variety-mode"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              <div className="flex flex-wrap items-center gap-1.5 text-slate-700">
                <span className="font-bold text-indigo-900">
                  🌟 โหมดรวมหลากประเด็น:
                </span>
                <span>
                  ระบบจะคัดฟุตเทจจากหมวดหลัก <strong>#{activeCategoryStat?.tag.name}</strong> และคละหมวดย่อยทั้ง{' '}
                  <strong>{currentSubcategories.length} รายการ</strong> ไม่ให้ซ้ำคน/เรื่องเดียวกันใน EP เดียว
                </span>
              </div>
              {currentSubcategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  {currentSubcategories.slice(0, 5).map((sub) => (
                    <span
                      key={sub.id}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-600 font-semibold"
                    >
                      {sub.name}
                    </span>
                  ))}
                  {currentSubcategories.length > 5 && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      +{currentSubcategories.length - 5} หมวดย่อย
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active 3-Tier Summary Strip at Bottom of Step 1 */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-slate-600">✅ สรุปหมวดหมู่ 3 ชั้นที่เลือก:</span>
          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold">
            {activeGroup?.icon} {activeGroup?.name}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 font-bold">
            #{activeCategoryStat?.tag.name}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-bold">
            {productionTarget === 'SINGLE_SUBCATEGORY_SPECIAL' && activeSubcategory
              ? `🎯 เจาะจง: ${activeSubcategory.name}`
              : '🌟 รวมหลากประเด็นในหมวดหลัก'}
          </span>
        </div>
      </div>
    </section>
  );
};

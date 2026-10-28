import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Shuffle } from 'lucide-react';
import { CategoryMatrixStat } from '../../context/CMSContext';
import { EpisodeProductionTarget } from '../../types/episode.types';
import { ComputedFootage } from '../../types/footage.types';
import { CategoryGroup, CategoryTag } from '../../types/tag.types';
import { MixRecipeId } from '../../utils/collisionDetector';

interface SmartMixRecipeSelectorProps {
  selectedFootages: (ComputedFootage | null)[];
  activeRecipe: MixRecipeId;
  activeGroup?: CategoryGroup | null;
  activeCategoryStat: CategoryMatrixStat | null;
  productionTarget?: EpisodeProductionTarget;
  activeSubcategory?: CategoryTag | null;
  onSelectRecipeAndMix: (recipe: MixRecipeId) => void;
}

const RECIPES: {
  id: MixRecipeId;
  emoji: string;
  title: string;
  subtitle: string;
  requiredNew: number;
  requiredTotalUsable: number;
}[] = [
  {
    id: 'FORMULA_2_NEW_3_FRESH',
    emoji: '⭐',
    title: 'สูตร 2 ใหม่ + 3 เก่าสด',
    subtitle: '🔵 ใหม่ 2 + 🟢 พักสด 3 (แนะนำ)',
    requiredNew: 2,
    requiredTotalUsable: 5,
  },
  {
    id: 'FORMULA_3_NEW_2_FRESH',
    emoji: '🔥',
    title: 'สูตร 3 ใหม่ + 2 เก่าสด',
    subtitle: '🔵 ใหม่ 3 + 🟢 พักสด 2',
    requiredNew: 3,
    requiredTotalUsable: 5,
  },
  {
    id: 'FORMULA_ALL_NEW',
    emoji: '✨',
    title: 'ฟุตใหม่ล้วน 5 อันดับ',
    subtitle: '🔵 ดึงเฉพาะฟุตใหม่แกะกล่อง 5 ตัว',
    requiredNew: 5,
    requiredTotalUsable: 5,
  },
  {
    id: 'FORMULA_CLASSIC_RETRO_60D',
    emoji: '💎',
    title: 'ย้อนยุคพักนาน (>60 วัน)',
    subtitle: '🟢 คัดฟุตเก่าคลาสสิกที่พักจนสด',
    requiredNew: 0,
    requiredTotalUsable: 5,
  },
];

export const SmartMixRecipeSelector: React.FC<SmartMixRecipeSelectorProps> = ({
  selectedFootages,
  activeRecipe,
  activeGroup,
  activeCategoryStat,
  productionTarget = 'MAIN_CATEGORY_VARIETY',
  activeSubcategory,
  onSelectRecipeAndMix,
}) => {
  const validFootages = selectedFootages.filter(
    (f): f is ComputedFootage => Boolean(f)
  );
  const totalSelected = validFootages.length;

  const newCount = validFootages.filter(
    (f) => f.cooldownStatus === 'NEW_UNTOUCHED'
  ).length;
  const freshRecycledCount = validFootages.filter(
    (f) => f.cooldownStatus === 'READY_FRESH'
  ).length;
  const warningOrCooldownCount = validFootages.filter(
    (f) =>
      f.cooldownStatus === 'HIGH_VELOCITY_WARNING' ||
      f.cooldownStatus === 'RECENT_COOLDOWN'
  ).length;

  const newPercent = Math.round((newCount / 5) * 100);
  const freshPercent = Math.round((freshRecycledCount / 5) * 100);
  const warnPercent = Math.round((warningOrCooldownCount / 5) * 100);

  const catNew = activeCategoryStat?.newCount ?? 0;
  const catUsable = activeCategoryStat?.usableCount ?? 0;

  return (
    <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50/40 p-4 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-extrabold">
              ขั้นที่ 2️⃣
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                เลือกสูตรผสมอัตโนมัติ (หรือข้ามไปหยิบเองในขั้นที่ 3)
              </h2>
            </div>
          </div>

          {/* 3-Tier Context Badge Strip */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] pl-1">
            <span className="text-slate-600">คัดวัตถุดิบจาก:</span>
            {activeGroup && (
              <>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">
                  {activeGroup.icon} {activeGroup.name}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </>
            )}
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-bold">
              #{activeCategoryStat?.tag.name || 'ที่เลือก'}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-bold">
              {productionTarget === 'SINGLE_SUBCATEGORY_SPECIAL' && activeSubcategory
                ? `🎯 ${activeSubcategory.name}`
                : '🌟 รวมหลากประเด็น'}
            </span>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelectRecipeAndMix(activeRecipe)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs whitespace-nowrap cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>สุ่มจัดชุดใหม่ตามสูตร</span>
        </motion.button>
      </div>

      {/* 4 Recipe Formula Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {RECIPES.map((recipe) => {
          const isSelected = activeRecipe === recipe.id;
          const hasEnoughInCat =
            catUsable >= recipe.requiredTotalUsable &&
            catNew >= recipe.requiredNew;

          return (
            <motion.button
              key={recipe.id}
              type="button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectRecipeAndMix(recipe.id)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-100/90 text-indigo-950 border-indigo-400 ring-1 ring-indigo-300 shadow-2xs'
                  : 'bg-white text-slate-900 border-slate-200/90 hover:border-indigo-400 shadow-2xs'
              }`}
            >
              <div className="space-y-1">
                <div className="text-xs font-extrabold flex items-center justify-between gap-1">
                  <span className="flex items-center gap-1.5">
                    <span>{recipe.emoji}</span>
                    <span>{recipe.title}</span>
                  </span>
                </div>
                <div
                  className={`text-[11px] ${
                    isSelected ? 'text-indigo-800' : 'text-slate-500'
                  }`}
                >
                  {recipe.subtitle}
                </div>
              </div>

              <div className="pt-1.5 border-t border-indigo-200/50 flex items-center justify-between text-[10px] font-mono">
                {hasEnoughInCat ? (
                  <span
                    className={`font-bold ${
                      isSelected ? 'text-emerald-700' : 'text-emerald-700'
                    }`}
                  >
                    ✅ วัตถุดิบหมวดนี้พอจัด
                  </span>
                ) : (
                  <span
                    className={`font-bold ${
                      isSelected ? 'text-amber-800' : 'text-amber-700'
                    }`}
                  >
                    ⚡ จัดเท่าที่มี ({catNew} ใหม่ / {catUsable} พร้อม)
                  </span>
                )}
                <span className="underline font-sans font-bold text-indigo-700">กดใช้สูตร →</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Compact Live Mix Ratio Bar */}
      <div className="bg-white/90 border border-indigo-100 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="font-sans font-bold text-slate-700">
            📊 สัดส่วนในช่องอันดับ 1–5 ตอนนี้ ({totalSelected}/5):
          </span>
          <span className="text-sky-700 font-bold">🔵 ฟุตใหม่ {newCount}</span>
          <span className="text-emerald-700 font-bold">
            🟢 ฟุตเก่าพักสด {freshRecycledCount}
          </span>
          {warningOrCooldownCount > 0 && (
            <span className="text-amber-700 font-bold">
              🟡/🔴 ใช้ถี่/พัก {warningOrCooldownCount}
            </span>
          )}
        </div>

        <div className="h-2.5 w-full sm:w-48 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
          {newPercent > 0 && (
            <div style={{ width: `${newPercent}%` }} className="bg-sky-500 h-full" />
          )}
          {freshPercent > 0 && (
            <div
              style={{ width: `${freshPercent}%` }}
              className="bg-emerald-500 h-full"
            />
          )}
          {warnPercent > 0 && (
            <div style={{ width: `${warnPercent}%` }} className="bg-amber-500 h-full" />
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { CategoryMatrixStat } from '../../../context/CMSContext';
import {
  EpisodeProductionTarget,
  PublishSlot,
} from '../../../types/episode.types';
import { CategoryGroup, CategoryTag } from '../../../types/tag.types';

interface BuilderStep4MetadataFormProps {
  nextEpisodeId: string;
  selectedCount: number;
  activeGroup: CategoryGroup | null;
  activeCategoryStat: CategoryMatrixStat | null;
  productionTarget: EpisodeProductionTarget;
  activeSubcategory: CategoryTag | null;
  previewMasterFileName: string;
  title: string;
  onChangeTitle: (val: string) => void;
  publishDate: string;
  onChangePublishDate: (val: string) => void;
  publishSlot: PublishSlot;
  onChangePublishSlot: (val: PublishSlot) => void;
  isOptionalMasterOpen: boolean;
  onToggleOptionalMaster: () => void;
  masterDriveUrl: string;
  onChangeMasterDriveUrl: (val: string) => void;
  youtubeUrl: string;
  onChangeYoutubeUrl: (val: string) => void;
  facebookUrl: string;
  onChangeFacebookUrl: (val: string) => void;
  introMascotScript: string;
  onChangeIntroMascotScript: (val: string) => void;
  outroMascotScript: string;
  onChangeOutroMascotScript: (val: string) => void;
  onSubmitEpisode: (e: React.FormEvent) => void;
}

export const BuilderStep4MetadataForm: React.FC<
  BuilderStep4MetadataFormProps
> = ({
  nextEpisodeId,
  selectedCount,
  activeGroup,
  activeCategoryStat,
  productionTarget,
  activeSubcategory,
  previewMasterFileName,
  title,
  onChangeTitle,
  publishDate,
  onChangePublishDate,
  publishSlot,
  onChangePublishSlot,
  isOptionalMasterOpen,
  onToggleOptionalMaster,
  masterDriveUrl,
  onChangeMasterDriveUrl,
  youtubeUrl,
  onChangeYoutubeUrl,
  facebookUrl,
  onChangeFacebookUrl,
  introMascotScript,
  onChangeIntroMascotScript,
  outroMascotScript,
  onChangeOutroMascotScript,
  onSubmitEpisode,
}) => {
  return (
    <form
      onSubmit={onSubmitEpisode}
      className="rounded-2xl border border-amber-200/90 bg-amber-50/40 p-4 sm:p-5 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-extrabold">
              ขั้นที่ 4️⃣
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                ตรวจสอบชื่อคลิป (ตั้งให้อัตโนมัติตามหมวดหมู่ 3 ชั้น) & กดบันทึกเข้าคลัง
              </h2>
              <p className="text-[11px] font-mono text-slate-600 truncate">
                📁 ชื่อไฟล์ตัวเต็มอัตโนมัติ: {previewMasterFileName}
              </p>
            </div>
          </div>

          {/* 3-Tier Summary Badge Strip for DB Persistence */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] pl-1">
            <span className="text-slate-600 font-semibold">บันทึกในโครงสร้าง 3 ชั้น:</span>
            {activeGroup && (
              <>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">
                  {activeGroup.icon} กลุ่ม: {activeGroup.name}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </>
            )}
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-bold">
              หมวดหลัก: #{activeCategoryStat?.tag.name}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-bold">
              {productionTarget === 'SINGLE_SUBCATEGORY_SPECIAL' && activeSubcategory
                ? `🎯 หมวดย่อย: ${activeSubcategory.name}`
                : '🌟 หมวดย่อย: รวมหลากประเด็น'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleOptionalMaster}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-400 rounded-xl transition-colors cursor-pointer"
        >
          {isOptionalMasterOpen ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>ซ่อนช่องลิงก์ไฟล์ตัวเต็ม & บทเปิด-ปิด</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>➕ ข้อมูลเสริม: ลิงก์ Drive / YouTube / FB (ไม่บังคับ)</span>
            </>
          )}
        </button>
      </div>

      {/* Core Required Episode Fields in One Clean Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white border border-amber-200/80 rounded-xl p-4">
        <div className="md:col-span-7">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            ชื่อคลิป 5 อันดับ (ตั้งให้อัตโนมัติ แก้ไขได้) *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="เช่น 5 อันดับคนไทยเป็นคนตลก #12..."
            className="w-full px-3 py-2 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            วันที่สร้าง / คิวโพสต์
          </label>
          <input
            type="date"
            value={publishDate}
            onChange={(e) => onChangePublishDate(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            รอบเวลาอ้างอิง
          </label>
          <select
            value={publishSlot}
            onChange={(e) => onChangePublishSlot(e.target.value as PublishSlot)}
            className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="MORNING_0600">🌅 รอบเช้า 06:00 น.</option>
            <option value="EVENING_1800">🌆 รอบเย็น 18:00 น.</option>
          </select>
        </div>
      </div>

      {/* Collapsible Optional Master Video Links & Intro/Outro Mascot Scripts */}
      <AnimatePresence initial={false}>
        {isOptionalMasterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    📂 ลิงก์ไฟล์ตัวเต็มใน Google Drive
                  </label>
                  <input
                    type="url"
                    value={masterDriveUrl}
                    onChange={(e) => onChangeMasterDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/MASTER-..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ▶️ ลิงก์ที่โพสต์ลง YouTube
                  </label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => onChangeYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    📘 ลิงก์ที่โพสต์ลง Facebook
                  </label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => onChangeFacebookUrl(e.target.value)}
                    placeholder="https://www.facebook.com/riangrueanglan/videos/..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🎙️ บทพากย์มาสคอตเปิดคลิป (Intro)
                  </label>
                  <input
                    type="text"
                    value={introMascotScript}
                    onChange={(e) => onChangeIntroMascotScript(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🎙️ บทพากย์มาสคอตปิดท้ายคลิป (Outro)
                  </label>
                  <input
                    type="text"
                    value={outroMascotScript}
                    onChange={(e) => onChangeOutroMascotScript(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs font-semibold text-slate-700">
          สถานะชุดจัดอันดับ:{' '}
          <span className="font-mono font-extrabold text-slate-900">
            {selectedCount}/5 อันดับ
          </span>
          {selectedCount < 5 ? (
            <span className="text-rose-600 ml-2">
              (กรุณาเลือกฟุตเทจให้ครบทั้ง 5 อันดับก่อนกดบันทึก — ขาดอีก{' '}
              {5 - selectedCount} อันดับ)
            </span>
          ) : (
            <span className="text-emerald-700 ml-2">
              ✅ ครบทั้ง 5 อันดับแล้ว พร้อมบันทึกเข้าคลังคลิปหลัก!
            </span>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: selectedCount === 5 ? 1.02 : 1 }}
          whileTap={{ scale: selectedCount === 5 ? 0.97 : 1 }}
          disabled={selectedCount < 5}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>บันทึกคลิป 5 อันดับ ({nextEpisodeId})</span>
        </motion.button>
      </div>
    </form>
  );
};

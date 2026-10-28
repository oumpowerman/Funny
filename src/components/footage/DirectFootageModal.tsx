import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Film,
  FolderGit2,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { generateNextId, generateStandardFileName } from '../../utils/fileNameGenerator';
import { TagSelectorInput } from '../tags/TagSelectorInput';
import { Modal } from '../ui/Modal';

export const DirectFootageModal: React.FC = () => {
  const {
    isDirectFootageModalOpen,
    setIsDirectFootageModalOpen,
    computedFootage,
    mainCategories,
    addDirectFootage,
  } = useCMS();

  // Core Form Fields
  const [title, setTitle] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Optional Fields (Folded by default)
  const [driveFileUrl, setDriveFileUrl] = useState('');
  const [mascotNotes, setMascotNotes] = useState('');
  const [durationSec, setDurationSec] = useState<number>(25);

  // Progressive Focus & Folding States
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isOptionalExpanded, setIsOptionalExpanded] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  const previewNextId = generateNextId(
    'FT',
    computedFootage.map((f) => f.id)
  );
  const previewFileName = generateStandardFileName(previewNextId, title || 'ชื่อช็อตฮา');

  // Step Validation States
  const isStep1Complete = Boolean(title.trim() && originalUrl.trim());
  const isStep2Complete = selectedTags.length > 0;
  const optionalCount =
    (mascotNotes.trim() ? 1 : 0) +
    (driveFileUrl.trim() ? 1 : 0) +
    (durationSec !== 25 ? 1 : 0);

  const handleCopyPreviewName = () => {
    navigator.clipboard?.writeText(previewFileName);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setActiveStep(1);
      return;
    }

    addDirectFootage({
      title: title.trim(),
      originalUrl: originalUrl.trim() || 'https://www.tiktok.com/@funny/video/new',
      tags: selectedTags.length > 0 ? selectedTags : mainCategories[0]?.id ? [mainCategories[0].id] : [],
      driveFileUrl: driveFileUrl.trim(),
      mascotNotes: mascotNotes.trim(),
      durationSec: durationSec || 25,
    });

    // Reset Form to initial clean state
    setTitle('');
    setOriginalUrl('');
    setSelectedTags([]);
    setDriveFileUrl('');
    setMascotNotes('');
    setDurationSec(25);
    setActiveStep(1);
    setIsOptionalExpanded(false);
    setIsDirectFootageModalOpen(false);
  };

  return (
    <Modal
      isOpen={isDirectFootageModalOpen}
      onClose={() => setIsDirectFootageModalOpen(false)}
      title="📹 นำเข้าฟุตเดี่ยวพร้อมใช้ (Flow 1:1)"
      subtitle="ระบบนำทาง 3 สเต็ปพร้อมแสงเรืองเน้นทีละขั้นตอน — กรอกเฉพาะส่วนหลักก็บันทึกได้ทันที"
      maxWidthClass="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* =====================================================================
            TOP BAR: Auto-ID & Standard Drive File Name Strip with Copy Action
        ====================================================================== */}
        <div className="bg-slate-900 text-white rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-amber-400 text-slate-950 rounded-lg shrink-0">
              {previewNextId}
            </span>
            <div className="min-w-0">
              <span className="text-[11px] text-slate-400 block truncate">
                ชื่อไฟล์มาตรฐาน Google Drive
              </span>
              <span
                className="text-xs font-mono font-medium text-slate-200 truncate block"
                title={previewFileName}
              >
                📁 {previewFileName}
              </span>
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyPreviewName}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl shrink-0 transition-colors cursor-pointer border border-slate-700/80"
            title="คัดลอกชื่อไฟล์สำหรับตั้งชื่อในเครื่องก่อนอัปขึ้น Drive"
          >
            {copiedFile ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>คัดลอกชื่อไฟล์</span>
              </>
            )}
          </motion.button>
        </div>

        {/* =====================================================================
            PROGRESSIVE STEP RIBBON: 3 CLEAR GUIDED PHASES
        ====================================================================== */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 select-none">
          {/* Step 1 Tab Button */}
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`relative p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
              activeStep === 1
                ? 'bg-white text-sky-950 font-bold shadow-xs border border-sky-300 ring-2 ring-sky-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                  isStep1Complete
                    ? 'bg-emerald-500 text-white'
                    : activeStep === 1
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isStep1Complete ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <div className="min-w-0">
                <div className="text-xs truncate">1. ข้อมูลคลิป</div>
                <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                  {isStep1Complete ? 'กรอกครบแล้ว' : 'จำเป็นต้องกรอก'}
                </div>
              </div>
            </div>
            {isStep1Complete && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            )}
          </button>

          {/* Step 2 Tab Button */}
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`relative p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
              activeStep === 2
                ? 'bg-white text-emerald-950 font-bold shadow-xs border border-emerald-300 ring-2 ring-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                  isStep2Complete
                    ? 'bg-emerald-600 text-white'
                    : activeStep === 2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isStep2Complete ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <div className="min-w-0">
                <div className="text-xs truncate">2. หมวดหมู่</div>
                <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                  {selectedTags.length} แท็ก
                </div>
              </div>
            </div>
            {isStep2Complete && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            )}
          </button>

          {/* Step 3 Tab Button */}
          <button
            type="button"
            onClick={() => {
              setActiveStep(3);
              setIsOptionalExpanded(true);
            }}
            className={`relative p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
              activeStep === 3
                ? 'bg-white text-amber-950 font-bold shadow-xs border border-amber-300 ring-2 ring-amber-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                  optionalCount > 0
                    ? 'bg-amber-500 text-white'
                    : activeStep === 3
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </span>
              <div className="min-w-0">
                <div className="text-xs truncate">3. ข้อมูลเสริม</div>
                <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                  {optionalCount > 0 ? `กรอกแล้ว ${optionalCount}` : 'ไม่บังคับ'}
                </div>
              </div>
            </div>
            {optionalCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            )}
          </button>
        </div>

        {/* =====================================================================
            STEP 1 SECTION (SKY / CYAN AMBIENT GLOW): Core Clip Info (Required)
        ====================================================================== */}
        <div
          onClick={() => setActiveStep(1)}
          className={`rounded-2xl p-4 sm:p-4.5 space-y-3.5 transition-all duration-200 ${
            activeStep === 1
              ? 'bg-white border-2 border-sky-400 ring-4 ring-sky-500/15 shadow-[0_4px_24px_rgba(14,165,233,0.14)]'
              : 'bg-slate-50/70 border border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                  activeStep === 1 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                1
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                🎬 ข้อมูลคลิปต้นฉบับ
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isStep1Complete ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>ข้อมูลพร้อม</span>
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                  จำเป็นต้องกรอก
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                ชื่อช็อตฮา / รายละเอียดมุก *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={title}
                onFocus={() => setActiveStep(1)}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น ลุงขับซาเล้งเปิดไฟเลี้ยวซ้ายแต่เลี้ยวขวา, หมาวิ่งตัดหน้านักวิ่ง..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                🔗 ลิงก์คลิปต้นฉบับ (TikTok / Reels / FB / Shorts) *
              </label>
              <input
                type="url"
                required
                value={originalUrl}
                onFocus={() => setActiveStep(1)}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@creator/video/..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-400 font-mono text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Quick Flow Forward Shortcut if Step 1 is done */}
          {activeStep === 1 && isStep1Complete && (
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStep(2);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-lg transition-colors cursor-pointer"
              >
                <span>ไปต่อ: เลือกหมวดหมู่ (สเต็ป 2)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* =====================================================================
            STEP 2 SECTION (EMERALD AMBIENT GLOW): Category & Multi-Tags
        ====================================================================== */}
        <div
          onClick={() => setActiveStep(2)}
          className={`rounded-2xl p-4 sm:p-4.5 space-y-3 transition-all duration-200 ${
            activeStep === 2
              ? 'bg-white border-2 border-emerald-400 ring-4 ring-emerald-500/15 shadow-[0_4px_24px_rgba(16,185,129,0.14)]'
              : 'bg-slate-50/70 border border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                  activeStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                2
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                🏷️ หมวดหมู่ & ป้ายกำกับฟุตเทจ
              </span>
            </div>

            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              เลือกแล้ว {selectedTags.length} แท็ก
            </span>
          </div>

          <div onFocus={() => setActiveStep(2)}>
            <TagSelectorInput
              selectedTagIds={selectedTags}
              onChange={setSelectedTags}
              label="คลิกเลือกแท็กหลักและแท็กย่อยที่เกี่ยวข้องด้านล่าง"
            />
          </div>

          {/* Quick Flow Forward Shortcut if Step 2 is done */}
          {activeStep === 2 && isStep2Complete && !isOptionalExpanded && (
            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                หากไม่มีข้อมูลเสริม สามารถกดปุ่มบันทึกด้านล่างได้ทันที
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStep(3);
                  setIsOptionalExpanded(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors cursor-pointer"
              >
                <span>เปิดดูข้อมูลเสริม (สเต็ป 3)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* =====================================================================
            STEP 3 SECTION: Collapsible Optional Details (Framer Motion Isolator)
        ====================================================================== */}
        <div
          className={`rounded-2xl overflow-hidden transition-all duration-200 ${
            activeStep === 3 && isOptionalExpanded
              ? 'bg-white border-2 border-amber-400 ring-4 ring-amber-500/15 shadow-[0_4px_24px_rgba(245,158,11,0.14)]'
              : 'bg-amber-50/40 border border-amber-200/80 hover:border-amber-300'
          }`}
        >
          {/* Collapsible Accordion Header */}
          <button
            type="button"
            onClick={() => {
              const nextState = !isOptionalExpanded;
              setIsOptionalExpanded(nextState);
              if (nextState) setActiveStep(3);
            }}
            className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-amber-100/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                  activeStep === 3 && isOptionalExpanded
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-200/80 text-amber-900'
                }`}
              >
                3
              </span>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-amber-950 block truncate">
                  ⚙️ ข้อมูลเสริม (มุกมาสคอต · ลิงก์ Drive · ความยาว)
                </span>
                <span className="text-[11px] text-amber-800/80 block">
                  {optionalCount > 0
                    ? `กรอกข้อมูลเสริมแล้ว ${optionalCount} รายการ`
                    : 'ไม่บังคับ — พับเก็บไว้เป็นค่าเริ่มต้นเพื่อความรวดเร็ว'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {optionalCount > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-950 rounded-md">
                  มีข้อมูลแล้ว
                </span>
              ) : (
                <span className="text-[11px] font-medium text-amber-700">
                  {isOptionalExpanded ? 'พับเก็บ' : 'คลิกเพื่อเปิดกรอก'}
                </span>
              )}
              <motion.div
                animate={{ rotate: isOptionalExpanded ? 180 : 0 }}
                transition={{ duration: 0.18 }}
              >
                <ChevronDown className="w-4 h-4 text-amber-800" />
              </motion.div>
            </div>
          </button>

          {/* Framer Motion Height Controller: strictly p-0, m-0, border-none to prevent layout jump */}
          <AnimatePresence initial={false}>
            {isOptionalExpanded && (
              <motion.div
                key="optional-fields-container"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden p-0 m-0 border-none"
              >
                {/* Inner Padding Container */}
                <div className="p-4 pt-3.5 space-y-3.5 border-t border-amber-200/70 bg-white">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      🎙️ ไกด์มุกมาสคอตเชื่อมเรื่อง (Mascot Notes)
                    </label>
                    <textarea
                      rows={2}
                      value={mascotNotes}
                      onFocus={() => setActiveStep(3)}
                      onChange={(e) => setMascotNotes(e.target.value)}
                      placeholder="ระบุจุดพีคของคลิป หรือประโยคตบมุกให้คนเขียนบทมาสคอตตอนนำไปร้อยเรียง..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        📁 ลิงก์ไฟล์ใน Google Drive (ถ้าอัปโหลดแล้ว)
                      </label>
                      <input
                        type="url"
                        value={driveFileUrl}
                        onFocus={() => setActiveStep(3)}
                        onChange={(e) => setDriveFileUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/..."
                        className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        ⏱️ ความยาว (วินาที)
                      </label>
                      <input
                        type="number"
                        min={3}
                        max={300}
                        value={durationSec}
                        onFocus={() => setActiveStep(3)}
                        onChange={(e) => setDurationSec(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =====================================================================
            ACTION BAR FOOTER
        ====================================================================== */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {!title.trim() ? (
              <span className="text-amber-700 font-medium flex items-center gap-1.5">
                <span>⚠️ โปรดระบุชื่อช็อตฮาในสเต็ปที่ 1</span>
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>พร้อมบันทึกฟุตเดี่ยวเข้าสู่คลังทันที</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsDirectFootageModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition-all whitespace-nowrap shadow-sm cursor-pointer"
            >
              <span>💾 บันทึกฟุตเดี่ยว ({previewNextId})</span>
              <Check className="w-3.5 h-3.5 text-amber-400" />
            </motion.button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

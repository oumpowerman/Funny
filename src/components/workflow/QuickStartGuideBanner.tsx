import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const QuickStartGuideBanner: React.FC = () => {
  const {
    setActiveTab,
    setIsDirectFootageModalOpen,
    openSourceSplitterFor,
  } = useCMS();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className="bg-gradient-to-r from-indigo-50/90 via-sky-50/80 to-emerald-50/70 text-slate-900 rounded-2xl border border-indigo-200/80 shadow-2xs overflow-hidden"
    >
      {/* Top Bar of the Guide */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/60 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg shrink-0">🧭</span>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              คู่มือลัด 4 ขั้นตอน: 1. ➕ เติมฟุต → 2. 🟢 เช็กความสด → 3. 🏆 จัด 5 อันดับ → 4. 📦 ดูภาพรวมความคุ้มค่า
            </h2>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-xl shrink-0 shadow-2xs"
        >
          <span>{isExpanded ? 'พับเก็บ' : '💡 ดูวิธีใช้'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </motion.button>
      </div>

      {/* 4 Compact Emoji Step Cards */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-indigo-100/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {/* Step 1 */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold text-indigo-700">
                    1️⃣ เติมวัตถุดิบ (FT-XXXX)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    📹 <strong>คลิปสั้น:</strong> กด <em>&ldquo;+ ฟุตเดี่ยว 1:1&rdquo;</em>
                    <br />
                    ✂️ <strong>ไลฟ์สด/คลิปยาว:</strong> กด <em>&ldquo;หั่นไลฟ์ 1:N&rdquo;</em>
                  </p>
                </div>
                <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDirectFootageModalOpen(true)}
                    className="flex-1 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg hover:bg-indigo-100 cursor-pointer"
                  >
                    ➕ 1:1 เดี่ยว
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openSourceSplitterFor(null)}
                    className="flex-1 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                  >
                    ✂️ 1:N หั่นไลฟ์
                  </motion.button>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold text-sky-700">
                    2️⃣ ดูสีความสด (Time-Decay)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    🔵 <strong>ใหม่:</strong> หยิบใช้ได้เลย
                    <br />
                    🟢 <strong>พร้อมใช้:</strong> พักเกิน 14 วัน วนใช้ได้!
                    <br />
                    🔴 <strong>รอพัก:</strong> เพิ่งใช้ใน 14 วัน ห้ามซ้ำ
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('FOOTAGE_LIBRARY')}
                  className="w-full py-1.5 text-xs font-bold bg-sky-50 text-sky-900 border border-sky-200 rounded-lg hover:bg-sky-100 cursor-pointer"
                >
                  🎞️ เปิดคลังฟุตเทจ →
                </motion.button>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold text-emerald-700">
                    3️⃣ ผสมชุด 5 อันดับ (5→1)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    🎲 กดปุ่ม <strong>&ldquo;สูตร 2 ใหม่ + 3 เก่า&rdquo;</strong> ระบบสุ่มจัด 5 อันดับที่ไม่เคยเจอกันให้ทันที
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('EPISODE_BUILDER')}
                  className="w-full py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                >
                  🏆 ไปหน้าจัด 5 อันดับ →
                </motion.button>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold text-indigo-700">
                    4️⃣ ดูภาพรวมคลังคลิปหลัก
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    📦 เปรียบเทียบสัดส่วนหมวดหมู่จากมากไปน้อย และเช็กความคุ้มค่าการใช้ฟุตเทจ
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('MASTER_ARCHIVE')}
                  className="w-full py-1.5 text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg hover:bg-indigo-100 cursor-pointer"
                >
                  📦 เปิดคลังคลิปหลัก →
                </motion.button>
              </motion.div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

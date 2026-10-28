import React, { useEffect, useMemo, useState } from 'react';
import { Check, RotateCcw, Sliders } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { INITIAL_SETTINGS } from '../../services/seedData';
import { SystemSettings } from '../../types/tag.types';
import { simulateStatusDistribution } from '../../utils/cooldownCalculator';
import { Modal } from '../ui/Modal';

export const StatusColorRulesModal: React.FC = () => {
  const {
    isStatusRuleModalOpen,
    setIsStatusRuleModalOpen,
    settings,
    updateSettings,
    computedFootage,
  } = useCMS();

  const [cooldownDays, setCooldownDays] = useState<number>(settings.cooldownDays ?? 14);
  const [greenReadyDays, setGreenReadyDays] = useState<number>(
    settings.greenReadyDays ?? 21
  );
  const [maxUsagePer90Days, setMaxUsagePer90Days] = useState<number>(
    settings.maxUsagePer90Days ?? 3
  );
  const [yellowTotalUsageCount, setYellowTotalUsageCount] = useState<number>(
    settings.yellowTotalUsageCount ?? 4
  );
  const [maxTotalUsageCount, setMaxTotalUsageCount] = useState<number>(
    settings.maxTotalUsageCount ?? 8
  );
  const [savedToast, setSavedToast] = useState(false);

  // Sync local inputs when modal opens or external settings update
  useEffect(() => {
    if (isStatusRuleModalOpen) {
      setCooldownDays(settings.cooldownDays ?? 14);
      setGreenReadyDays(settings.greenReadyDays ?? 21);
      setMaxUsagePer90Days(settings.maxUsagePer90Days ?? 3);
      setYellowTotalUsageCount(settings.yellowTotalUsageCount ?? 4);
      setMaxTotalUsageCount(settings.maxTotalUsageCount ?? 8);
      setSavedToast(false);
    }
  }, [isStatusRuleModalOpen, settings]);

  // Normalized draft settings for real-time simulation
  const draftSettings: SystemSettings = useMemo(() => {
    const safeRedDays = Math.max(1, Number(cooldownDays) || 1);
    const safeGreenDays = Math.max(safeRedDays, Number(greenReadyDays) || safeRedDays);
    const safeYellow90 = Math.max(1, Number(maxUsagePer90Days) || 1);
    const safeYellowTotal = Math.max(1, Number(yellowTotalUsageCount) || 1);
    const safeRedMaxTotal = Math.max(
      safeYellowTotal + 1,
      Number(maxTotalUsageCount) || safeYellowTotal + 1
    );

    return {
      ...settings,
      cooldownDays: safeRedDays,
      greenReadyDays: safeGreenDays,
      maxUsagePer90Days: safeYellow90,
      yellowTotalUsageCount: safeYellowTotal,
      maxTotalUsageCount: safeRedMaxTotal,
    };
  }, [
    settings,
    cooldownDays,
    greenReadyDays,
    maxUsagePer90Days,
    yellowTotalUsageCount,
    maxTotalUsageCount,
  ]);

  // Live Simulated Counts across the entire footage vault
  const livePreview = useMemo(
    () => simulateStatusDistribution(computedFootage, draftSettings),
    [computedFootage, draftSettings]
  );

  const applyPreset = (preset: {
    cooldownDays: number;
    greenReadyDays: number;
    maxUsagePer90Days: number;
    yellowTotalUsageCount: number;
    maxTotalUsageCount: number;
  }) => {
    setCooldownDays(preset.cooldownDays);
    setGreenReadyDays(preset.greenReadyDays);
    setMaxUsagePer90Days(preset.maxUsagePer90Days);
    setYellowTotalUsageCount(preset.yellowTotalUsageCount);
    setMaxTotalUsageCount(preset.maxTotalUsageCount);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      cooldownDays: draftSettings.cooldownDays,
      greenReadyDays: draftSettings.greenReadyDays,
      maxUsagePer90Days: draftSettings.maxUsagePer90Days,
      yellowTotalUsageCount: draftSettings.yellowTotalUsageCount,
      maxTotalUsageCount: draftSettings.maxTotalUsageCount,
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setIsStatusRuleModalOpen(false);
    }, 900);
  };

  return (
    <Modal
      isOpen={isStatusRuleModalOpen}
      onClose={() => setIsStatusRuleModalOpen(false)}
      title="🎨 ตั้งค่าเกณฑ์สีสถานะฟุตเทจ (🔵 ฟ้า · 🟢 เขียว · 🟡 เหลือง · 🔴 แดง)"
      subtitle="กำหนดตัวเลขจำนวนวันพักและจำนวนครั้งที่ใช้ซ้ำได้เอง พร้อมจำลองผลลัพธ์จำนวนคลิปในคลังแบบเรียลไทม์ทันที"
      maxWidthClass="max-w-4xl"
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* =================================================================
            1. LIVE VAULT SIMULATION PREVIEW BAR (ดูผลทันทีเมื่อปรับตัวเลข)
           ================================================================= */}
        <div className="bg-indigo-50/60 border border-indigo-200/90 rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                ผลลัพธ์จำนวนฟุตเทจในคลังตามตัวเลขที่ตั้งด้านล่าง (จากทั้งหมด {computedFootage.length} คลิป)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
              พร้อมหยิบใช้งานรวม (🔵+🟢): {livePreview.totalUsable} คลิป
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white border border-sky-200 rounded-xl p-3">
              <div className="text-xs font-bold text-sky-800">🔵 สีฟ้า (ใหม่แกะกล่อง)</div>
              <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-xl font-extrabold text-sky-700">
                  {livePreview.blueNew}
                </span>
                <span className="text-[11px] text-slate-500">ใช้ 0 ครั้ง</span>
              </div>
            </div>

            <div className="bg-white border border-emerald-200 rounded-xl p-3">
              <div className="text-xs font-bold text-emerald-800">🟢 สีเขียว (พร้อมวนใช้)</div>
              <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-xl font-extrabold text-emerald-700">
                  {livePreview.greenReady}
                </span>
                <span className="text-[11px] text-emerald-700">
                  พัก ≥ {draftSettings.greenReadyDays} วัน
                </span>
              </div>
            </div>

            <div className="bg-white border border-amber-200 rounded-xl p-3">
              <div className="text-xs font-bold text-amber-800">🟡 สีเหลือง (เฝ้าระวัง)</div>
              <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-xl font-extrabold text-amber-700">
                  {livePreview.yellowWarning}
                </span>
                <span className="text-[11px] text-amber-800">
                  ใช้ ≥ {draftSettings.maxUsagePer90Days} ครั้ง/90วัน
                </span>
              </div>
            </div>

            <div className="bg-white border border-rose-200 rounded-xl p-3">
              <div className="text-xs font-bold text-rose-800">🔴 สีแดง (ห้ามใช้ซ้ำ)</div>
              <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-xl font-extrabold text-rose-700">
                  {livePreview.redCooldown}
                </span>
                <span className="text-[11px] text-rose-700">
                  พัก &lt; {draftSettings.cooldownDays} วัน
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            2. QUICK PRESETS (ชุดค่าสำเร็จรูป 1 คลิก)
           ================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <span className="text-xs font-bold text-slate-700">
            ⚡ เลือกชุดเกณฑ์มาตรฐานด่วน:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  cooldownDays: 14,
                  greenReadyDays: 21,
                  maxUsagePer90Days: 3,
                  yellowTotalUsageCount: 4,
                  maxTotalUsageCount: 8,
                })
              }
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-indigo-50 text-slate-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              ⭐ มาตรฐาน (แดง &lt;14วัน · เขียว ≥21วัน · เตือน ≥3ครั้ง)
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  cooldownDays: 30,
                  greenReadyDays: 45,
                  maxUsagePer90Days: 2,
                  yellowTotalUsageCount: 3,
                  maxTotalUsageCount: 5,
                })
              }
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-indigo-50 text-slate-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              🛡️ เข้มงวดกันคลิปช้ำ (แดง &lt;30วัน · เขียว ≥45วัน · เตือน ≥2ครั้ง)
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  cooldownDays: 7,
                  greenReadyDays: 7,
                  maxUsagePer90Days: 4,
                  yellowTotalUsageCount: 6,
                  maxTotalUsageCount: 12,
                })
              }
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-indigo-50 text-slate-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              🚀 หมุนเวียนไว (แดง &lt;7วัน · เขียว ≥7วัน · เตือน ≥4ครั้ง)
            </button>
          </div>
        </div>

        {/* =================================================================
            3. FOUR COLOR RULE CONFIGURATOR CARDS (ตั้งค่าตัวเลขของแต่ละสีโดยตรง)
           ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CARD 1: 🔵 BLUE */}
          <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-sky-950">
                  🔵 1. เกณฑ์สีฟ้า (คลิปใหม่แกะกล่อง)
                </h3>
                <span className="text-xs font-mono font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                  อัตโนมัติ
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ฟุตเทจที่เพิ่งนำเข้าคลัง (ทั้งแบบเดี่ยว 1:1 และหั่นจากไลฟ์ 1:N) และยังไม่เคยถูกนำไปจัดในคลิปหลัก 5 อันดับตอนใดเลย
              </p>
            </div>

            <div className="bg-white border border-sky-200/80 rounded-xl p-3 text-xs font-mono text-sky-900">
              เงื่อนไขตายตัว: จำนวนครั้งที่ถูกนำไปใช้สะสม = <strong>0 ครั้ง</strong>
            </div>
          </div>

          {/* CARD 2: 🟢 GREEN */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-emerald-950">
                  🟢 2. เกณฑ์สีเขียว (พักจนสดพร้อมวนใช้)
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  พร้อมหยิบผสม
                </span>
              </div>
              <p className="text-xs text-slate-600">
                กำหนดว่าฟุตเทจที่เคยใช้แล้ว ต้องพักอย่างน้อยกี่วันจึงจะเปลี่ยนเป็นสีเขียวสดพร้อมนำกลับมาวนใช้ใหม่
              </p>
            </div>

            <div className="bg-white border border-emerald-200/80 rounded-xl p-3 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                ต้องพักอย่างน้อยกี่วันถึงขึ้น 🟢 สีเขียว (วัน):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={draftSettings.cooldownDays}
                  max={365}
                  value={greenReadyDays}
                  onChange={(e) => setGreenReadyDays(Number(e.target.value))}
                  className="w-28 px-3 py-1.5 text-sm font-mono font-extrabold text-emerald-800 bg-emerald-50/50 border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
                <span className="text-xs text-slate-600">
                  วันขึ้นไป (และใช้ซ้ำไม่ถึงเกณฑ์สีเหลือง)
                </span>
              </div>
            </div>
          </div>

          {/* CARD 3: 🟡 YELLOW */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-amber-950">
                  🟡 3. เกณฑ์สีเหลือง (เฝ้าระวังเริ่มใช้บ่อย / เพิ่งพ้นพัก)
                </h3>
                <span className="text-xs font-mono font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                  แจ้งเตือนใช้ถี่
                </span>
              </div>
              <p className="text-xs text-slate-600">
                ฟุตเทจจะขึ้นสีเหลืองเมื่อพ้นระยะสีแดงแล้วแต่ยังพักไม่ถึงเกณฑ์สีเขียว หรือถูกหยิบใช้ซ้ำถึงจำนวนครั้งที่กำหนดด้านล่าง
              </p>
            </div>

            <div className="bg-white border border-amber-200/80 rounded-xl p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ใช้ซ้ำในรอบ 90 วันตั้งแต่ (ครั้ง):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={maxUsagePer90Days}
                    onChange={(e) => setMaxUsagePer90Days(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-extrabold text-amber-900 bg-amber-50/50 border border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    หรือใช้สะสมรวมตั้งแต่ (ครั้ง):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={yellowTotalUsageCount}
                    onChange={(e) => setYellowTotalUsageCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-extrabold text-amber-900 bg-amber-50/50 border border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="text-[11px] font-mono text-amber-900 pt-1 border-t border-amber-100">
                {draftSettings.greenReadyDays > draftSettings.cooldownDays ? (
                  <span>
                    💡 ช่วงวันพักสีเหลืองอัตโนมัติ: พักได้{' '}
                    <strong>
                      {draftSettings.cooldownDays} ถึง {draftSettings.greenReadyDays - 1} วัน
                    </strong>{' '}
                    = 🟡 สีเหลือง
                  </span>
                ) : (
                  <span>
                    💡 วันพักสีเขียวเท่ากับสีแดง ({draftSettings.cooldownDays} วัน) จึงวัดสีเหลืองจากจำนวนครั้งที่ใช้ซ้ำอย่างเดียว
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CARD 4: 🔴 RED */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-4 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-rose-950">
                  🔴 4. เกณฑ์สีแดง (ห้ามใช้ซ้ำ / ติดระยะพักคูลดาวน์)
                </h3>
                <span className="text-xs font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                  ล็อกห้ามซ้ำ
                </span>
              </div>
              <p className="text-xs text-slate-600">
                ฟุตเทจจะขึ้นสีแดงและถูกแยกออกจากตะกร้าพร้อมใช้ เมื่อเพิ่งถูกใช้งานไปไม่นาน หรือถูกใช้ซ้ำจนครบเพดานสูงสุดแล้ว
              </p>
            </div>

            <div className="bg-white border border-rose-200/80 rounded-xl p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    เพิ่งใช้งานไปไม่ถึง (วัน):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={cooldownDays}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCooldownDays(val);
                      if (greenReadyDays < val) {
                        setGreenReadyDays(val);
                      }
                    }}
                    className="w-full px-3 py-1.5 text-sm font-mono font-extrabold text-rose-800 bg-rose-50/50 border border-rose-300 rounded-lg focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    หรือใช้สะสมครบเพดานสูงสุด (ครั้ง):
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={100}
                    value={maxTotalUsageCount}
                    onChange={(e) => setMaxTotalUsageCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-extrabold text-rose-800 bg-rose-50/50 border border-rose-300 rounded-lg focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div className="text-[11px] font-mono text-rose-800 pt-1 border-t border-rose-100">
                🔒 เพิ่งใช้ภายใน <strong>&lt; {draftSettings.cooldownDays} วัน</strong> หรือใช้ครบ{' '}
                <strong>{draftSettings.maxTotalUsageCount} ครั้ง</strong> = 🔴 สีแดงทันที
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            4. FOOTER ACTIONS
           ================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => applyPreset(INITIAL_SETTINGS)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้นของระบบ</span>
          </button>

          <div className="flex items-center gap-3">
            {savedToast && (
              <span className="text-xs font-bold text-emerald-700">
                ✅ บันทึกเกณฑ์สีทั้ง 4 สถานะเรียบร้อยแล้ว!
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsStatusRuleModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกเกณฑ์สีสถานะ 🔵🟢🟡🔴</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

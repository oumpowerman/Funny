import React from 'react';
import { FolderTree, Trash2, RotateCcw, X, Sparkles, Plus, Info } from 'lucide-react';

interface ThreeTierModalHeaderProps {
  onRequestWipe: () => void;
  onRestoreDefaults: () => void;
  onClose: () => void;
}

export const ThreeTierModalHeader: React.FC<ThreeTierModalHeaderProps> = ({
  onRequestWipe,
  onRestoreDefaults,
  onClose,
}) => {
  return (
    <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
          <FolderTree className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            จัดการโครงสร้างหมวดหมู่ 3 ชั้น (3-Tier Taxonomy Studio)
          </h2>
          <p className="text-[11px] text-slate-500">
            กลุ่มหมวดหมู่ (Tier 0) ➔ หมวดหมู่หลัก (Tier 1) ➔ หมวดหมู่ย่อย / บุคคล (Tier 2)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRequestWipe}
          className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="ล้างโครงสร้างหมวดหมู่ทั้งหมดเพื่อเริ่มใส่ข้อมูลของคุณเอง"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>ล้างทั้งหมดเพื่อเริ่มใหม่</span>
        </button>

        <button
          type="button"
          onClick={onRestoreDefaults}
          className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="โหลดชุดหมวดหมู่ตัวอย่างกลับมา"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">คืนค่าตัวอย่าง</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

interface ThreeTierEmptyStateProps {
  onOpenAddGroup: () => void;
  onRestoreDefaults: () => void;
}

export const ThreeTierEmptyState: React.FC<ThreeTierEmptyStateProps> = ({
  onOpenAddGroup,
  onRestoreDefaults,
}) => {
  return (
    <div className="flex-1 p-10 flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
        <Sparkles className="w-7 h-7" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-base font-bold text-slate-800">
          ฐานข้อมูลหมวดหมู่ว่างเปล่า พร้อมสำหรับข้อมูลจริงของคุณแล้ว
        </h3>
        <p className="text-xs text-slate-500">
          คุณสามารถเริ่มสร้างกลุ่มหมวดหมู่แรก (เช่น &quot;คนมีชื่อเสียง&quot;, &quot;คอนเทนต์เกม&quot;, หรือ &quot;วิถีชีวิต&quot;) เพื่อเริ่มจัดหมวดหมู่คลิป
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenAddGroup}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ สร้างกลุ่มหมวดหมู่แรกของคุณ</span>
        </button>
        <button
          type="button"
          onClick={onRestoreDefaults}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
        >
          โหลดโครงสร้างตัวอย่าง
        </button>
      </div>
    </div>
  );
};

interface ThreeTierModalFooterProps {
  onClose: () => void;
}

export const ThreeTierModalFooter: React.FC<ThreeTierModalFooterProps> = ({ onClose }) => {
  return (
    <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
      <div className="flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-indigo-500" />
        <span>
          ข้อมูลโครงสร้างจะอัปเดตแบบเรียลไทม์ และนำไปแสดงผลในตัวเลือกหมวดหมู่ทันที
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs cursor-pointer"
      >
        เสร็จสิ้น
      </button>
    </div>
  );
};

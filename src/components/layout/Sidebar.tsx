import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Archive,
  ChevronRight,
  Cloud,
  Film,
  FolderTree,
  LayoutDashboard,
  ListOrdered,
  Lock,
  Palette,
  RefreshCw,
  Scissors,
  Settings2,
  ShieldCheck,
  Trash2,
  Tv,
} from 'lucide-react';
import { ActiveNavTab, useCMS } from '../../context/CMSContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    computedFootage,
    sources,
    episodes,
    tags,
    settings,
    setIsTagManagerOpen,
    setIsThreeTierManagerOpen,
    setIsStatusRuleModalOpen,
    setIsClearClipsModalOpen,
    isCloudConnected,
    isSeedingToCloud,
    seedToCloud,
  } = useCMS();

  const { role, setIsAuthModalOpen } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const navItems: {
    id: ActiveNavTab;
    emoji: string;
    label: string;
    sublabel: string;
    count?: number;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'DASHBOARD',
      emoji: '📊',
      label: 'ภาพรวมช่อง',
      sublabel: 'Matrix & สต็อกฟุต',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'FOOTAGE_LIBRARY',
      emoji: '🎞️',
      label: 'คลังฟุตเทจ',
      sublabel: '1:1 & 1:N Vault',
      count: computedFootage.length,
      icon: <Film className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'SOURCE_SPLITTER',
      emoji: '✂️',
      label: 'หั่นคลิปยาว',
      sublabel: '1:N Splitter',
      count: sources.length,
      icon: <Scissors className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'EPISODE_BUILDER',
      emoji: '🏆',
      label: 'จัด 5 อันดับ',
      sublabel: 'Smart Mix 5→1',
      icon: <ListOrdered className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'MASTER_ARCHIVE',
      emoji: '📦',
      label: 'คลังคลิปหลัก',
      sublabel: 'สัดส่วนหมวด & ความคุ้มค่า',
      count: episodes.length,
      icon: <Archive className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{ width: isHovered ? 248 : 72 }}
      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
      className="hidden md:flex h-screen sticky top-0 z-30 bg-white text-slate-700 flex-col justify-between shrink-0 border-r border-slate-200/90 shadow-xs select-none overflow-hidden"
    >
      <div className="p-3 space-y-4 overflow-y-auto no-scrollbar">
        {/* Studio Brand Identity */}
        <div className="flex items-center gap-3 px-1.5 py-1.5 border-b border-slate-100">
          <motion.div
            whileHover={{ rotate: -4, scale: 1.03 }}
            onClick={() => setActiveTab('DASHBOARD')}
            className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs cursor-pointer"
            title="กลับหน้าภาพรวม"
          >
            <Tv className="w-4 h-4" />
          </motion.div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveTab('DASHBOARD')}
                className="min-w-0 flex-1 overflow-hidden whitespace-nowrap cursor-pointer"
              >
                <div className="text-sm font-bold text-slate-900 tracking-tight truncate">
                  เรียงเรื่องลั่น
                </div>
                <div className="text-[11px] text-slate-500 font-medium truncate">
                  Footage Utilization CMS
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ x: isHovered ? 2 : 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                title={!isHovered ? `${item.emoji} ${item.label}` : undefined}
                className={`relative w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'text-indigo-950 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-indigo-50/90 border border-indigo-200/80 rounded-xl"
                  />
                )}

                <div className="relative z-10 flex items-center gap-3 min-w-0">
                  <span
                    className="text-base leading-none shrink-0 w-6 text-center"
                    aria-hidden="true"
                  >
                    {item.emoji}
                  </span>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="min-w-0 overflow-hidden whitespace-nowrap"
                      >
                        <div className="text-xs font-bold truncate">{item.label}</div>
                        <div
                          className={`text-[10px] truncate ${
                            isActive ? 'text-indigo-700' : 'text-slate-400'
                          }`}
                        >
                          {item.sublabel}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isHovered && item.count !== undefined && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative z-10 text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 font-semibold'
                    }`}
                  >
                    {item.count}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Neutral System & Configuration Tools */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 space-y-1">
        {isHovered && (
          <div className="px-2.5 pt-0.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ตั้งค่าและจัดการระบบ
          </div>
        )}

        {/* 1. 3-Tier Category Manager */}
        <button
          type="button"
          onClick={() => setIsThreeTierManagerOpen(true)}
          title="จัดการหมวดหมู่ 3 ชั้น (กลุ่ม ➔ หมวดหลัก ➔ หมวดย่อย)"
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors overflow-hidden cursor-pointer"
        >
          <span className="inline-flex items-center gap-3 whitespace-nowrap min-w-0">
            <FolderTree className="w-4 h-4 text-slate-500 shrink-0 mx-auto" />
            {isHovered && <span className="truncate font-semibold">หมวดหมู่ 3 ชั้น</span>}
          </span>
          {isHovered && (
            <span className="font-mono text-[10px] text-slate-400 shrink-0">3-Tier</span>
          )}
        </button>

        {/* 2. Tag & Cooldown Velocity Manager */}
        <button
          type="button"
          onClick={() => setIsTagManagerOpen(true)}
          title="ตั้งค่าแท็ก & กฎพักฟุต"
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors overflow-hidden cursor-pointer"
        >
          <span className="inline-flex items-center gap-3 whitespace-nowrap min-w-0">
            <Settings2 className="w-4 h-4 text-slate-500 shrink-0 mx-auto" />
            {isHovered && <span className="truncate font-semibold">แท็ก & กฎพักฟุต</span>}
          </span>
          {isHovered && (
            <span className="font-mono tabular-nums text-[10px] text-slate-500 font-semibold shrink-0">
              {tags.length} หมวด
            </span>
          )}
        </button>

        {/* 3. Status Color Rules */}
        <button
          type="button"
          onClick={() => setIsStatusRuleModalOpen(true)}
          title="ตั้งค่าเกณฑ์สีสถานะ (จำนวนวันพัก & จำนวนครั้งที่ใช้ซ้ำ)"
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors overflow-hidden cursor-pointer"
        >
          <span className="inline-flex items-center gap-3 whitespace-nowrap min-w-0">
            <Palette className="w-4 h-4 text-slate-500 shrink-0 mx-auto" />
            {isHovered && <span className="truncate font-semibold">เกณฑ์สีสถานะ</span>}
          </span>
          {isHovered && (
            <span className="font-mono tabular-nums text-[10px] text-slate-500 shrink-0">
              ≥{settings.greenReadyDays ?? 21}ว.
            </span>
          )}
        </button>

        {/* 4. Cloud / Firestore Sync */}
        <button
          type="button"
          onClick={seedToCloud}
          disabled={isSeedingToCloud}
          title="ซิงก์ข้อมูลกับ Firestore Cloud"
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors overflow-hidden cursor-pointer disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-3 whitespace-nowrap min-w-0">
            {isSeedingToCloud ? (
              <RefreshCw className="w-4 h-4 text-slate-500 animate-spin shrink-0 mx-auto" />
            ) : (
              <Cloud className="w-4 h-4 text-slate-500 shrink-0 mx-auto" />
            )}
            {isHovered && (
              <span className="truncate font-semibold">
                {isSeedingToCloud ? 'กำลังซิงก์ข้อมูล...' : 'ซิงก์ข้อมูล Cloud'}
              </span>
            )}
          </span>
          {isHovered && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500 shrink-0">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCloudConnected ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              {isCloudConnected ? 'Online' : 'Local'}
            </span>
          )}
        </button>

        {/* 5. Clear All Clips */}
        <button
          type="button"
          onClick={() => setIsClearClipsModalOpen(true)}
          title="ล้างคลังคลิปทั้งหมด (เก็บหมวดหมู่ 3 ชั้นและการตั้งค่าไว้)"
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-rose-50/70 hover:text-rose-700 rounded-xl transition-colors overflow-hidden cursor-pointer group"
        >
          <span className="inline-flex items-center gap-3 whitespace-nowrap min-w-0">
            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-600 shrink-0 mx-auto transition-colors" />
            {isHovered && <span className="truncate font-semibold">ล้างคลังคลิป</span>}
          </span>
        </button>

        {/* 6. User Role & Auth Switcher */}
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          title="จัดการบัญชีผู้ใช้งาน และสลับสิทธิ์ Admin / Editor"
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors overflow-hidden cursor-pointer"
        >
          <span className="inline-flex items-center gap-3 whitespace-nowrap min-w-0">
            {role === 'ADMIN' ? (
              <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mx-auto" />
            ) : (
              <Lock className="w-4 h-4 text-slate-500 shrink-0 mx-auto" />
            )}
            {isHovered && <span className="truncate font-semibold">สิทธิ์ผู้ใช้งาน</span>}
          </span>
          {isHovered && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-bold shrink-0">
              {role === 'ADMIN' ? 'Admin' : 'Editor'}
            </span>
          )}
        </button>

        {!isHovered && (
          <div className="flex justify-center text-slate-400 pt-1">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </motion.aside>
  );
};

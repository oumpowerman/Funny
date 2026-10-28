import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  FolderTree,
  Search,
  X,
  Layers,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { CategoryTag, EntitySubtype } from '../../types/tag.types';
import { TagPill, getEntityIcon } from '../ui/TagPill';

interface CascadeCategorySelectorProps {
  selectedTagIds: string[];
  onChange: (newTagIds: string[]) => void;
  label?: string;
  helperText?: string;
  allowMultipleSubcategories?: boolean;
}

export const CascadeCategorySelector: React.FC<CascadeCategorySelectorProps> = ({
  selectedTagIds,
  onChange,
  label = 'หมวดหมู่หลัก & หัวข้อย่อย (ไล่ทีละสเต็ป)',
  helperText = 'คลิกเลือกกลุ่มหมวดหมู่ก่อน เพื่อกางหมวดหมู่หลักและหมวดหมู่ย่อยตามลำดับ',
  allowMultipleSubcategories = true,
}) => {
  const {
    categoryGroups,
    mainCategories,
    subcategories,
    getSubcategoriesByParent,
    createSubcategory,
    tagMap,
    setIsThreeTierManagerOpen,
  } = useCMS();

  // Default to collapsed (null / '') so Tier 1 and Tier 2 stay folded initially
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMainCatId, setActiveMainCatId] = useState<string>('');
  const [isAddingNewSub, setIsAddingNewSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubType, setNewSubType] = useState<EntitySubtype>('PERSON');

  const isSearching = searchQuery.trim().length > 0;
  const activeMainCat = activeMainCatId ? tagMap[activeMainCatId] : undefined;

  // Dynamic Clusters Ribbon
  const displayClusters = useMemo(() => {
    return [
      ...categoryGroups.map((g) => ({
        id: g.id,
        label: g.name,
        icon: g.icon || '📁',
        hint: g.description || g.name,
      })),
      { id: 'ALL', label: 'ดูทั้งหมด', icon: '📁', hint: 'แสดงทุกหมวดหมู่หลัก' },
    ];
  }, [categoryGroups]);

  // Group count map for badges
  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: mainCategories.length,
    };
    categoryGroups.forEach((g) => {
      counts[g.id] = 0;
    });

    mainCategories.forEach((mc) => {
      if (mc.groupId && counts[mc.groupId] !== undefined) {
        counts[mc.groupId] += 1;
      } else {
        const groupShort = mc.groupType;
        const matched = categoryGroups.find(
          (g) => g.id === `GRP-${groupShort}` || g.id === groupShort
        );
        if (matched && counts[matched.id] !== undefined) {
          counts[matched.id] += 1;
        }
      }
    });
    return counts;
  }, [mainCategories, categoryGroups]);

  // Filtered Tier 1 categories based on Cluster + Search
  const filteredMainCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mainCategories.filter((mc) => {
      // When searching, search across all clusters unless user specifically filtered
      if (!query) {
        if (!activeCluster) return false;
        if (activeCluster !== 'ALL') {
          const groupShort = activeCluster.replace('GRP-', '');
          const belongsToCluster =
            mc.groupId === activeCluster ||
            mc.groupType === groupShort ||
            mc.groupType === activeCluster;
          if (!belongsToCluster) return false;
        }
        return true;
      }

      // Search query match (matches main cat name/desc OR any of its subcategories)
      const mainMatches =
        mc.name.toLowerCase().includes(query) ||
        (mc.description && mc.description.toLowerCase().includes(query));
      if (mainMatches) return true;

      const childSubs = getSubcategoriesByParent(mc.id);
      return childSubs.some((sub) => sub.name.toLowerCase().includes(query));
    });
  }, [mainCategories, activeCluster, searchQuery, getSubcategoriesByParent]);

  // Subcategories to display (either under activeMainCat, or matching searchQuery when searching)
  const displayedSubcategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      // When searching, show subcategories matching query (or all under activeMainCat if it matches)
      const directMatches = subcategories.filter(
        (sub) =>
          sub.name.toLowerCase().includes(query) ||
          (sub.description && sub.description.toLowerCase().includes(query))
      );
      if (directMatches.length > 0) return directMatches;
      if (activeMainCatId) return getSubcategoriesByParent(activeMainCatId);
      return [];
    }
    return activeMainCatId ? getSubcategoriesByParent(activeMainCatId) : [];
  }, [searchQuery, subcategories, activeMainCatId, getSubcategoriesByParent]);

  // Determine visibility of Progressive Tiers
  const isTier1Open = Boolean(activeCluster) || isSearching;
  const isTier2Open = Boolean(activeMainCat) || (isSearching && displayedSubcategories.length > 0);

  // Current active sub-step (1 = Group, 2 = Main Cat, 3 = Subcat)
  const currentSubStep: 1 | 2 | 3 = isTier2Open ? 3 : isTier1Open ? 2 : 1;

  // Handle Cluster selection (Step 1 -> expands Step 2)
  const handleSelectCluster = (clusterId: string) => {
    if (activeCluster === clusterId && !isSearching) {
      // Clicking active cluster collapses Tier 1 & Tier 2 back
      setActiveCluster(null);
      setActiveMainCatId('');
      setIsAddingNewSub(false);
      return;
    }
    setActiveCluster(clusterId);
    // Keep Tier 2 collapsed until user explicitly picks a Main Category in this cluster
    setActiveMainCatId('');
    setIsAddingNewSub(false);
  };

  // Handle Main Category selection (Step 2 -> expands Step 3)
  const handleSelectMainCategory = (mainCatId: string) => {
    if (activeMainCatId === mainCatId && !isSearching) {
      // Toggle collapse of Tier 2 if clicking same active main category
      setActiveMainCatId('');
      setIsAddingNewSub(false);
      return;
    }

    setActiveMainCatId(mainCatId);

    // Ensure main category is added to selectedTagIds
    const otherMainCatIds = mainCategories.map((m) => m.id);
    const filtered = selectedTagIds.filter((id) => !otherMainCatIds.includes(id));
    if (!filtered.includes(mainCatId)) {
      filtered.push(mainCatId);
    }
    onChange(filtered);
  };

  // Toggle Subcategory (Step 3)
  const handleToggleSubcategory = (sub: CategoryTag) => {
    const subId = sub.id;
    const parentId = sub.parentId || activeMainCatId;
    const isSelected = selectedTagIds.includes(subId);
    let updated: string[];

    if (isSelected) {
      updated = selectedTagIds.filter((id) => id !== subId);
    } else {
      if (allowMultipleSubcategories) {
        updated = [...selectedTagIds, subId];
      } else {
        const siblingIds = (parentId ? getSubcategoriesByParent(parentId) : displayedSubcategories).map(
          (s) => s.id
        );
        updated = [...selectedTagIds.filter((id) => !siblingIds.includes(id)), subId];
      }
      // Ensure parent main category is also selected
      if (parentId && !updated.includes(parentId)) {
        const otherMainCatIds = mainCategories.map((m) => m.id);
        updated = [...updated.filter((id) => !otherMainCatIds.includes(id)), parentId];
      }
      if (parentId && activeMainCatId !== parentId) {
        setActiveMainCatId(parentId);
      }
    }
    onChange(updated);
  };

  const handleCreateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !activeMainCatId) return;

    const created = createSubcategory(
      activeMainCatId,
      newSubName.trim(),
      newSubType,
      activeMainCat?.color || 'amber'
    );

    const nextSelected = [...selectedTagIds.filter((id) => id !== created.id), created.id];
    if (!nextSelected.includes(activeMainCatId)) {
      nextSelected.push(activeMainCatId);
    }
    onChange(nextSelected);

    setNewSubName('');
    setIsAddingNewSub(false);
  };

  // Count how many subcategories under activeMainCat are currently selected
  const activeCatSelectedSubCount = useMemo(() => {
    return displayedSubcategories.filter((sc) => selectedTagIds.includes(sc.id)).length;
  }, [displayedSubcategories, selectedTagIds]);

  const activeClusterObj = useMemo(
    () => displayClusters.find((c) => c.id === activeCluster),
    [displayClusters, activeCluster]
  );

  return (
    <div className="space-y-3 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/90">
      {/* Header bar with Progressive Micro-Stepper */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-indigo-600" />
            {label}
          </label>
          {helperText && <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsThreeTierManagerOpen(true)}
            className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/90 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            title="เปิดหน้าต่างจัดการโครงสร้างกลุ่ม หมวดหลัก และหมวดย่อย"
          >
            <Settings className="w-3 h-3 text-indigo-600" />
            <span>จัดการหมวดหมู่ 3 ชั้น</span>
          </button>
        </div>
      </div>

      {/* 3-Stage Mini Progress Pill Bar */}
      <div className="flex items-center gap-1.5 text-[11px] bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 overflow-x-auto scrollbar-none">
        <span
          className={`font-semibold whitespace-nowrap flex items-center gap-1 ${
            currentSubStep === 1
              ? 'text-indigo-700 font-bold'
              : isTier1Open
              ? 'text-emerald-700'
              : 'text-slate-500'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
              currentSubStep === 1
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-300/60'
                : isTier1Open
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            1
          </span>
          <span>เลือกกลุ่ม{activeClusterObj ? `: ${activeClusterObj.label}` : ''}</span>
        </span>

        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

        <span
          className={`font-semibold whitespace-nowrap flex items-center gap-1 ${
            currentSubStep === 2
              ? 'text-sky-700 font-bold'
              : isTier2Open
              ? 'text-emerald-700'
              : 'text-slate-400'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
              currentSubStep === 2
                ? 'bg-sky-600 text-white ring-2 ring-sky-300/60'
                : isTier2Open
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            2
          </span>
          <span>หมวดหลัก{activeMainCat ? `: ${activeMainCat.name}` : ''}</span>
        </span>

        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

        <span
          className={`font-semibold whitespace-nowrap flex items-center gap-1 ${
            currentSubStep === 3 ? 'text-amber-800 font-bold' : 'text-slate-400'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
              currentSubStep === 3
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300/70'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            3
          </span>
          <span>หมวดย่อย / บุคคล</span>
        </span>
      </div>

      {/* Quick Search (Instant Bypass to reveal matching Main & Subcategories) */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาด่วน (พิมพ์ชื่อดารา สตรีมเมอร์ หรือหมวดหมู่ เพื่อกางผลลัพธ์ทันที)..."
          className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            title="ล้างคำค้นหา"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* =====================================================================
          STAGE 1 (Always Visible): Super-Category Clusters (กลุ่มหมวดหมู่)
      ====================================================================== */}
      <div
        className={`rounded-xl p-3 transition-all duration-200 ${
          currentSubStep === 1 && !isSearching
            ? 'bg-white border-2 border-indigo-400 ring-4 ring-indigo-500/10 shadow-[0_2px_16px_rgba(99,102,241,0.12)]'
            : 'bg-white/90 border border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            ขั้นที่ 1 — เลือกกลุ่มหมวดหมู่ (คลิกเพื่อกางหมวดหมู่หลัก):
          </span>
          {activeCluster && !isSearching && (
            <button
              type="button"
              onClick={() => {
                setActiveCluster(null);
                setActiveMainCatId('');
              }}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>พับเก็บ</span>
              <ChevronDown className="w-3 h-3 rotate-180" />
            </button>
          )}
        </div>

        {categoryGroups.length === 0 && mainCategories.length === 0 ? (
          <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              ยังไม่มีกลุ่มหมวดหมู่ในระบบ (หรือเพิ่งล้างข้อมูลเพื่อเริ่มต้นใหม่)
            </p>
            <button
              type="button"
              onClick={() => setIsThreeTierManagerOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>สร้างกลุ่มและหมวดหมู่ 3 ชั้น</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {displayClusters.map((cluster) => {
              const isActive = activeCluster === cluster.id;
              const count = clusterCounts[cluster.id] || 0;
              return (
                <button
                  key={cluster.id}
                  type="button"
                  onClick={() => handleSelectCluster(cluster.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/50 border border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border border-slate-200/90 hover:bg-indigo-50/60 hover:border-indigo-200 hover:text-indigo-900'
                  }`}
                  title={cluster.hint}
                >
                  <span>{cluster.icon}</span>
                  <span>{cluster.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums ${
                      isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================================
          STAGE 2 (Framer Motion Collapsible): Main Categories (Tier 1)
      ====================================================================== */}
      <AnimatePresence initial={false}>
        {isTier1Open && (
          <motion.div
            key="tier1-accordion"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden p-0 m-0 border-none"
          >
            <div
              className={`rounded-xl p-3 space-y-2 transition-all duration-200 ${
                currentSubStep === 2
                  ? 'bg-white border-2 border-sky-400 ring-4 ring-sky-500/12 shadow-[0_2px_16px_rgba(14,165,233,0.12)]'
                  : 'bg-white/90 border border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>
                    ขั้นที่ 2 — เลือกหมวดหมู่หลัก{' '}
                    {isSearching
                      ? `(ผลการค้นหา "${searchQuery}")`
                      : activeClusterObj
                      ? `ในกลุ่ม "${activeClusterObj.label}"`
                      : ''}
                    :
                  </span>
                </span>
                {activeMainCat && !isSearching && (
                  <span className="text-[11px] text-sky-700 font-semibold">
                    เลือกแล้ว: {activeMainCat.name}
                  </span>
                )}
              </div>

              {filteredMainCategories.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic py-2 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  {isSearching
                    ? `ไม่พบหมวดหมู่หลักที่ตรงกับ "${searchQuery}"`
                    : 'ยังไม่มีหมวดหมู่หลักในกลุ่มนี้ สามารถกดปุ่ม "จัดการหมวดหมู่ 3 ชั้น" เพื่อเพิ่มได้'}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {filteredMainCategories.map((mainCat) => {
                    const isSelected = selectedTagIds.includes(mainCat.id);
                    const isActive = activeMainCatId === mainCat.id;

                    return (
                      <button
                        key={mainCat.id}
                        type="button"
                        onClick={() => handleSelectMainCategory(mainCat.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-400/50 border border-sky-600'
                            : isSelected
                            ? 'bg-sky-50 text-sky-900 border border-sky-300 ring-1 ring-sky-300/60'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-sky-50/60 hover:border-sky-200'
                        }`}
                      >
                        <span>{mainCat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          STAGE 3 (Framer Motion Collapsible): Subcategories / Entities (Tier 2)
      ====================================================================== */}
      <AnimatePresence initial={false}>
        {isTier2Open && (
          <motion.div
            key="tier2-accordion"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden p-0 m-0 border-none"
          >
            <div
              className={`rounded-xl p-3 space-y-2 transition-all duration-200 ${
                currentSubStep === 3
                  ? 'bg-white border-2 border-emerald-400 ring-4 ring-emerald-500/12 shadow-[0_2px_16px_rgba(16,185,129,0.12)]'
                  : 'bg-white/90 border border-slate-200/90'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">
                    ขั้นที่ 3 — เลือกหมวดหมู่ย่อย / บุคคล{' '}
                    {isSearching ? (
                      <span className="text-emerald-700 font-bold">(ที่ตรงกับคำค้นหา)</span>
                    ) : (
                      <>
                        ใต้ <span className="text-emerald-700 font-bold">{activeMainCat?.name}</span>
                      </>
                    )}
                    :
                  </span>
                  {activeCatSelectedSubCount > 0 && (
                    <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200 tabular-nums">
                      เลือกแล้ว {activeCatSelectedSubCount}
                    </span>
                  )}
                </div>

                {!isAddingNewSub && activeMainCat && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewSub(true)}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>เพิ่มหัวข้อย่อยใหม่</span>
                  </button>
                )}
              </div>

              {/* Inline Add New Subcategory Form */}
              <AnimatePresence initial={false}>
                {isAddingNewSub && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden p-0 m-0 border-none"
                  >
                    <form
                      onSubmit={handleCreateSubcategory}
                      className="bg-amber-50/90 border border-amber-200 p-2.5 rounded-lg space-y-2 mb-1"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          placeholder="เช่น พี่แจ๊ส, เอก HRK, คอร์กี้, เกม FiveM, สัมภาษณ์..."
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          autoFocus
                          className="flex-1 min-w-[160px] bg-white border border-amber-300 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                        />

                        <select
                          value={newSubType}
                          onChange={(e) => setNewSubType(e.target.value as EntitySubtype)}
                          className="bg-white border border-amber-300 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-hidden"
                        >
                          <option value="PERSON">👤 บุคคล/สตรีมเมอร์</option>
                          <option value="ANIMAL">🐾 สัตว์</option>
                          <option value="TOPIC">🎯 หัวข้อ/เกม/ประเด็น</option>
                          <option value="ACTION">⚡ กิริยา/มุก</option>
                          <option value="GENERAL">🏷️ ทั่วไป</option>
                        </select>

                        <button
                          type="submit"
                          disabled={!newSubName.trim()}
                          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs px-2.5 py-1 rounded-md font-semibold shrink-0 cursor-pointer"
                        >
                          บันทึก
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewSub(false)}
                          className="text-xs text-slate-500 hover:text-slate-700 px-1 font-medium cursor-pointer"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Capped Subcategory Pills Container (Zero Layout Shift) */}
              <div className="max-h-36 sm:max-h-40 overflow-y-auto pr-1 p-2 rounded-lg bg-slate-50/80 border border-slate-200/80 overscroll-contain">
                {displayedSubcategories.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic py-1 text-center">
                    ยังไม่มีหมวดหมู่ย่อยใต้หมวดนี้ กด &quot;+ เพิ่มหัวข้อย่อยใหม่&quot; เพื่อสร้างรายการแรกได้ทันที
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {displayedSubcategories.map((sub) => {
                      const isSelected = selectedTagIds.includes(sub.id);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleToggleSubcategory(sub)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs ring-2 ring-amber-300/80 border border-amber-500'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50/70 hover:border-amber-200 font-medium'
                          }`}
                        >
                          <span className="text-xs shrink-0">{getEntityIcon(sub)}</span>
                          <span>{sub.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Currently Selected Summary Strip */}
      {selectedTagIds.length > 0 && (
        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-semibold">
            ป้ายที่ติดกับคลิปนี้ ({selectedTagIds.length}):
          </span>
          {selectedTagIds.map((tid) => {
            const tag = tagMap[tid];
            if (!tag) return null;
            return (
              <TagPill
                key={tag.id}
                tag={tag}
                showEntityIcon={true}
                onRemove={() => onChange(selectedTagIds.filter((id) => id !== tag.id))}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

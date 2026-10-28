import React from 'react';
import { firestoreService } from '../../firebase/firestoreService';
import { cmsRepository } from '../../services/cmsRepository';
import { Footage } from '../../types/footage.types';
import { RawSource } from '../../types/source.types';
import {
  CategoryGroup,
  CategoryTag,
  CategoryTier,
  EntitySubtype,
  SystemSettings,
  TagGroupType,
} from '../../types/tag.types';
import { getReferenceTodayDate } from '../../utils/cooldownCalculator';
import { generateNextId } from '../../utils/fileNameGenerator';

interface UseCMSCategoryActionsParams {
  categoryGroups: CategoryGroup[];
  setCategoryGroups: React.Dispatch<React.SetStateAction<CategoryGroup[]>>;
  tags: CategoryTag[];
  setTags: React.Dispatch<React.SetStateAction<CategoryTag[]>>;
  tagMap: Record<string, CategoryTag>;
  setFootage: React.Dispatch<React.SetStateAction<Footage[]>>;
  setSources: React.Dispatch<React.SetStateAction<RawSource[]>>;
  setSelectedTagFilter: React.Dispatch<React.SetStateAction<string[]>>;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
}

export function useCMSCategoryActions({
  categoryGroups,
  setCategoryGroups,
  tags,
  setTags,
  tagMap,
  setFootage,
  setSources,
  setSelectedTagFilter,
  setSettings,
}: UseCMSCategoryActionsParams) {
  // Category Group CRUD (Tier 0)
  const createCategoryGroup = (
    name: string,
    icon = '📁',
    color = 'indigo',
    description = ''
  ): CategoryGroup => {
    const trimmed = name.trim();
    const newGroup: CategoryGroup = {
      id: generateNextId('GRP', categoryGroups.map((g) => g.id)),
      name: trimmed,
      icon: icon || '📁',
      color: color || 'indigo',
      description: description.trim(),
      order: categoryGroups.length + 1,
      createdAt: getReferenceTodayDate(),
    };
    const next = [...categoryGroups, newGroup];
    setCategoryGroups(next);
    cmsRepository.saveCategoryGroups(next);
    firestoreService
      .saveCategoryGroup(newGroup)
      .catch((err) => console.warn('Firestore saveCategoryGroup error:', err));
    return newGroup;
  };

  const updateCategoryGroup = (id: string, updates: Partial<Omit<CategoryGroup, 'id'>>) => {
    setCategoryGroups((prev) => {
      const next = prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...updates };
          firestoreService
            .saveCategoryGroup(updated)
            .catch((err) => console.warn('Firestore updateCategoryGroup error:', err));
          return updated;
        }
        return g;
      });
      cmsRepository.saveCategoryGroups(next);
      return next;
    });
  };

  const deleteCategoryGroup = (id: string) => {
    setCategoryGroups((prev) => {
      const next = prev.filter((g) => g.id !== id);
      cmsRepository.saveCategoryGroups(next);
      return next;
    });
    firestoreService
      .deleteCategoryGroup(id)
      .catch((err) => console.warn('Firestore deleteCategoryGroup error:', err));
  };

  const wipeAllCategories = () => {
    setCategoryGroups([]);
    setTags([]);
    cmsRepository.wipeAllCategories();
  };

  const restoreDefaultCategories = () => {
    const fresh = cmsRepository.resetToSeedData();
    setCategoryGroups(fresh.categoryGroups);
    setTags(fresh.tags);
    cmsRepository.saveCategoryGroups(fresh.categoryGroups);
    cmsRepository.saveTags(fresh.tags);
    fresh.categoryGroups.forEach((grp) => {
      firestoreService
        .saveCategoryGroup(grp)
        .catch((err) => console.warn('Firestore restore group error:', err));
    });
    fresh.tags.forEach((cat) => {
      firestoreService
        .saveCategory(cat)
        .catch((err) => console.warn('Firestore restore tag error:', err));
    });
  };

  // Tag & Subcategory CRUD
  const createTag = (
    name: string,
    groupType: TagGroupType = 'THEME',
    color = 'blue',
    description = '',
    tier: CategoryTier = 1,
    parentId: string | null = null,
    entityType?: EntitySubtype,
    groupId?: string
  ): CategoryTag => {
    const trimmed = name.trim();
    const existing = tags.find(
      (t) =>
        t.name.toLowerCase() === trimmed.toLowerCase() &&
        (parentId ? t.parentId === parentId : (!t.parentId || t.tier === 1))
    );
    if (existing) return existing;

    const newTag: CategoryTag = {
      id: generateNextId('TAG', tags.map((t) => t.id)),
      name: trimmed,
      color,
      groupType,
      groupId: groupId || (tier === 1 ? `GRP-${groupType}` : undefined),
      description,
      createdAt: getReferenceTodayDate(),
      tier,
      parentId,
      entityType: entityType || (parentId ? 'PERSON' : undefined),
    };
    setTags((prev) => {
      const next = [...prev, newTag];
      cmsRepository.saveTags(next);
      return next;
    });
    firestoreService.saveCategory(newTag).catch((err) => console.warn('Firestore saveCategory error:', err));
    return newTag;
  };

  const createSubcategory = (
    parentId: string,
    name: string,
    entityType: EntitySubtype = 'PERSON',
    color = 'amber',
    description = ''
  ): CategoryTag => {
    const parent = tagMap[parentId];
    return createTag(
      name,
      parent ? parent.groupType : 'PERSON',
      color || (parent ? parent.color : 'amber'),
      description || `หมวดหมู่ย่อยใต้ ${parent ? parent.name : ''}`,
      2,
      parentId,
      entityType,
      parent?.groupId
    );
  };

  const updateTag = (id: string, updates: Partial<Omit<CategoryTag, 'id'>>) => {
    setTags((prev) => {
      const next = prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          firestoreService.saveCategory(updated).catch((err) => console.warn('Firestore updateTag error:', err));
          return updated;
        }
        return t;
      });
      cmsRepository.saveTags(next);
      return next;
    });
  };

  const deleteTag = (id: string) => {
    setTags((prev) => {
      // Also delete subcategories if this was a parent category
      const next = prev.filter((t) => t.id !== id && t.parentId !== id);
      cmsRepository.saveTags(next);
      return next;
    });
    firestoreService.deleteCategory(id).catch((err) => console.warn('Firestore deleteTag error:', err));
    setFootage((prev) =>
      prev.map((ft) => ({
        ...ft,
        tags: ft.tags.filter((tid) => tid !== id),
      }))
    );
    setSources((prev) =>
      prev.map((src) => ({
        ...src,
        tags: src.tags.filter((tid) => tid !== id),
      }))
    );
    setSelectedTagFilter((prev) => prev.filter((tid) => tid !== id));
  };

  const updateSettings = (updates: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const nextSettings = { ...prev, ...updates };
      firestoreService.saveSettings(nextSettings).catch((err) => console.warn('Firestore updateSettings error:', err));
      return nextSettings;
    });
  };

  return {
    createCategoryGroup,
    updateCategoryGroup,
    deleteCategoryGroup,
    wipeAllCategories,
    restoreDefaultCategories,
    createTag,
    createSubcategory,
    updateTag,
    deleteTag,
    updateSettings,
  };
}

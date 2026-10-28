import { Episode } from '../types/episode.types';
import { Footage } from '../types/footage.types';
import { RawSource } from '../types/source.types';
import { CategoryGroup, CategoryTag, SystemSettings } from '../types/tag.types';
import {
  INITIAL_CATEGORY_GROUPS,
  INITIAL_SETTINGS,
  INITIAL_TAGS,
} from './seedData';

const STORAGE_KEYS = {
  GROUPS: 'rrl_cms_category_groups_v1',
  TAGS: 'rrl_cms_tags_v2_e2e',
  SOURCES: 'rrl_cms_sources_v2_e2e',
  FOOTAGE: 'rrl_cms_footage_v2_e2e',
  EPISODES: 'rrl_cms_episodes_v2_e2e',
  SETTINGS: 'rrl_cms_settings_v2_e2e',
  PRODUCTION_CLEAN_SLATE: 'rrl_cms_production_clean_slate_v1',
  CLOUD_CLIPS_WIPED: 'rrl_cms_cloud_clips_wiped_v1',
};

/**
 * Enterprise Repository Pattern for Riang-Rueang-Lan CMS (v2 E2E Schema - Production Clean Slate)
 */
export const cmsRepository = {
  /**
   * Ensures a one-time immediate wipe of demo clips in localStorage when switching to production mode,
   * while preserving 3-tier categories and system settings.
   */
  ensureProductionCleanSlate(): boolean {
    try {
      const alreadyCleared = localStorage.getItem(STORAGE_KEYS.PRODUCTION_CLEAN_SLATE) === 'true';
      if (!alreadyCleared) {
        localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.FOOTAGE, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.PRODUCTION_CLEAN_SLATE, 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  hasWipedCloudClips(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.CLOUD_CLIPS_WIPED) === 'true';
    } catch {
      return false;
    }
  },

  markCloudClipsWiped(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CLOUD_CLIPS_WIPED, 'true');
    } catch {
      // ignore storage errors
    }
  },

  getTags(): CategoryTag[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TAGS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(INITIAL_TAGS));
        return INITIAL_TAGS;
      }
      const parsed: CategoryTag[] = JSON.parse(raw);
      let needsSave = false;

      // 1. Migrate existing tags if missing tier
      const migratedTier = parsed.map((t) => {
        if (!t.tier) {
          needsSave = true;
          if (t.id === 'TAG-0003') {
            return {
              ...t,
              name: 'พี่แจ๊ส ชวนชื่น',
              tier: 2 as const,
              parentId: 'TAG-0004',
              entityType: 'PERSON' as const,
            };
          }
          return {
            ...t,
            tier: (t.parentId ? 2 : 1) as 1 | 2,
            parentId: t.parentId || null,
          };
        }
        return t;
      });

      // 2. Deduplicate by id & backfill groupId for Tier 1 and Tier 2 tags
      const parentGroupMap: Record<string, string> = {};
      for (const t of migratedTier) {
        if (t.tier === 1 || !t.parentId) {
          parentGroupMap[t.id] = t.groupId || `GRP-${t.groupType || 'GENERAL'}`;
        }
      }

      const seenIds = new Set<string>();
      const migrated: CategoryTag[] = [];
      for (const t of migratedTier) {
        if (seenIds.has(t.id)) {
          needsSave = true;
          continue;
        }
        seenIds.add(t.id);

        const expectedGroupId =
          t.groupId ||
          (t.parentId ? parentGroupMap[t.parentId] : undefined) ||
          `GRP-${t.groupType || 'GENERAL'}`;

        if (t.groupId !== expectedGroupId) {
          needsSave = true;
          migrated.push({ ...t, groupId: expectedGroupId });
        } else {
          migrated.push(t);
        }
      }

      // 3. Merge missing Tier 1/2 seed tags if user had older seed tags
      const missingSeeds = INITIAL_TAGS.filter((seed) => !seenIds.has(seed.id));
      if (missingSeeds.length > 0) {
        needsSave = true;
        migrated.push(...missingSeeds);
      }

      if (needsSave) {
        localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(migrated));
      }
      return migrated;
    } catch {
      return INITIAL_TAGS;
    }
  },

  saveTags(tags: CategoryTag[]): void {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  getSources(): RawSource[] {
    this.ensureProductionCleanSlate();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SOURCES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify([]));
        return [];
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveSources(sources: RawSource[]): void {
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
  },

  getFootage(): Footage[] {
    this.ensureProductionCleanSlate();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FOOTAGE);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.FOOTAGE, JSON.stringify([]));
        return [];
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveFootage(footage: Footage[]): void {
    localStorage.setItem(STORAGE_KEYS.FOOTAGE, JSON.stringify(footage));
  },

  getEpisodes(): Episode[] {
    this.ensureProductionCleanSlate();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EPISODES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify([]));
        return [];
      }
      const parsed: Episode[] = JSON.parse(raw);
      let needsSave = false;
      const tagLookup = new Map(INITIAL_TAGS.map((t) => [t.id, t]));
      const migrated = parsed.map((ep) => {
        if (!ep.categoryGroupId) {
          needsSave = true;
          const tag = tagLookup.get(ep.mainCategoryTagId);
          const groupId = tag?.groupId || (tag ? `GRP-${tag.groupType}` : 'GRP-THEME');
          return {
            ...ep,
            categoryGroupId: groupId,
          };
        }
        return ep;
      });
      if (needsSave) {
        localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(migrated));
      }
      return migrated;
    } catch {
      return [];
    }
  },

  saveEpisodes(episodes: Episode[]): void {
    localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodes));
  },

  getSettings(): SystemSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
        return INITIAL_SETTINGS;
      }
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
      };
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: SystemSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getCategoryGroups(): CategoryGroup[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GROUPS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_CATEGORY_GROUPS));
        return INITIAL_CATEGORY_GROUPS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_CATEGORY_GROUPS;
    }
  },

  saveCategoryGroups(groups: CategoryGroup[]): void {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  },

  wipeAllCategories(): void {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify([]));
  },

  clearAllClips(): void {
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.FOOTAGE, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PRODUCTION_CLEAN_SLATE, 'true');
  },

  resetToSeedData(): {
    categoryGroups: CategoryGroup[];
    tags: CategoryTag[];
    sources: RawSource[];
    footage: Footage[];
    episodes: Episode[];
    settings: SystemSettings;
  } {
    const currentGroups = this.getCategoryGroups();
    const currentTags = this.getTags();
    const currentSettings = this.getSettings();
    this.clearAllClips();
    return {
      categoryGroups: currentGroups,
      tags: currentTags,
      sources: [],
      footage: [],
      episodes: [],
      settings: currentSettings,
    };
  },
};

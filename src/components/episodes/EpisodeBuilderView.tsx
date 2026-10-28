import React from 'react';
import { CollisionWarningBanner } from './CollisionWarningBanner';
import { SmartMixRecipeSelector } from './SmartMixRecipeSelector';
import { BuilderStep1CategoryTarget } from './builder/BuilderStep1CategoryTarget';
import { BuilderStep3RankingWorkspace } from './builder/BuilderStep3RankingWorkspace';
import { BuilderStep4MetadataForm } from './builder/BuilderStep4MetadataForm';
import { BuilderStudioHeader } from './builder/BuilderStudioHeader';
import { DiversityCollisionBanner } from './builder/DiversityCollisionBanner';
import { DuplicateEpisodeConfirmModal } from './builder/DuplicateEpisodeConfirmModal';
import { useEpisodeBuilder } from './builder/useEpisodeBuilder';

export const EpisodeBuilderView: React.FC = () => {
  const {
    categoryGroups,
    tagMap,
    computedFootage,
    computedFootageMap,
    settings,
    setActiveTab,
    setIsStatusRuleModalOpen,
    setIsThreeTierManagerOpen,

    nextEpisodeId,
    preselectNotice,
    setPreselectNotice,
    savedBannerMessage,

    groupStockStats,
    selectedGroupId,
    activeGroup,
    categoriesInSelectedGroup,
    mainCategoryTagId,
    productionTarget,
    targetSubcategoryId,
    activeSubcategory,
    currentSubcategories,
    activeCategoryStat,
    liveCategoryStock,
    handleSelectGroup,
    handleSelectCategory,
    handleSelectVarietyMode,
    handleSelectSoloMode,
    handleSelectSubcategory,

    activeRecipe,
    selectedFootageObjects,
    applyRecipeForCategory,

    duplicateSubcategories,
    validationReport,
    duplicateConfirmModalOpen,
    setDuplicateConfirmModalOpen,

    rankings,
    selectedFootageIds,
    activeSlotRank,
    setActiveSlotRank,
    assignFootageToRank,
    handleDropItemOnSlot,
    handleMoveSlotByIndex,
    clearSlotByRank,
    clearAllSlots,
    updateSlotScript,
    footageToAssignedRankMap,
    allowCrossCategory,
    setAllowCrossCategory,
    poolFilterGroupId,
    setPoolFilterGroupId,
    poolQuickFilter,
    setPoolQuickFilter,
    pickerSearch,
    setPickerSearch,
    pickerSortBy,
    setPickerSortBy,
    pickerPage,
    setPickerPage,
    pickerPageSize,
    setPickerPageSize,
    pickerCandidates,
    paginatedPickerCandidates,

    title,
    setTitle,
    publishDate,
    setPublishDate,
    publishSlot,
    setPublishSlot,
    isOptionalMasterOpen,
    setIsOptionalMasterOpen,
    masterDriveUrl,
    setMasterDriveUrl,
    youtubeUrl,
    setYoutubeUrl,
    facebookUrl,
    setFacebookUrl,
    introMascotScript,
    setIntroMascotScript,
    outroMascotScript,
    setOutroMascotScript,
    previewMasterFileName,
    handleSaveEpisode,
    performActualSave,
  } = useEpisodeBuilder();

  return (
    <div className="space-y-5">
      {/* Studio Header & Status Banners */}
      <BuilderStudioHeader
        nextEpisodeId={nextEpisodeId}
        selectedCount={selectedFootageIds.length}
        activeGroup={activeGroup}
        activeCategoryStat={activeCategoryStat}
        productionTarget={productionTarget}
        activeSubcategory={activeSubcategory}
        onOpenThreeTierManager={() => setIsThreeTierManagerOpen(true)}
        preselectNotice={preselectNotice}
        onDismissPreselectNotice={() => setPreselectNotice(null)}
        savedBannerMessage={savedBannerMessage}
        onNavigateTab={setActiveTab}
      />

      {/* Step 1: 3-Tier Category Selection (Group -> Main Category -> Subcategory Target) */}
      <BuilderStep1CategoryTarget
        groupStockStats={groupStockStats}
        selectedGroupId={selectedGroupId}
        activeGroup={activeGroup}
        categoriesInSelectedGroup={categoriesInSelectedGroup}
        mainCategoryTagId={mainCategoryTagId}
        activeCategoryStat={activeCategoryStat}
        liveCategoryStock={liveCategoryStock}
        productionTarget={productionTarget}
        targetSubcategoryId={targetSubcategoryId}
        activeSubcategory={activeSubcategory}
        currentSubcategories={currentSubcategories}
        computedFootage={computedFootage}
        onSelectGroup={handleSelectGroup}
        onSelectCategory={handleSelectCategory}
        onSelectVarietyMode={handleSelectVarietyMode}
        onSelectSoloMode={handleSelectSoloMode}
        onSelectSubcategory={handleSelectSubcategory}
        onOpenStatusRuleModal={() => setIsStatusRuleModalOpen(true)}
        onOpenThreeTierManager={() => setIsThreeTierManagerOpen(true)}
      />

      {/* Step 2: 1-Click Smart Mix Recipe Selector */}
      <SmartMixRecipeSelector
        selectedFootages={selectedFootageObjects}
        activeRecipe={activeRecipe}
        activeGroup={activeGroup}
        activeCategoryStat={activeCategoryStat}
        productionTarget={productionTarget}
        activeSubcategory={activeSubcategory}
        onSelectRecipeAndMix={(recipe) =>
          applyRecipeForCategory(mainCategoryTagId, recipe)
        }
      />

      {/* Diversity Collision Guard Banner */}
      <DiversityCollisionBanner
        duplicateSubcategories={duplicateSubcategories}
      />

      {/* Smart Collision & Cooldown Guard Banner */}
      <CollisionWarningBanner
        report={validationReport}
        selectedCount={selectedFootageIds.length}
      />

      {/* Step 3: 5-Slot Ranking Workspace & Draggable Footage Pool */}
      <BuilderStep3RankingWorkspace
        rankings={rankings}
        computedFootageMap={computedFootageMap}
        selectedFootageIds={selectedFootageIds}
        activeSlotRank={activeSlotRank}
        onActivatePickerSlot={setActiveSlotRank}
        onClearSlotByRank={clearSlotByRank}
        onClearAllSlots={clearAllSlots}
        onMoveSlotByIndex={handleMoveSlotByIndex}
        onUpdateSlotScript={updateSlotScript}
        onDropItemOnSlot={handleDropItemOnSlot}
        onAssignFootageToRank={assignFootageToRank}
        footageToAssignedRankMap={footageToAssignedRankMap}
        categoryGroups={categoryGroups}
        activeGroup={activeGroup}
        activeCategoryStat={activeCategoryStat}
        productionTarget={productionTarget}
        activeSubcategory={activeSubcategory}
        liveCategoryStock={liveCategoryStock}
        allowCrossCategory={allowCrossCategory}
        onToggleCrossCategory={() => setAllowCrossCategory((prev) => !prev)}
        onEnableCrossCategory={() => setAllowCrossCategory(true)}
        poolFilterGroupId={poolFilterGroupId}
        onChangePoolFilterGroupId={setPoolFilterGroupId}
        poolQuickFilter={poolQuickFilter}
        onChangePoolQuickFilter={setPoolQuickFilter}
        pickerSearch={pickerSearch}
        onChangePickerSearch={setPickerSearch}
        pickerSortBy={pickerSortBy}
        onChangePickerSortBy={setPickerSortBy}
        pickerCandidatesCount={pickerCandidates.length}
        paginatedPickerCandidates={paginatedPickerCandidates}
        pickerPage={pickerPage}
        pickerPageSize={pickerPageSize}
        onPageChange={setPickerPage}
        onPageSizeChange={setPickerPageSize}
        tagMap={tagMap}
        settings={settings}
      />

      {/* Step 4: Auto-Generated Headline, Schedule & Save Form */}
      <BuilderStep4MetadataForm
        nextEpisodeId={nextEpisodeId}
        selectedCount={selectedFootageIds.length}
        activeGroup={activeGroup}
        activeCategoryStat={activeCategoryStat}
        productionTarget={productionTarget}
        activeSubcategory={activeSubcategory}
        previewMasterFileName={previewMasterFileName}
        title={title}
        onChangeTitle={setTitle}
        publishDate={publishDate}
        onChangePublishDate={setPublishDate}
        publishSlot={publishSlot}
        onChangePublishSlot={setPublishSlot}
        isOptionalMasterOpen={isOptionalMasterOpen}
        onToggleOptionalMaster={() => setIsOptionalMasterOpen((prev) => !prev)}
        masterDriveUrl={masterDriveUrl}
        onChangeMasterDriveUrl={setMasterDriveUrl}
        youtubeUrl={youtubeUrl}
        onChangeYoutubeUrl={setYoutubeUrl}
        facebookUrl={facebookUrl}
        onChangeFacebookUrl={setFacebookUrl}
        introMascotScript={introMascotScript}
        onChangeIntroMascotScript={setIntroMascotScript}
        outroMascotScript={outroMascotScript}
        onChangeOutroMascotScript={setOutroMascotScript}
        onSubmitEpisode={handleSaveEpisode}
      />

      {/* 100% Duplicate Episode Confirmation Modal */}
      <DuplicateEpisodeConfirmModal
        isOpen={duplicateConfirmModalOpen}
        topSimilarityMatch={validationReport.topSimilarityMatch}
        onClose={() => setDuplicateConfirmModalOpen(false)}
        onConfirmSave={performActualSave}
      />
    </div>
  );
};

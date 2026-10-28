import React from 'react';
import {
  Activity,
  Copy,
  ExternalLink,
  GitMerge,
  History,
  Layers,
  Scissors,
  Video,
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { formatThaiDate } from '../../utils/fileNameGenerator';
import { TagSelectorInput } from '../tags/TagSelectorInput';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/StatusBadge';

export const FootageTraceabilityModal: React.FC = () => {
  const {
    traceabilityFootageId,
    setTraceabilityFootageId,
    computedFootageMap,
    tagMap,
    sourceMap,
    settings,
    updateFootage,
    openSourceSplitterFor,
    setSelectedEpisodeDetailId,
  } = useCMS();

  const footage = traceabilityFootageId ? computedFootageMap[traceabilityFootageId] : null;
  if (!footage) return null;

  const parentSource = footage.sourceId ? sourceMap[footage.sourceId] : null;
  const coUsedEntries = Object.entries(footage.coUsedWithMap)
    .map(([partnerId, count]) => ({
      partner: computedFootageMap[partnerId],
      partnerId,
      count,
    }))
    .filter((entry) => Boolean(entry.partner))
    .sort((a, b) => b.count - a.count);

  return (
    <Modal
      isOpen={Boolean(footage)}
      onClose={() => setTraceabilityFootageId(null)}
      title={`Traceability & Time-Window Velocity Inspector — ${footage.id}`}
      subtitle="วิเคราะห์ความช้ำของฟุตเทจเทียบกับระยะเวลาที่ผ่านไป (Time-Decay) พร้อมประวัติการผสมในคลิปหลัก"
      maxWidthClass="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Header Metadata Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-mono font-bold text-sm text-slate-900">{footage.id}</span>
              <span aria-hidden="true">·</span>
              {footage.ingestionFlow === 'DIRECT_1_TO_1' ? (
                <span className="inline-flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-slate-500" />
                  <span>Flow A: คลิปเดี่ยวพร้อมใช้ (1:1 Direct)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-indigo-700 font-medium">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>
                    Flow B: หั่นจากต้นฉบับยาว ({footage.sourceId} ช่วงเวลา {footage.timestampRange})
                  </span>
                </span>
              )}
            </div>

            <StatusBadge
              status={footage.cooldownStatus}
              daysSinceLastUse={footage.daysSinceLastUsed}
              cooldownDays={settings.cooldownDays}
              usageLast90Days={footage.usageLast90Days}
            />
          </div>

          <h3 className="text-lg font-bold text-slate-900">{footage.title}</h3>

          {/* Time-Window & Usage Velocity Breakdown Strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>สถิติความถี่เทียบเวลา (Time-Window & Usage Velocity)</span>
              </span>
              <span className="text-xs font-mono font-semibold text-slate-700">
                {footage.velocitySummaryText}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1 text-xs font-mono tabular-nums">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[11px] font-sans">ใช้ทั้งหมดตั้งแต่สร้าง</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {footage.totalUsageCount} ครั้ง
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[11px] font-sans">ในรอบ 30 วัน</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {footage.usageLast30Days} ครั้ง
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[11px] font-sans">ในรอบ 90 วัน</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    footage.usageLast90Days >= settings.maxUsagePer90Days
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {footage.usageLast90Days} ครั้ง
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[11px] font-sans">พักมาแล้ว</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {footage.daysSinceLastUsed !== null ? `${footage.daysSinceLastUsed} วัน` : '-'}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[11px] font-sans">อายุฟุตในคลัง</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {footage.daysSinceCreated} วัน
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[11px] font-sans">ความถี่เฉลี่ย</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {footage.averageDaysBetweenUses !== null
                    ? `ทุก ${footage.averageDaysBetweenUses} วัน`
                    : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Standard File Name & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-slate-500">ชื่อไฟล์มาตรฐานใน Google Drive</div>
                <div className="text-xs font-mono text-slate-900 truncate">
                  {footage.standardFileName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(footage.standardFileName)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md shrink-0"
                title="คัดลอกชื่อไฟล์"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-slate-500">ลิงก์ต้นฉบับ & วันที่นำเข้าคลัง</div>
                <div className="text-xs font-mono text-slate-700 truncate">
                  นำเข้าเมื่อ {formatThaiDate(footage.createdAt)} ·{' '}
                  {footage.originalUrl ? footage.originalUrl : 'ไม่ได้ระบุลิงก์ต้นฉบับ'}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {parentSource && (
                  <button
                    type="button"
                    onClick={() => {
                      setTraceabilityFootageId(null);
                      openSourceSplitterFor(parentSource);
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 whitespace-nowrap"
                  >
                    ดูต้นฉบับ {parentSource.id}
                  </button>
                )}
                {footage.originalUrl && (
                  <a
                    href={footage.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                    title="เปิดลิงก์ต้นฉบับ"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Live Original Link, Google Drive Link & Multi-Tag Editor inside Traceability Modal */}
          <div className="pt-2 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Editable Original Clip URL */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-bold text-slate-900">
                    🔗 ลิงก์คลิปต้นฉบับ (TikTok / Reels / FB / Shorts)
                  </label>
                  {footage.originalUrl?.trim() ? (
                    <a
                      href={footage.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>เปิดลิงก์ต้นฉบับ</span>
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500">
                      ไม่ได้ระบุลิงก์ต้นฉบับ
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  value={footage.originalUrl || ''}
                  onChange={(e) =>
                    updateFootage(footage.id, { originalUrl: e.target.value })
                  }
                  placeholder="https://www.tiktok.com/@creator/video/..."
                  className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              {/* Editable Google Drive File URL */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-bold text-slate-900">
                    📂 ลิงก์ไฟล์วิดีโอใน Google Drive
                  </label>
                  {footage.driveFileUrl?.trim() ? (
                    <a
                      href={footage.driveFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>เปิดไฟล์ใน Drive</span>
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                      ⚠️ รออัปโหลดไฟล์ขึ้น Drive
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  value={footage.driveFileUrl || ''}
                  onChange={(e) =>
                    updateFootage(footage.id, { driveFileUrl: e.target.value })
                  }
                  placeholder="https://drive.google.com/file/d/... (วางลิงก์เมื่ออัปโหลดแล้ว)"
                  className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>
            </div>

            <TagSelectorInput
              selectedTagIds={footage.tags}
              onChange={(updatedTags) => updateFootage(footage.id, { tags: updatedTags })}
              label="หมวดหมู่และป้ายกำกับของฟุตเทจนี้ (คลิกเพิ่ม/ลดแท็กได้ทันที)"
              helperText="การติดป้ายหมวดหมู่ช่วยให้ระบบคำนวณโควตา 5 ฟุต = 1 EP ในหน้าสายพานการผลิตได้แม่นยำ"
            />
          </div>
        </div>

        {/* Section 1: Episode Usage History Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              <span>
                01. ประวัติการนำไปใช้ในคลิปหลัก (ใช้ทั้งหมด {footage.totalUsageCount} ครั้ง)
              </span>
            </h4>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ใช้งานล่าสุด: {formatThaiDate(footage.lastUsedDate)}
            </span>
          </div>

          {footage.usageHistory.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
              <p className="text-sm font-semibold text-slate-800">
                ฟุตเทจนี้ยังไม่เคยถูกนำไปใช้ใน Episode ใดเลย (สถานะ NEW_UNTOUCHED)
              </p>
              <p className="text-xs text-slate-500 mt-1">
                สามารถดึงไปจัดชุด 5 อันดับในหน้า Episode Builder ได้ทันทีโดยไม่มีประวัติซ้ำ
              </p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-2.5 px-4">รหัส EP</th>
                    <th className="py-2.5 px-4">ชื่อคลิป 5 อันดับที่นำไปใช้</th>
                    <th className="py-2.5 px-4 text-center">อันดับ</th>
                    <th className="py-2.5 px-4">วันที่โพสต์ & ระยะเวลา</th>
                    <th className="py-2.5 px-4">ฟุตที่ถูกผสมร่วมใน EP เดียวกัน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {footage.usageHistory.map((rec) => (
                    <tr
                      key={`${rec.episodeId}-${rec.rank}`}
                      onClick={() => {
                        setTraceabilityFootageId(null);
                        setSelectedEpisodeDetailId(rec.episodeId);
                      }}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700 hover:underline whitespace-nowrap">
                        {rec.episodeId}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">{rec.episodeTitle}</td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums font-bold text-slate-900">
                        อันดับ {rec.rank}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                        {formatThaiDate(rec.publishDate)} ({rec.daysAgo} วันที่แล้ว)
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {rec.coUsedFootageIds.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Section 2: Pairwise Co-Usage Matrix */}
        <section className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-slate-700" />
            <span>
              02. ประวัติการจับคู่ผสมร่วมกับฟุตเทจอื่น (Co-Usage Collision Matrix:{' '}
              {coUsedEntries.length} ฟุตเทจ)
            </span>
          </h4>

          {coUsedEntries.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500">
              ยังไม่เคยถูกนำไปผสมคู่กับฟุตเทจอื่นในระบบ
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coUsedEntries.map(({ partner, partnerId, count }) => (
                <div
                  key={partnerId}
                  onClick={() => setTraceabilityFootageId(partnerId)}
                  className="bg-white border border-slate-200 rounded-lg p-3.5 hover:border-slate-400 cursor-pointer flex items-start justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-slate-900">{partnerId}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {partner.tags.map((tid) => `#${tagMap[tid]?.name || tid}`).join(' ')}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {partner.title}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-mono tabular-nums font-semibold text-amber-800">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>เจอกัน {count} EP</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
};

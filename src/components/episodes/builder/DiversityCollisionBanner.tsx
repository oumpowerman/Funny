import React from 'react';
import { DuplicateSubcategoryWarning } from './builder.types';

interface DiversityCollisionBannerProps {
  duplicateSubcategories: DuplicateSubcategoryWarning[];
}

export const DiversityCollisionBanner: React.FC<DiversityCollisionBannerProps> = ({
  duplicateSubcategories,
}) => {
  if (duplicateSubcategories.length === 0) return null;

  return (
    <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
      <span className="text-xl shrink-0">⚠️</span>
      <div className="space-y-1">
        <div className="text-xs font-bold text-amber-950">
          ตรวจพบหัวข้อย่อยซ้ำกันในโหมดรวมหลากหลาย:
        </div>
        <div className="text-xs text-amber-900">
          {duplicateSubcategories.map((item, idx) => (
            <span key={idx} className="inline-block mr-3">
              พบ <strong>#{item.tag.name}</strong> ซ้ำในช่องอันดับ [
              {item.ranks.map((r) => `อันดับ ${r}`).join(', ')}]
            </span>
          ))}
        </div>
        <p className="text-[11px] text-amber-800">
          💡 แนะนำ: โหมดรวมหลากหลายควรกระจายหัวข้อย่อยหรือบุคคลไม่ให้ซ้ำกันทั้ง 5 อันดับ เพื่อความสนุกแปลกใหม่ของผู้ชม หรือเปลี่ยนรูปแบบด้านบนเป็น &quot;🎯 เจาะจงหัวข้อย่อยเรื่องเดียว (Solo / Topic Special EP)&quot;
        </p>
      </div>
    </div>
  );
};

# แผนการจัดระเบียบ `Navbar.tsx` และ `Sidebar.tsx` ใหม่ (Declutter & Visual Hierarchy Redesign)

## 1. ภาพรวมการปรับปรุง (Overview)
แก้ปัญหาแถบ `Navbar.tsx` ล้นและแย่งจุดสนใจกัน (เดิมมีปุ่มและป้ายสถานะสีสันฉูดฉาดเรียงกันถึง 9 รายการ) โดยใช้หลักการ **60-30-10 Color Discipline** และ **Top Bar Contract** เพื่อแยก **"งานโปรดักชันรายวัน (Daily Production)"** ออกจาก **"เครื่องมือตั้งค่าและดูแลระบบ (System & Admin Tools)"**:

- **แถบ `Navbar.tsx` ด้านบน**: เหลือเฉพาะสิ่งที่ต้องดูและกดใช้งานประจำวัน ได้แก่ **ชื่อหน้าปัจจุบัน**, **จำนวนฟุตพร้อมใช้**, และ **ปุ่มหลัก `+ นำเข้าฟุตเทจ`** ที่โดดเด่นเพียงจุดเดียว
- **แถบ `Sidebar.tsx` ด้านซ้าย**: รวบรวมเครื่องมือจัดการหมวดหมู่ เกณฑ์สี การซิงก์ฐานข้อมูล การล้างคลังคลิป และสถานะสิทธิ์ผู้ใช้ (Admin/Editor) ไว้ที่โซนล่างของ Sidebar ด้วยโทนสีเรียบสะอาดตา (`slate`) ไม่แย่งสายตาจากเนื้อหาหลัก

---

## 2. ทิศทางการออกแบบและลำดับความสำคัญทางสายตา (Visual Direction)
- **Single Focal Anchor (จุดโฟกัสเดียวบน Navbar)**:
  - ใช้สี Accent (`bg-indigo-600 text-white font-bold`) เฉพาะกับปุ่ม **`+ นำเข้าฟุตเทจ`** เท่านั้น
  - ยกเลิกการใช้สีรุ้ง/พาสเทลหลายสี (`emerald`, `amber`, `sky`, `rose`, `indigo`) บนแถบด้านบนทั้งหมด
- **Clean Unboxed Typography (ลดกรอบแคปซูลซ้อนทับ)**:
  - แสดงชื่อหน้าปัจจุบันด้านซ้ายของ Navbar ด้วยตัวอักษรที่ชัดเจน (`text-base font-bold text-slate-900`) คั่นด้วย `/` ตามด้วยคำอธิบายสั้นๆ (`text-xs text-slate-500`) โดยไม่ต้องใส่กรอบแคปซูลทึบเหมือนเดิม
  - แสดงจำนวนฟุตพร้อมใช้เป็นข้อมูลตัวเลข (`font-mono tabular-nums`) โทนเรียบสะอาดตาด้านข้างปุ่มนำเข้าฟุตเทจ

---

## 3. รายละเอียดการปรับโครงสร้างไฟล์ (Architecture & Component Changes)

### 3.1 ปรับโฉม `/src/components/layout/Navbar.tsx`
- **Desktop Top Bar (`md:flex`)**:
  - **ฝั่งซ้าย (Page Context)**: แสดงไอคอนประจำหน้า + ชื่อหน้าปัจจุบัน (`currentTab.title`) + คำอธิบายย่อย (`currentTab.subtitle`) แบบตัวอักษรสะอาดตา อ่านง่ายทันทีที่มอง
  - **ฝั่งขวา (Status & Primary Action)**:
    1. **ตัวเลขฟุตพร้อมใช้ (`พร้อมใช้ X ฟุต`)**: แสดงในโทนสีเรียบ (`text-slate-600`) พร้อมจุดสีเขียวขนาดเล็กและตัวเลข `tabular-nums` (สามารถคลิกเพื่อดูเกณฑ์สี `StatusColorRulesModal` ได้ทันทีหากต้องการเช็กเงื่อนไข)
    2. **ปุ่มหลัก `+ นำเข้าฟุตเทจ` (Primary CTA Dropdown)**: ปุ่มสี `indigo-600` ที่เด่นที่สุดบนหน้าจอ เมื่อคลิกจะกางเมนูย่อย 2 ทางเลือกเหมือนเดิม คือ:
       - `✂️ หั่นจากไลฟ์ / คลิปยาว (1:N)` (`SourceSplitterModal`)
       - `🎞️ เพิ่มฟุตเดี่ยวพร้อมใช้ (1:1)` (`DirectFootageModal`)
- **Mobile Top Bar (`md:hidden`)**:
  - ปรับให้คลีนในทิศทางเดียวกัน คือแสดงปุ่มเปิดเมนู (Hamburger) + ชื่อหน้าปัจจุบัน + จำนวนฟุตพร้อมใช้ + ปุ่ม `+ นำเข้า`

### 3.2 ย้ายเครื่องมือตั้งค่าและระบบไปที่ `/src/components/layout/Sidebar.tsx`
- **โซนบน (Primary Navigation)**: คงเมนูหลัก 5 หน้า (`ภาพรวมช่อง`, `คลังฟุตเทจ`, `หั่นคลิปยาว`, `จัด 5 อันดับ`, `คลังคลิปหลัก`) ไว้ตามเดิม
- **โซนล่าง (System & Studio Tools Footer)**: จัดกลุ่มเครื่องมือจัดการระบบไว้ด้านล่างของ Sidebar ในโทนสีเรียบ (`text-slate-600 hover:bg-slate-100 hover:text-slate-900`) รองรับทั้งตอนหดแถบ (`72px` แสดงเฉพาะไอคอนพร้อม Tooltip) และตอนกางแถบ (`248px` แสดงชื่อเมนูครบถ้วน):
  1. **หมวดหมู่ 3 ชั้น** (`Layers` icon) ➔ เปิด `ThreeTierCategoryManagerModal`
  2. **เกณฑ์สี & กฎพักฟุต** (`Palette` / `Settings` icon) ➔ เปิด `StatusColorRulesModal` และ `CategoryTagManagerModal`
  3. **ซิงก์ Cloud / ล้างคลังคลิป** (`Cloud` & `Trash2` icon) ➔ ปุ่มซิงก์ Firestore (`seedToCloud`) และปุ่มเปิด `ClearAllClipsModal`
  4. **สถานะผู้ใช้งาน (Admin / Editor)** (`ShieldCheck` / `Lock` icon) ➔ เปิด `AuthModal` เพื่อสลับสิทธิ์หรือออกจากระบบ

---

## 4. ขั้นตอนการตรวจสอบ (Verification Plan)
- ตรวจสอบว่าปุ่มและ Modal ทั้งหมด (`DirectFootageModal`, `SourceSplitterModal`, `ThreeTierCategoryManagerModal`, `StatusColorRulesModal`, `CategoryTagManagerModal`, `ClearAllClipsModal`, `AuthModal`, และ `seedToCloud`) ยังคงกดเรียกใช้งานได้ครบถ้วน 100% จากตำแหน่งใหม่
- ตรวจสอบการแสดงผลทั้งตอนหดและกาง `Sidebar` บนหน้าจอ Desktop รวมถึงเมนูบน Mobile ไม่ให้มีข้อความล้นหรือซ้อนทับกัน
- รัน `compile_applet` เพื่อยืนยันว่าโค้ดผ่านการตรวจสอบ TypeScript และการ Build โดยไม่มีข้อผิดพลาด

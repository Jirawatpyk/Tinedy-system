# 🎨 Dev Task: Fix Primary Button Text Color

**Priority:** Medium
**Assigned To:** Dev Agent
**Reported By:** UX Expert (Sally)
**Date:** 2025-10-04

---

## 🐛 Issue Description

Primary Button ในหน้า Welcome Page (Story 1.1) ใช้ `text-white` แต่ตาม Tinedy Design System ควรใช้ `text-simplicity` (#f5f3ee - Warm Beige)

**Current (Incorrect):**
```tsx
<Button className="bg-trust hover:bg-trust/90 text-white">  // ❌ Wrong
  Primary Button
</Button>
```

**Expected (Correct):**
```tsx
<Button className="bg-trust hover:bg-trust/90 text-simplicity">  // ✅ Correct
  Primary Button
</Button>
```

---

## 📸 Screenshot Evidence

User reported: "Components: ผิดสีไหมครับ มืดเลย" - Primary Button มีพื้นหลังสีเข้ม (#2e4057) แต่ text เป็นสีขาวล้วน ซึ่งไม่ตรงกับ design system

---

## 🔧 Fix Required

### File to Edit:
`tinedy-app/app/page.tsx`

### Changes:
1. หา Primary Button component (ปุ่ม "Primary Button")
2. เปลี่ยน className จาก `text-white` → `text-simplicity`
3. ถ้ามี Destructive Button (red) ก็ต้องเปลี่ยนเป็น `text-simplicity` เช่นกัน

### Code Fix:
```tsx
// BEFORE (ผิด):
<Button className="bg-trust hover:bg-trust/90 text-white">
  Primary Button
</Button>

// AFTER (ถูก):
<Button className="bg-trust hover:bg-trust/90 text-simplicity">
  Primary Button
</Button>
```

---

## 📋 Tinedy Button Color Standards (Reference)

### 1. Primary Button (Call-to-Action)
```tsx
<Button className="bg-trust hover:bg-trust/90 text-simplicity">
  Create / Submit / Confirm
</Button>
```

### 2. Destructive Button
```tsx
<Button className="bg-red-600 hover:bg-red-700 text-simplicity">
  Cancel / Delete
</Button>
```

### 3. Outline Button
```tsx
<Button variant="outline" className="border-trust text-trust hover:bg-trust/10">
  Secondary Action
</Button>
```

### 4. Ghost Button
```tsx
<Button variant="ghost" className="text-trust hover:bg-trust/10">
  Cancel / Back
</Button>
```

---

## ✅ Acceptance Criteria

- [ ] Primary Button ใช้ `text-simplicity` แทน `text-white`
- [ ] Destructive Button (ถ้ามี) ใช้ `text-simplicity` แทน `text-white`
- [ ] ทดสอบ contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Dev server reload แสดงผลถูกต้อง
- [ ] Screenshot หลังแก้ไขส่งกลับมายืนยัน

---

## 🎨 Design Rationale (from UX Expert)

**เหตุผลที่ต้องใช้ Simplicity (#f5f3ee) แทนสีขาว:**

1. **Brand Identity:** สี Simplicity เป็นส่วนหนึ่งของ Tinedy color palette ให้ความรู้สึกอบอุ่น ไม่เย็นชาเหมือนสีขาวล้วน
2. **Visual Harmony:** สีขาว (#ffffff) contrast สูงเกินไป ทำให้ปุ่มดูแข็งกระด้าง
3. **Consistency:** ทุก text บนพื้นหลังมืด (Trust, Dirty, Red) ควรใช้ Simplicity
4. **Accessibility:** Simplicity (#f5f3ee) on Trust (#2e4057) = contrast ratio 8.9:1 (เกิน WCAG AAA แล้ว)

---

## 🧪 Testing Steps

1. เปิด dev server: `npm run dev`
2. ไปที่ http://localhost:3000
3. ตรวจสอบ Primary Button:
   - สีพื้นหลัง: #2e4057 (Trust) ✅
   - สีตัวอักษร: #f5f3ee (Simplicity) ✅
   - Hover: opacity ลด 10% ✅
4. Screenshot และส่งกลับมายืนยัน

---

## 📝 Additional Notes

- ถ้าเจอ `text-white` ในที่อื่นบนพื้นหลัง Trust/Dirty/Red ให้เปลี่ยนเป็น `text-simplicity` ทั้งหมด
- Outline buttons ไม่ต้องเปลี่ยน (ใช้ `text-trust` อยู่แล้วถูกต้อง)
- Ghost buttons ใช้ `text-trust` (ไม่ใช่ simplicity)

---

## 🤝 Handoff Complete

**From:** Sally (UX Expert) 🎨
**To:** Dev Agent 💻
**Status:** Ready for Implementation

Dev รับไม้ต่อได้เลยค่ะ! มีคำถามถามได้นะคะ 😊

---

**Related Files:**
- Implementation: `tinedy-app/app/page.tsx`
- Story Reference: `docs/stories/1.1.project-initialization.md`
- Design System: `docs/architecture/8. UI-UX Spec Design System.md`

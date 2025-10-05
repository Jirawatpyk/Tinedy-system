# Troubleshooting Guide

## ปัญหาที่พบบ่อยและวิธีแก้ไข

### 🔥 Problem: Dev Server ค้างที่ "Starting..." หรือไม่สามารถเริ่มได้

**อาการ:**
- รัน `npm run dev` แล้วค้างที่ `✓ Starting...` นานกว่า 30 วินาที
- Browser แสดงหน้าว่างหรือ "This site can't be reached"
- Error: `EPERM: operation not permitted, open '.next/trace'`

**สาเหตุ:**
- มี dev server ตัวเก่ารันอยู่แล้ว (ล็อค port 3000)
- ไฟล์ `.next/trace` ถูกล็อคโดย process อื่น
- Build cache เสีย

**วิธีแก้ (เรียงตามลำดับความเร็ว):**

#### 🚀 วิธีที่ 1: ใช้ VS Code Tasks (แนะนำ)
1. กด `Ctrl+Shift+P` (Windows) หรือ `Cmd+Shift+P` (Mac)
2. พิมพ์: `Tasks: Run Task`
3. เลือก: **"Dev: Fresh Start (Kill Ports + Clean)"**

#### ⚡ วิธีที่ 2: ใช้ npm script
```bash
cd tinedy-app
npm run dev:fresh
```

#### 🔧 วิธีที่ 3: แก้ไขแบบ Manual
```bash
# 1. Kill processes บน ports 3000-3003
cd tinedy-app
npm run kill-port

# 2. Clean build cache
npm run clean

# 3. รัน dev server
npm run dev
```

#### 🛑 วิธีที่ 4: Kill Node ทั้งหมด (⚠️ DANGER - Last Resort Only!)
```bash
# ⚠️ WARNING: คำสั่งนี้จะ kill node.exe ทั้งหมด รวมถึง:
#   - VS Code extensions (ต้องรีโหลด VS Code)
#   - Claude Code agent (ต้องเริ่มใหม่)
#   - Tools อื่น ๆ ที่ใช้ Node.js
#
# ใช้เฉพาะเมื่อวิธีอื่นไม่ได้ผลเท่านั้น!

# Windows
taskkill //F //IM node.exe

# หลังจากนั้น
cd tinedy-app
npm run clean
npm run dev

# แล้ว Reload VS Code: Ctrl+Shift+P → "Developer: Reload Window"
```

**💡 แนะนำ: ใช้ `npm run kill-port` แทน** เพราะปลอดภัยกว่า - kill เฉพาะ ports 3000-3003 เท่านั้น

---

### 🔴 Problem: Port 3000 is already in use

**อาการ:**
```
⚠ Port 3000 is in use by process XXXXX, using available port 3001 instead.
```

**วิธีแก้:**

#### Option 1: Kill process บน port 3000
```bash
cd tinedy-app
npm run kill-port
npm run dev
```

#### Option 2: ตรวจสอบว่า process ไหนใช้ port 3000
```bash
# Windows
netstat -ano | findstr :3000

# จะได้ PID ตัวสุดท้าย เช่น
# TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345

# Kill process
taskkill //F //PID 12345
```

---

### 📦 Problem: Module not found / Cannot find package

**อาการ:**
```
Module not found: Can't resolve 'class-variance-authority'
```

**วิธีแก้:**
```bash
cd tinedy-app
npm install
# หรือถ้ายังไม่ได้
npm run clean:all  # ลบ node_modules และติดตั้งใหม่
```

---

### 🔨 Problem: Build Error / TypeScript Error

**วิธีตรวจสอบ:**
```bash
cd tinedy-app
npm run type-check
```

**วิธีแก้:**
- แก้ไข errors ที่ปรากฏ
- ถ้าไม่แน่ใจ ให้ clean และลองใหม่:
  ```bash
  npm run clean
  npm run dev
  ```

---

### 💾 Problem: OneDrive ล็อคไฟล์ .next/trace

**อาการ:**
```
Error: EPERM: operation not permitted, open 'C:\Users\...\OneDrive\...\tinedy-app\.next\trace'
```

**สาเหตุ:**
OneDrive sync พยายาม sync ไฟล์ `.next/trace` ในขณะที่ Next.js กำลังเขียนไฟล์อยู่ ทำให้เกิด permission conflict

**วิธีแก้ (แนะนำให้ทำ Option 2 หรือ 3):**

#### Option 1: ปิด OneDrive Sync ชั่วคราว (Quick Fix)
1. Right-click OneDrive icon in taskbar
2. Settings → Pause syncing → 2 hours
3. รัน `npm run dev:fresh`

#### Option 2: Exclude `.next` จาก OneDrive Sync ⭐ (แนะนำ - เหมาะกับ Developer)
```bash
# ขั้นตอน:
# 1. Right-click โฟลเดอร์ .next
# 2. เลือก "Always keep on this device" → "Free up space"
# 3. หรือ exclude ใน OneDrive settings
```

**ทำอย่างไร:**
1. Right-click `.next` folder
2. เลือก "Always keep on this device" → "Free up space"
3. ใน OneDrive Settings → Sync and backup → Manage backup
4. เพิ่ม `.next` ในรายการ exclude

#### Option 3: ย้ายโปรเจกต์ออกจาก OneDrive ⭐⭐ (แนะนำที่สุด)
```bash
# ย้ายโปรเจกต์ไปที่ local folder
move "C:\Users\Jiraw\OneDrive\Desktop\Tinedy system" "C:\Projects\Tinedy system"

# หรือ
move "C:\Users\Jiraw\OneDrive\Desktop\Tinedy system" "D:\Projects\Tinedy system"
```

**เหตุผล:**
- OneDrive จะ sync `.next` folder (build cache) ซึ่งไม่จำเป็น
- ทำให้เสีย bandwidth และเกิด permission errors
- Git ควรใช้สำหรับ version control แทน

#### Option 4: ใช้ different port (Workaround)
```bash
# ถ้ายังไม่อยากย้ายออกจาก OneDrive
npm run dev -- -p 3000
```

---

## 🎯 Best Practices เพื่อป้องกันปัญหา

### ✅ ควรทำ:
1. **ใช้ VS Code Tasks** แทนการพิมพ์คำสั่งเอง
2. **รัน dev server ใน terminal เดียว** เท่านั้น
3. **หยุด server ด้วย Ctrl+C** ก่อนปิด terminal
4. **เช็ค port ก่อนรัน** ด้วย `npm run kill-port`
5. **Clean cache เมื่อเจอปัญหา** ด้วย `npm run clean`

### ❌ ไม่ควรทำ:
1. ❌ รัน `npm run dev` หลาย terminal พร้อมกัน
2. ❌ ปิด terminal โดยไม่หยุด server (Ctrl+C)
3. ❌ รันจาก root directory (`Tinedy system/`) แทนที่จะเป็น `tinedy-app/`
4. ❌ เก็บโปรเจกต์ใน OneDrive/Google Drive (ควรใช้ Git แทน)
5. ❌ **ใช้ `taskkill //F //IM node.exe` เป็นประจำ** - จะ kill VS Code, Claude Code, และ tools อื่น ๆ ด้วย!

---

## 📋 npm Scripts ที่มีให้ใช้

| Script | คำอธิบาย | ความปลอดภัย |
|--------|----------|-------------|
| `npm run dev` | เริ่ม dev server ปกติ | ✅ ปลอดภัย |
| `npm run dev:clean` | Clean cache แล้วเริ่ม dev server | ✅ ปลอดภัย |
| `npm run dev:fresh` | **Kill ports + Clean + เริ่ม dev server** (แนะนำเมื่อเจอปัญหา) | ✅ ปลอดภัย - kill เฉพาะ ports 3000-3003 |
| `npm run clean` | ลบ `.next` folder | ✅ ปลอดภัย |
| `npm run clean:all` | ลบ `.next` และ `node_modules` แล้วติดตั้งใหม่ | ✅ ปลอดภัย |
| `npm run kill-port` | **Kill processes บน ports 3000-3003 เท่านั้น** | ✅ ปลอดภัย - ไม่กระทบ VS Code |
| `npm run type-check` | ตรวจสอบ TypeScript errors | ✅ ปลอดภัย |
| `npm run build` | Build สำหรับ production | ✅ ปลอดภัย |
| `npm run lint` | รัน ESLint | ✅ ปลอดภัย |

### ⚠️ คำเตือนสำคัญ

**`npm run kill-port` vs `taskkill //F //IM node.exe`:**

| คำสั่ง | ผลกระทบ | ควรใช้หรือไม่ |
|--------|---------|---------------|
| `npm run kill-port` | Kill เฉพาะ processes บน ports 3000-3003 | ✅ **แนะนำ** - ปลอดภัย |
| `taskkill //F //IM node.exe` | Kill **ทุก** node.exe processes รวมถึง VS Code, Claude Code | ⚠️ อันตราย - ใช้เป็น Last Resort เท่านั้น! |

---

## 🔍 วิธีตรวจสอบปัญหา

### 1. เช็คว่า dev server รันอยู่หรือไม่
```bash
netstat -ano | findstr :3000
```

### 2. เช็ค TypeScript errors
```bash
npm run type-check
```

### 3. ดู logs แบบเต็ม
```bash
npm run dev --verbose
```

### 4. เช็คว่าติดตั้ง dependencies ครบหรือไม่
```bash
npm list --depth=0
```

---

## 🆘 ยังแก้ไม่ได้?

### Nuclear Option (ลบทุกอย่างและเริ่มใหม่):
```bash
cd tinedy-app

# 1. ⚠️ Kill ทุก node processes (WARNING: จะปิด VS Code extensions!)
taskkill //F //IM node.exe

# 2. Reload VS Code ทันที
#    Ctrl+Shift+P → "Developer: Reload Window"

# 3. ลบ cache และ dependencies ทั้งหมด
npm run clean:all

# 4. รันใหม่
npm run dev
```

**⚠️ หมายเหตุ:** หลังจาก `taskkill //F //IM node.exe` คุณต้อง:
- Reload VS Code (`Ctrl+Shift+P` → `Developer: Reload Window`)
- หรือปิด/เปิด VS Code ใหม่
- Claude Code agent จะถูก kill ด้วย (ต้องเริ่ม conversation ใหม่)

### หากยังไม่ได้:
1. ✅ ใช้ `npm run dev:fresh` แทน (ปลอดภัยกว่า)
2. Restart VS Code
3. Restart Computer
4. ตรวจสอบว่า Node.js version ถูกต้อง: `node --version` (ควรเป็น v20+)
5. ย้ายโปรเจกต์ออกจาก OneDrive

---

## 📚 อ้างอิง

- [INCIDENT_REPORT.md](../INCIDENT_REPORT.md) - รายงานปัญหาที่เคยเกิดขึ้น
- [Next.js Troubleshooting](https://nextjs.org/docs/messages)
- [VS Code Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)

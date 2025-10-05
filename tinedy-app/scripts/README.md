# Scripts - Firebase User Management

สคริปต์เสริมสำหรับจัดการผู้ใช้และสิทธิ์ในระบบ Tinedy

## 📋 สารบัญ

- [set-user-role.js](#set-user-rolejs) - กำหนด role ให้ผู้ใช้

---

## 🔧 set-user-role.js

### คำอธิบาย
กำหนด Custom Claims (role) ให้กับผู้ใช้ใน Firebase Authentication เพื่อควบคุมสิทธิ์การเข้าถึง

### ⚙️ การเตรียมความพร้อม (ครั้งแรก)

#### ขั้นตอนที่ 1: ดาวน์โหลด Service Account Key

1. เข้า [Firebase Console](https://console.firebase.google.com)
2. เลือกโปรเจกต์ของคุณ
3. ไปที่ **⚙️ Project Settings** (ไอคอนเฟือง)
4. เลือกแท็บ **Service Accounts**
5. คลิก **Generate new private key**
6. บันทึกไฟล์ JSON ที่ได้เป็น `serviceAccountKey.json`
7. **วาง `serviceAccountKey.json` ไว้ใน folder `tinedy-app/`** (ไม่ใช่ใน scripts/)

```
C:\Tinedy system\tinedy-app\
├── serviceAccountKey.json  ← วางที่นี่
├── scripts/
│   └── set-user-role.js
├── app/
├── components/
└── ...
```

#### ขั้นตอนที่ 2: ตรวจสอบ .gitignore

⚠️ **สำคัญมาก!** ต้องแน่ใจว่า `serviceAccountKey.json` ถูก ignore ใน git

ไฟล์ `.gitignore` ควรมีบรรทัดนี้:
```
serviceAccountKey.json
```

### 🚀 วิธีใช้งาน

#### รูปแบบคำสั่ง

```bash
cd "C:\Tinedy system\tinedy-app"
node scripts/set-user-role.js <email> <role>
```

#### Roles ที่มีให้เลือก

| Role | คำอธิบาย | สิทธิ์ |
|------|---------|--------|
| `admin` | ผู้ดูแลระบบ | สิทธิ์เต็ม - ทุกฟีเจอร์ |
| `operator` | ผู้ปฏิบัติงาน | จัดการการจอง, ลูกค้า, พนักงาน |
| `staff` | พนักงาน | ดูตารางงานและรับงาน (สำหรับ Mobile Portal) |
| `viewer` | ผู้ดู | ดูข้อมูลอย่างเดียว (Read-only) |

#### ตัวอย่างการใช้งาน

**1. กำหนดสิทธิ์ Admin:**
```bash
node scripts/set-user-role.js admin@tinedy.com admin
```

**2. กำหนดสิทธิ์ Operator:**
```bash
node scripts/set-user-role.js operator@tinedy.com operator
```

**3. กำหนดสิทธิ์ Staff:**
```bash
node scripts/set-user-role.js staff@tinedy.com staff
```

**4. กำหนดสิทธิ์ Viewer:**
```bash
node scripts/set-user-role.js viewer@tinedy.com viewer
```

### 📊 Output ตัวอย่าง

**สำเร็จ:**
```
✅ Firebase Admin initialized successfully

🔍 Searching for user with email: admin@tinedy.com
✅ User found!
   UID: abc123xyz456
   Email: admin@tinedy.com
   Display Name: Admin User

🔧 Setting role to: admin
✅ Role set successfully!

⚠️  IMPORTANT: User must log out and log in again for changes to take effect

📋 Summary:
   Email: admin@tinedy.com
   UID: abc123xyz456
   New Role: admin

✨ Done!
```

**ไม่พบผู้ใช้:**
```
❌ Error: There is no user record corresponding to the provided identifier.

💡 Tip: Make sure the user exists in Firebase Authentication
   You can create users at: Firebase Console → Authentication → Users
```

### ⚠️ ข้อควรระวัง

1. **ผู้ใช้ต้อง Logout และ Login ใหม่** เพื่อให้ Custom Claims มีผล
2. **serviceAccountKey.json** ต้องไม่ถูก commit เข้า Git (มีข้อมูลลับ)
3. **ต้องสร้างผู้ใช้ใน Firebase Authentication ก่อน** ถึงจะกำหนด role ได้

### 🐛 Troubleshooting

#### ❌ Error: Cannot find module '../serviceAccountKey.json'

**สาเหตุ:** ไม่พบไฟล์ Service Account Key

**วิธีแก้:**
1. ตรวจสอบว่าไฟล์ `serviceAccountKey.json` อยู่ใน `tinedy-app/` (ไม่ใช่ใน `scripts/`)
2. ตรวจสอบชื่อไฟล์ว่าถูกต้อง (case-sensitive)

#### ❌ Error: auth/user-not-found

**สาเหตุ:** ไม่มีผู้ใช้ในระบบ

**วิธีแก้:**
1. เข้า Firebase Console → Authentication → Users
2. สร้างผู้ใช้ใหม่ด้วย email ที่ต้องการ
3. ลองรันคำสั่งอีกครั้ง

---

## 📚 เอกสารเพิ่มเติม

- [Firebase Authentication - Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firebase Admin SDK - Node.js](https://firebase.google.com/docs/admin/setup)

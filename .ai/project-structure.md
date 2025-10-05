# Project Structure - Tinedy Solutions

**Created**: 2025-10-04
**Purpose**: Quick reference for all agents (especially DEV) about project structure and working directories

---

## 🎯 Quick Start for DEV Agent

### Before ANY npm/build/dev command:

```bash
# ✅ ALWAYS navigate to app directory FIRST
cd "C:\Tinedy system\tinedy-app"

# Then run your commands
npm install
npm run dev
npm run build
```

### ❌ WRONG - Do NOT run npm commands in root:
```bash
# ❌ WRONG - This is the documentation root
cd "C:\Tinedy system"
npm install  # This installs old/skeleton dependencies
```

---

## 📁 Directory Structure

```
C:\Tinedy system\                    # REPOSITORY ROOT
├── .ai/                             # AI agent documentation & incident reports
│   ├── dev-agent-port-issue.md      # Port management incident
│   ├── port-management-checklist.md # Port management guidelines
│   └── project-structure.md         # THIS FILE
│
├── .bmad-core/                      # BMAD agent configuration
│   ├── core-config.yaml             # Project configuration
│   ├── checklists/                  # PO/QA checklists
│   ├── tasks/                       # Agent tasks
│   └── templates/                   # Document templates
│
├── docs/                            # PRODUCT DOCUMENTATION
│   ├── architecture/                # Architecture docs
│   │   ├── coding-standards.md      # Coding standards & best practices
│   │   ├── ADR-*.md                 # Architecture Decision Records
│   │   └── Tinedy - Architecture - *.md
│   ├── stories/                     # User stories
│   │   ├── 1.1.project-initialization.md
│   │   ├── 1.2.firebase-integration.md
│   │   └── ...
│   ├── qa/                          # QA gates & test plans
│   ├── ux-ui/                       # UX/UI specifications
│   ├── Epic *.md                    # Epic documents
│   ├── 1. Executive Summary.md      # PRD sections
│   └── ...
│
├── tinedy-app/                      # ⭐ MAIN APPLICATION (WORK HERE)
│   ├── app/                         # Next.js App Router
│   │   ├── (admin)/                 # Admin routes
│   │   ├── (staff)/                 # Staff portal routes
│   │   ├── api/                     # API routes
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   └── globals.css              # Global styles
│   │
│   ├── components/                  # React components
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── bookings/                # Booking components
│   │   ├── staff/                   # Staff components
│   │   └── shared/                  # Shared components
│   │
│   ├── lib/                         # Libraries & utilities
│   │   ├── firebase/                # Firebase config
│   │   ├── services/                # Business logic services
│   │   ├── validations/             # Zod schemas
│   │   └── utils.ts                 # Utilities
│   │
│   ├── public/                      # Static assets
│   ├── types/                       # TypeScript types
│   │
│   ├── package.json                 # ⭐ Main package.json
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── .eslintrc.json               # ESLint configuration
│
├── CLAUDE.md                        # Main instructions (UPDATED with structure info)
├── package.json                     # Root package.json (skeleton - DON'T USE)
└── next.config.js                   # Root config (old - DON'T USE)
```

---

## 🎯 Working Directory Decision Matrix

| Task Type | Working Directory | Examples |
|-----------|------------------|----------|
| **Code Development** | `tinedy-app/` | `npm install`, `npm run dev`, `npm run build` |
| **Documentation** | Root | Edit `docs/`, `CLAUDE.md`, `.ai/` |
| **BMAD Tasks** | Root | Access `.bmad-core/`, run PO/QA tasks |
| **Stories/Epics** | Root | Read/write `docs/stories/`, `docs/Epic *.md` |
| **Architecture** | Root | Edit `docs/architecture/` |
| **Install Dependencies** | `tinedy-app/` | Always `cd tinedy-app` first |
| **Build/Test** | `tinedy-app/` | Always `cd tinedy-app` first |

---

## 📦 Package.json Comparison

### Root `package.json` (OLD - Don't use for dev)
```json
{
  "name": "tinedy-booking-system",
  "version": "0.1.0",
  "dependencies": {
    "next": "14.2.5",        // Old version
    "react": "18.3.1",       // Old version
    "typescript": "5.5.3"    // Old version
  }
}
```
**Purpose**: Skeleton for documentation structure
**Status**: ⚠️ Deprecated for development

### App `tinedy-app/package.json` (CURRENT - Use this)
```json
{
  "name": "tinedy-app",
  "version": "0.1.0",
  "dependencies": {
    "next": "15.5.4",              // ✅ Latest
    "react": "19.1.0",             // ✅ Latest
    "typescript": "5.9.3",         // ✅ Latest
    "@radix-ui/react-slot": "^1.2.3",
    "tailwindcss": "^3.4.18",
    // ... full dependencies
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "kill-port": "npx kill-port 3000 3001 3002 3003",
    "dev:fresh": "npm run kill-port && npm run clean && npm run dev"
  }
}
```
**Purpose**: Actual application
**Status**: ✅ Active development

---

## 🚀 Common DEV Agent Workflows

### 1. First Time Setup
```bash
cd "C:\Tinedy system\tinedy-app"
npm install
npm run dev
```

### 2. Start Development (Fresh)
```bash
cd "C:\Tinedy system\tinedy-app"
npm run dev:fresh  # Kills ports, cleans cache, starts dev
```

### 3. Build for Production
```bash
cd "C:\Tinedy system\tinedy-app"
npm run build
```

### 4. Type Checking
```bash
cd "C:\Tinedy system\tinedy-app"
npm run type-check
```

### 5. Fix Port Conflicts
```bash
cd "C:\Tinedy system\tinedy-app"
npm run kill-port  # Kills ports 3000-3003
```

### 6. Full Clean Reinstall
```bash
cd "C:\Tinedy system\tinedy-app"
npm run clean:all  # Removes .next, node_modules, reinstalls
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ MISTAKE 1: Running npm in wrong directory
```bash
cd "C:\Tinedy system"
npm install  # WRONG - installs old dependencies
npm run dev  # WRONG - runs old Next.js 14
```

**✅ CORRECT:**
```bash
cd "C:\Tinedy system\tinedy-app"
npm install  # Installs correct dependencies
npm run dev  # Runs Next.js 15.5.4
```

### ❌ MISTAKE 2: Editing wrong config files
```bash
# WRONG - Editing root files
C:\Tinedy system\next.config.js        # Old config
C:\Tinedy system\package.json          # Old package.json
```

**✅ CORRECT:**
```bash
# Edit app files
C:\Tinedy system\tinedy-app\next.config.js   # Current config
C:\Tinedy system\tinedy-app\package.json     # Current dependencies
```

### ❌ MISTAKE 3: Port management without identification
See: [`.ai/port-management-checklist.md`](./port-management-checklist.md)

**✅ CORRECT:** Always identify process before killing

---

## 🔍 How to Verify Current Directory

### Quick Check
```bash
# Should show: C:\Tinedy system\tinedy-app
pwd

# Should show tinedy-app package.json with Next.js 15.5.4
cat package.json | grep "next"
```

### When in Doubt
```bash
# Start fresh from known location
cd "C:\Tinedy system\tinedy-app"
```

---

## 📋 Pre-Flight Checklist for DEV Agent

Before running ANY npm/build command:

- [ ] Verified current directory is `tinedy-app/`
- [ ] Checked package.json shows Next.js 15.5.4
- [ ] Not running commands in root directory
- [ ] If port conflict, identified process first (see port-management-checklist.md)
- [ ] Using correct scripts from tinedy-app/package.json

---

## 🆘 Troubleshooting

### "next: command not found"
**Problem**: Running in wrong directory
**Solution**:
```bash
cd "C:\Tinedy system\tinedy-app"
npm install
```

### "Port 3000 already in use"
**Problem**: Previous dev server still running
**Solution**:
```bash
cd "C:\Tinedy system\tinedy-app"
npm run kill-port
npm run dev
```

### "Dependencies not found"
**Problem**: node_modules not installed in tinedy-app
**Solution**:
```bash
cd "C:\Tinedy system\tinedy-app"
npm install
```

### "Wrong version of Next.js/React"
**Problem**: Ran npm install in root directory
**Solution**:
```bash
cd "C:\Tinedy system\tinedy-app"
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Related Documents

- **Main Instructions**: [`CLAUDE.md`](../CLAUDE.md) (now includes structure info)
- **Coding Standards**: [`docs/architecture/coding-standards.md`](../docs/architecture/coding-standards.md)
- **Port Management**: [`.ai/port-management-checklist.md`](./port-management-checklist.md)
- **Port Issue Report**: [`.ai/dev-agent-port-issue.md`](./dev-agent-port-issue.md)

---

**Remember: When in doubt, `cd "C:\Tinedy system\tinedy-app"` first!** 🎯

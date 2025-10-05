# Port Management Checklist for DEV Agent

## Pre-Kill Validation Process

### Step 1: Identify the Process
```bash
# Get process details
wmic process where "ProcessId={PID}" get Name,ExecutablePath,CommandLine
```

**Check:**
- [ ] Process name identified
- [ ] Executable path confirmed
- [ ] Not a system/IDE critical process

### Step 2: Check Whitelist

**Whitelisted Processes (DO NOT KILL):**
- [ ] `Code.exe` (VS Code)
- [ ] `msedge.exe` (when parent is Code.exe/DevTools)
- [ ] `node.exe` (when parent is Code.exe)
- [ ] Windows system services
- [ ] Database services (MySQL, PostgreSQL, MongoDB)

### Step 3: Port Classification

**Port Ranges:**
```yaml
System Ports: 0-1023          # Never kill
Registered: 1024-49151        # Check before kill
Dynamic/Private: 49152-65535  # Usually safe to check

Development Ports (Project):
  - Next.js: 3000
  - API: 3001-3010
  - Database: 5432, 3306, 27017
  - Redis: 6379

IDE Internal Ports:
  - VS Code: 54000-54999, 60000-70000
  - Chrome DevTools: 9222-9229
```

**Check:**
- [ ] Port is in development range (3000-9999)
- [ ] Port is NOT in IDE internal range
- [ ] Port is actually needed for current task

### Step 4: Conflict Assessment

**Questions to Answer:**
- [ ] Is this port required for the current development task?
- [ ] Will killing this process break the IDE/development environment?
- [ ] Are there alternative solutions (change port, use different port)?

### Step 5: Execution (If All Checks Pass)

**Correct Syntax:**
```bash
# Windows - Use double slashes
taskkill //F //PID {pid}

# Multiple processes - Use parallel bash calls
# Tool Call 1: taskkill //F //PID {pid1}
# Tool Call 2: taskkill //F //PID {pid2}
```

**DO NOT USE:**
- ❌ `&&` chaining (causes syntax errors)
- ❌ `;` separator (unreliable)
- ❌ Single `/` (gets misinterpreted as path)

## Quick Decision Tree

```
Port in use?
├─ Yes
│  ├─ Check process owner
│  │  ├─ VS Code / IDE?
│  │  │  ├─ Is port in IDE internal range? → SKIP (don't kill)
│  │  │  └─ Is port in dev range? → VERIFY need
│  │  ├─ System service? → SKIP (don't kill)
│  │  └─ Other process?
│  │     ├─ Check port range
│  │     │  ├─ Development port? → Verify conflict
│  │     │  ├─ IDE internal? → SKIP
│  │     │  └─ System port? → SKIP
│  │     └─ If genuine conflict → Kill with correct syntax
│  └─ Unknown process → IDENTIFY FIRST (don't kill blindly)
└─ No → Continue
```

## Common Scenarios

### Scenario 1: "Port 3000 is already in use"
**Action:**
1. Check what's using port 3000
2. If it's old dev server → Kill
3. If it's VS Code → Check why (may be old instance)
4. If it's other project → Suggest port change

### Scenario 2: "Port 54xxx is in use"
**Action:**
1. Identify process (likely VS Code)
2. **DO NOT KILL** - This is IDE internal
3. Continue with development

### Scenario 3: "Multiple ports in use"
**Action:**
1. Identify each process separately
2. Apply checklist to each
3. Use parallel bash calls for actual kills
4. Verify after each kill

## Error Handling

### If kill fails:
1. **ERROR: Process not found**
   - ✅ Already terminated or auto-restarted
   - Check if port is still in use

2. **ERROR: Access denied**
   - Process is system-protected
   - Verify it's safe to kill
   - May need admin privileges

3. **ERROR: Invalid argument/option**
   - Check syntax (`//F` not `/F`)
   - Verify PID is numeric

### If process auto-restarts:
- **This is expected behavior** for:
  - VS Code internal services
  - System services
  - Auto-restart applications
- **DO NOT attempt to kill again**
- Verify it's not causing actual conflict

## Validation After Action

After any port operation:
- [ ] Verify target port is now available (if kill was needed)
- [ ] Check development server can start
- [ ] Confirm IDE is still functional
- [ ] Document any issues in `.ai/debug-log.md`

## Reference

- **Incident Report**: `.ai/dev-agent-port-issue.md`
- **Config**: `.bmad-core/core-config.yaml`
- **Standards**: `docs/architecture/coding-standards.md`

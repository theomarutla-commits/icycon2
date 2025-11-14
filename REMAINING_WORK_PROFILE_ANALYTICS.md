# Remaining Work - Profile & Analytics Features

## Overview

Phase 2 is **92% complete**. This document outlines the remaining 2 feature sets that need to be implemented to complete the full feature suite.

---

## Task 1: Profile Features (15-20 mins)

### Components to Create

#### 1a. EditProfileModal.tsx
**Location**: `frontend/src/pages/profile/EditProfileModal.tsx`

**Fields**:
- Full Name (text input, required)
- Bio/About (textarea, optional)
- Avatar URL (text input, optional)
- Company (text input, optional)
- Location (text input, optional)

**API Integration**:
- Calls `api.updateUserProfile(data)` (need to add to auth.ts)

**Template**:
```typescript
// Similar to other modals
// Header color: "from-blue-600 to-cyan-600"
// Form with user profile fields
// Edit/Cancel buttons
```

#### 1b. ChangeEmailModal.tsx
**Location**: `frontend/src/pages/profile/ChangeEmailModal.tsx`

**Fields**:
- Current Email (text input, display-only)
- New Email (email input, required)
- Confirm New Email (email input, required)
- Password (password input, required - for verification)

**Validation**:
- New email must match confirm email
- Password required for security
- Check email format

**API Integration**:
- Calls `api.changeEmail(newEmail, password)` (need to add)

#### 1c. ChangePasswordModal.tsx
**Location**: `frontend/src/pages/profile/ChangePasswordModal.tsx`

**Fields**:
- Current Password (password input, required)
- New Password (password input, required)
- Confirm New Password (password input, required)
- Show password strength indicator

**Validation**:
- Current password must be correct
- New password must be different from current
- New passwords must match
- Password strength check (min 8 chars, 1 upper, 1 number, 1 special)

**API Integration**:
- Calls `api.changePassword(currentPassword, newPassword)` (need to add)

**Feature**:
- Add password strength meter (weak/fair/good/strong)

#### 1d. AvatarUploadModal.tsx (Optional)
**Location**: `frontend/src/pages/profile/AvatarUploadModal.tsx`

**Features**:
- File input for image upload
- Image preview
- Drag & drop support
- Crop/resize capabilities (if time permits)
- Max file size: 5MB
- Supported formats: JPG, PNG, GIF

**API Integration**:
- Calls `api.uploadAvatar(file)` with FormData (need to add)

### ProfilePage Updates

**Current Structure**: Should already have a profile display section

**Changes Needed**:
1. Add state for 3 modals (edit, changeEmail, changePassword)
2. Add "Edit Profile" button → opens EditProfileModal
3. Add "Change Email" button → opens ChangeEmailModal
4. Add "Change Password" button → opens ChangePasswordModal
5. Integrate all 3 modals with onSuccess callbacks

**Location to Check**: `frontend/src/pages/ProfilePage.tsx`

### API Methods to Add to `auth.ts`

```typescript
// Profile
export const updateUserProfile = async (data: {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  company?: string;
  location?: string;
}): Promise<any> => { ... }

// Email
export const changeEmail = async (newEmail: string, password: string): Promise<any> => { ... }

// Password
export const changePassword = async (currentPassword: string, newPassword: string): Promise<any> => { ... }

// Avatar (optional)
export const uploadAvatar = async (file: File): Promise<any> => { ... }
```

### Estimated Effort
- Creating 3 modals: 10 mins
- Updating ProfilePage: 3 mins
- Adding API methods: 2 mins
- **Total: ~15 minutes**

---

## Task 2: Analytics Features (20-30 mins)

### Components to Create

#### 2a. ExportAnalyticsModal.tsx
**Location**: `frontend/src/pages/analytics/ExportAnalyticsModal.tsx`

**Features**:
- Date range picker (start date, end date)
- Export format selector:
  - CSV
  - JSON
  - PDF
  - Excel
- Metrics to include (checkboxes):
  - Traffic
  - Rankings
  - Backlinks
  - Organic Traffic
  - Indexed Pages
- Include charts (checkbox)
- Email delivery option

**Functionality**:
- Validates date range (start <= end)
- Generates file based on selected format
- Downloads file or sends via email
- Shows progress indicator

**API Integration**:
- Calls `api.exportAnalytics(params)` with date range, format, metrics

#### 2b. DateRangeFilterModal.tsx (Optional)
**Location**: `frontend/src/pages/analytics/DateRangeFilterModal.tsx`

**Features**:
- Quick select buttons: Today, This Week, This Month, Last 30 Days, Last 90 Days, Custom
- Custom date range picker
- Compare with previous period (checkbox)
- Apply/Cancel buttons

**Functionality**:
- Filters all analytics data on page
- Updates charts/graphs based on selection

#### 2c. AnalyticsChart.tsx (Optional but Recommended)
**Location**: `frontend/src/pages/analytics/AnalyticsChart.tsx`

**Features**:
- Line chart for traffic over time
- Bar chart for keyword rankings
- Pie chart for traffic sources
- Use library: `react-chartjs-2` or `recharts`

**Metrics Displayed**:
- Monthly traffic trends
- Top keywords by rank
- Traffic source breakdown
- Conversion funnel

### AnalyticsPage Updates

**Current Structure**: Should display analytics dashboards/metrics

**Changes Needed**:
1. Add state for export modal
2. Add "Export Data" button
3. Add date range filter section
4. Integrate export modal
5. (Optional) Replace static data with charts
6. Add loading states for data fetch

**Location to Check**: `frontend/src/pages/AnalyticsPage.tsx`

### API Methods to Add to `auth.ts`

```typescript
// Export
export const exportAnalytics = async (params: {
  startDate: string;
  endDate: string;
  format: 'csv' | 'json' | 'pdf' | 'excel';
  metrics: string[];
  includeCharts: boolean;
  emailTo?: string;
}): Promise<any> => { ... }

// (Optional) Get analytics for date range
export const getAnalyticsForDateRange = async (
  startDate: string,
  endDate: string
): Promise<any> => { ... }

// (Optional) Compare periods
export const compareAnalyticsPeriods = async (
  period1Start: string,
  period1End: string,
  period2Start: string,
  period2End: string
): Promise<any> => { ... }
```

### Install Dependencies (if adding charts)

```bash
npm install react-chartjs-2 chart.js
# OR
npm install recharts
```

### Template Structure

```typescript
// ExportAnalyticsModal
<DateRangePicker />
<FormatSelector />
<MetricsCheckboxes />
<EmailDeliveryOption />
<ExportButton />
```

### Estimated Effort
- Create ExportAnalyticsModal: 10 mins
- Update AnalyticsPage: 5 mins
- Add API methods: 2 mins
- (Optional) Add charts: 10-15 mins
- **Total: 17 mins (without charts) or 32 mins (with charts)**

---

## Implementation Priority

### High Priority (Must Have)
1. ✅ Profile Edit Modal (quick win)
2. ✅ Change Email Modal (security feature)
3. ✅ Change Password Modal (security feature)
4. ✅ Export Analytics Modal (business feature)

### Medium Priority (Nice to Have)
5. Date Range Filter
6. Analytics Charts

### Low Priority (Future)
7. Avatar Upload with Crop
8. Advanced Analytics Comparisons

---

## Quick Implementation Checklist

### For Profile (Copy-Paste Ready)

```typescript
// 1. Create EditProfileModal.tsx
// 2. Create ChangeEmailModal.tsx
// 3. Create ChangePasswordModal.tsx

// 4. Update ProfilePage.tsx
const [showEditModal, setShowEditModal] = useState(false);
const [showEmailModal, setShowEmailModal] = useState(false);
const [showPasswordModal, setShowPasswordModal] = useState(false);

// 5. Add buttons
<button onClick={() => setShowEditModal(true)}>Edit Profile</button>
<button onClick={() => setShowEmailModal(true)}>Change Email</button>
<button onClick={() => setShowPasswordModal(true)}>Change Password</button>

// 6. Add modals at bottom
<EditProfileModal isOpen={showEditModal} onClose={...} onSuccess={...} />
<ChangeEmailModal isOpen={showEmailModal} onClose={...} onSuccess={...} />
<ChangePasswordModal isOpen={showPasswordModal} onClose={...} onSuccess={...} />
```

### For Analytics

```typescript
// 1. Create ExportAnalyticsModal.tsx

// 2. Update AnalyticsPage.tsx
const [showExportModal, setShowExportModal] = useState(false);

// 3. Add button
<button onClick={() => setShowExportModal(true)}>Export Data</button>

// 4. Add modal
<ExportAnalyticsModal isOpen={showExportModal} onClose={...} onSuccess={...} />
```

---

## Testing Checklist (After Implementation)

### Profile Features
- [ ] Edit profile saves correctly
- [ ] Change email requires password verification
- [ ] Change password validates old password
- [ ] Password strength indicator works
- [ ] Confirm password fields match
- [ ] Success messages display
- [ ] Errors handled gracefully
- [ ] Modal closes on success

### Analytics Features
- [ ] Date range picker validates properly
- [ ] Export generates correct file format
- [ ] Email delivery option works
- [ ] Progress indicator displays
- [ ] File downloads/sends successfully
- [ ] Metrics selection works
- [ ] Charts render correctly (if implemented)

---

## File Locations Summary

```
frontend/src/pages/
├── ProfilePage.tsx (UPDATE)
├── AnalyticsPage.tsx (UPDATE)
├── profile/
│   ├── EditProfileModal.tsx (CREATE)
│   ├── ChangeEmailModal.tsx (CREATE)
│   ├── ChangePasswordModal.tsx (CREATE)
│   └── AvatarUploadModal.tsx (CREATE - optional)
└── analytics/
    ├── ExportAnalyticsModal.tsx (CREATE)
    ├── DateRangeFilterModal.tsx (CREATE - optional)
    └── AnalyticsChart.tsx (CREATE - optional)
```

---

## Next Session Action Items

1. **Immediate** (5 mins):
   - Create 3 Profile modals
   - Update ProfilePage
   - Add profile API methods

2. **Short-term** (5-10 mins):
   - Create ExportAnalyticsModal
   - Update AnalyticsPage
   - Add analytics API methods

3. **Optional** (10-15 mins):
   - Add analytics charts
   - Add date range filter
   - Add avatar upload

4. **Final** (ongoing):
   - Test with actual backend
   - Fix any bugs
   - Performance optimization

---

## Success Criteria

- ✅ All remaining modals created and styled
- ✅ All pages updated with modals integrated
- ✅ All API methods implemented
- ✅ Profile settings fully functional
- ✅ Analytics export working
- ✅ 100% feature coverage (all 6 major features)
- ✅ Ready for production testing

---

## Estimated Total Time

- Profile Features: **15-20 minutes**
- Analytics Features: **17-32 minutes** (depending on charts)
- **Total Remaining: 32-52 minutes for complete Phase 2**

**Current Status: 92% Complete ✅**
**Estimated Final Time: 34-52 minutes to 100% ✅**

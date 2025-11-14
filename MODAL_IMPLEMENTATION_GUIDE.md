# Modal Implementation Guide - Quick Reference

## For Developers Adding New Features

This guide shows the exact pattern used to implement all modals in Phase 2. Follow this template to add new features.

---

## Step 1: Create the Modal Component

### File: `src/pages/[feature]/Create[Feature]Modal.tsx`

```typescript
import React, { useState } from 'react';
import * as api from '../../api/auth';

interface Create[Feature]ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const Create[Feature]Modal: React.FC<Create[Feature]ModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // 1. Define form state
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    // ... other fields
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Handle field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 4. Validate input
    if (!formData.field1.trim()) {
      setError('Field1 is required');
      setLoading(false);
      return;
    }

    try {
      // 5. Call API
      await api.create[Feature](formData);

      // 6. Reset form
      setFormData({
        field1: '',
        field2: '',
      });

      // 7. Refresh parent data
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  // 8. Return early if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[primary] to-[secondary] px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Create New [Feature]</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Field 1 *
            </label>
            <input
              type="text"
              name="field1"
              value={formData.field1}
              onChange={handleChange}
              placeholder="Enter value"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[primary-500]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[primary-600] text-white py-2 rounded font-semibold hover:bg-[primary-700] transition disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create[Feature]Modal;
```

---

## Step 2: Create Edit Modal (Similar Pattern)

### File: `src/pages/[feature]/Edit[Feature]Modal.tsx`

**Key Differences from Create:**

```typescript
// Add useEffect to populate form when modal opens
useEffect(() => {
  if (resource && isOpen) {
    setFormData({
      field1: resource.field1,
      field2: resource.field2,
    });
    setError(null);
  }
}, [resource, isOpen]);

// In handleSubmit, use update API instead of create
await api.update[Feature](resource.id, formData);

// Change button text to "Update"
{loading ? 'Updating...' : 'Update'}

// Return null if no resource
if (!isOpen || !resource) return null;
```

---

## Step 3: Update Main Page Component

### File: `src/pages/[Feature]Page.tsx`

#### 3a. Add Imports
```typescript
import Create[Feature]Modal from './[feature]/Create[Feature]Modal';
import Edit[Feature]Modal from './[feature]/Edit[Feature]Modal';
```

#### 3b. Add State
```typescript
const [showCreateModal, setShowCreateModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [selectedResource, setSelectedResource] = useState<any>(null);
```

#### 3c. Refactor Fetch Function
```typescript
// BEFORE
useEffect(() => {
  const fetchData = async () => {
    // ... fetch logic
  };
  fetchData();
}, []);

// AFTER - Make it callable for modal onSuccess
const fetchData = async () => {
  // ... same fetch logic
};

useEffect(() => {
  fetchData();
}, []);
```

#### 3d. Add Create Button in Header
```typescript
<div className="flex justify-between items-center mb-8">
  <div>
    <h1>Feature Title</h1>
    <p>Description</p>
  </div>
  {activeTab === '[mainTab]' && (
    <button
      onClick={() => setShowCreateModal(true)}
      className="bg-white text-[primary]-900 px-6 py-3 rounded-lg font-bold hover:bg-[primary]-50 transition shadow-lg"
    >
      + Add [Feature]
    </button>
  )}
</div>
```

#### 3e. Add Action Buttons to Cards/Items
```typescript
<div className="flex gap-3">
  <button className="flex-1 bg-blue-600 text-white py-2 rounded">
    View
  </button>
  <button
    onClick={() => {
      setSelectedResource(item);
      setShowEditModal(true);
    }}
    className="flex-1 bg-indigo-600 text-white py-2 rounded"
  >
    Edit
  </button>
  <button className="flex-1 bg-red-600 text-white py-2 rounded">
    Delete
  </button>
</div>
```

#### 3f. Add Empty State
```typescript
{items.length === 0 && !loading && (
  <div className="bg-white rounded-lg shadow p-8 text-center">
    <p className="text-gray-600 text-lg mb-4">No items found.</p>
    <button
      onClick={() => setShowCreateModal(true)}
      className="bg-[primary-600] text-white px-6 py-2 rounded hover:bg-[primary-700] transition"
    >
      + Create Your First Item
    </button>
  </div>
)}
```

#### 3g. Add Modals at End of Return
```typescript
{/* Modals */}
<Create[Feature]Modal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  onSuccess={fetchData}
/>
<Edit[Feature]Modal
  isOpen={showEditModal}
  onClose={() => {
    setShowEditModal(false);
    setSelectedResource(null);
  }}
  onSuccess={fetchData}
  resource={selectedResource}
/>
```

---

## Step 4: Add API Methods to `src/api/auth.ts`

### API Method Pattern

```typescript
// CREATE
export const create[Feature] = async (data: any): Promise<any> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('User not authenticated');

  const response = await fetch(`${API_BASE_URL}/[feature]/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create [feature]');
  }

  return response.json();
};

// UPDATE
export const update[Feature] = async (id: number, data: any): Promise<any> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('User not authenticated');

  const response = await fetch(`${API_BASE_URL}/[feature]/${id}/update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update [feature]');
  }

  return response.json();
};

// DELETE
export const delete[Feature] = async (id: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('User not authenticated');

  const response = await fetch(`${API_BASE_URL}/[feature]/${id}/delete/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete [feature]');
  }
};
```

---

## Color Scheme Reference

Use these gradients for different feature types:

```typescript
// SEO/Performance
"from-blue-600 to-indigo-600"

// Email/Marketing
"from-indigo-600 to-purple-600"

// Marketplace/Commerce
"from-purple-600 to-indigo-600"

// Social/Community
"from-pink-600 to-red-600"

// Analytics/Data
"from-green-600 to-teal-600"

// General
"from-gray-600 to-gray-700"
```

---

## Input Field Template

```typescript
<div>
  <label className="block text-gray-700 font-semibold mb-2">
    Field Label * {showCounter && `(${counter}/limit)`}
  </label>
  <input
    type="text|email|number|datetime-local|url"
    name="fieldName"
    value={formData.fieldName}
    onChange={handleChange}
    placeholder="Enter value"
    maxLength={maxLength}
    min={minValue}
    step={stepValue}
    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[primary-500]"
  />
  <p className="text-xs text-gray-500 mt-1">Helper text or constraint info</p>
</div>
```

---

## Form Validation Checklist

- [ ] Required fields have asterisk (*)
- [ ] Error messages are specific ("Title required", not just "Error")
- [ ] Character limits enforced
- [ ] Number fields have min/max constraints
- [ ] Email fields validated
- [ ] URLs validated
- [ ] Dates have min date set
- [ ] Dropdown has placeholder "Select an option"
- [ ] Loading state disables submit button
- [ ] Error banner appears above form
- [ ] Success state triggers onSuccess callback

---

## Common Patterns

### Conditional Render for Tab
```typescript
{activeTab === 'tabName' && (
  <>Content</>
)}
```

### Conditional Button Visibility
```typescript
{activeTab === 'targetTab' && (
  <button>Create New</button>
)}
```

### Array Mapping with Keys
```typescript
{items.map((item) => (
  <div key={item.id}>Content</div>
))}
```

### Loading & Error States
```typescript
{loading && <div>Loading...</div>}
{error && <div className="bg-red-100 ...">Error: {error}</div>}
{items.length === 0 && !loading && <div>No items</div>}
```

---

## Files to Modify Checklist

When adding a new feature:

- [ ] Create `src/pages/[feature]/Create[Feature]Modal.tsx`
- [ ] Create `src/pages/[feature]/Edit[Feature]Modal.tsx` (optional)
- [ ] Update `src/pages/[Feature]Page.tsx`
- [ ] Add API methods to `src/api/auth.ts`
- [ ] Test modals in browser
- [ ] Test API calls with backend
- [ ] Verify styling consistency
- [ ] Check responsive design
- [ ] Validate form validation
- [ ] Update todo list

---

## Expected Output

✅ Two modal components (Create and Edit)
✅ Updated page with:
  - Create button in header
  - Action buttons on items (View, Edit, Delete)
  - Empty state with Create button
  - Modal integration at bottom
✅ 3 API methods (Create, Update, Delete)
✅ Full CRUD workflow ready for testing

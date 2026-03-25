# Work Builder - Drag & Drop File Management

## Visual Design Updates

### 1. **File Display Inside Work Cards**
Each Work card now displays uploaded files as compact, draggable chips:
- File icon + grip handle + truncated filename
- Shows first 3 files, with "+X more" for additional files
- Light gray background with subtle border
- Clean separation between files and settings

### 2. **Drag Interaction States**

#### **Default State**
- Files displayed as chips with grip icon (⋮⋮) indicating draggability
- Soft gray background (#F9FAFB)
- Border: #E5E7EB

#### **Dragging State** 
- File chip becomes semi-transparent (50% opacity)
- Elevated shadow appears
- Border changes to indigo-300 for feedback
- Cursor changes to "move"

#### **Drop Zone Highlight (Hovering Over Target Work)**
- Target Work card shows dashed indigo border overlay
- Light indigo background tint (bg-indigo-50/80)
- "Move to Work X" badge appears in center
- Clear visual feedback that drop is possible

#### **Drop Zone Neutral (While Dragging)**
- All other Works show subtle dashed border hint
- Lighter indigo tint (bg-indigo-50/40)
- Shows which cards are valid drop targets

### 3. **Layout Hierarchy**
```
Work Card
├── Header (Icon + Title)
├── Files Section (NEW)
│   ├── Draggable File Chips (max 3 visible)
│   └── "+X more" counter
├── Divider (subtle)
├── Settings Chips (unchanged)
├── Price (unchanged)
├── Divider
└── Action Buttons (Edit + Delete)
```

### 4. **UX Behavior**
- **File Transfer**: Drag file from Work A to Work B
  - File removed from Work A
  - File added to Work B
  - Work B's existing settings automatically apply
  - Both prices recalculate instantly

- **Mobile Touch Support**: 
  - Uses TouchBackend for touch devices
  - HTML5Backend for desktop
  - Auto-detected on load

- **Visual Feedback**:
  - Clear drag affordances (grip icon)
  - Destination highlighting
  - Smooth animations (Motion/React)
  - Spring easing for natural feel

### 5. **No Breaking Changes**
✅ Configure Work modal unchanged  
✅ Edit/Delete actions unchanged  
✅ Pricing logic unchanged  
✅ Navigation flow unchanged  
✅ All existing functionality preserved

### 6. **Accessibility**
- Keyboard navigation supported (via react-dnd)
- Clear visual feedback for all states
- Maintains WCAG contrast ratios
- Touch targets remain 48px+ minimum

## Technical Implementation
- **react-dnd** for drag-and-drop logic
- **react-dnd-html5-backend** for desktop
- **react-dnd-touch-backend** for mobile
- FileChip component with useDrag hook
- WorkCard component with useDrop hook
- Automatic price recalculation on file move

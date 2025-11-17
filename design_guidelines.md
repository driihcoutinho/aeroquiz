# Design Guidelines: AeroQuiz - Aviation Quiz PWA

## Design Approach
**Modern Quiz App - Tranquil Lily Theme**
- Clean, professional quiz interface with purple gradient theme
- Vertical list layout for answer options
- Dark mode with elegant purple tones
- Minimalist, distraction-free learning experience

## Color Palette: Tranquil Lily

### Primary Colors
- **Deep Purple** (#4B3F6E): Main background
- **Medium Purple** (#6C5F8D): Secondary elements, cards
- **Soft Lavender** (#9C8CB9): Accents, hover states
- **Light Beige** (#DCD7D5): Card backgrounds, text areas
- **Rose Purple** (#BA96C1): Highlights, badges

### Functional Colors
- **Success Green** (#7FD957): Correct answers, progress bar
- **Error Red** (#FF6B6B): Incorrect answers
- **White** (#FFFFFF): Primary text on dark backgrounds
- **Dark Text** (#2C2C2C): Text on light backgrounds

## Core Design Elements

### Typography
- **Primary Font**: Inter or System Sans (clean, modern readability)
- **Headings**: text-2xl to text-3xl, font-semibold
- **Body text**: text-base to text-lg
- **Button text**: text-base, font-medium
- High contrast for accessibility

### Layout System
- **Spacing**: Consistent padding (p-6, p-8, gap-4)
- **Max width**: max-w-2xl for quiz content
- **Centered layout**: All content centered with padding
- **Vertical flow**: Single column for mobile-first design
- **Answer list**: Vertical stack of answer options (space-y-3)

### Component Library

**A. Quiz Screen Structure**
1. **Header Bar** (fixed top):
   - Back button (left)
   - Progress indicator: "02 of 10" (center)
   - Timer with icon (right, purple badge)
   - Background: Deep purple

2. **Progress Bar**:
   - Linear green progress bar below header
   - Width matches completion percentage
   - Smooth animated transitions

3. **Question Card**:
   - White background card (rounded-3xl)
   - Category badge at top ("General Knowledge")
   - Question text: Large, centered, bold
   - Generous padding for readability

4. **Answer Options**:
   - Vertical list of 4 options
   - Each option: Full-width rounded button
   - States:
     - Default: White with subtle border
     - Hover: Light purple tint
     - Selected Correct: Light green (#E8F5E9) with check icon
     - Selected Incorrect: Light red (#FFEBEE) with X icon
   - Icons: Check (✓) or X positioned at right

5. **Next Button**:
   - Green button at bottom
   - Rounded-full design
   - Centered, prominent
   - Only appears after answer selected

**B. Visual Feedback**
- **Correct Answer**: 
  - Light green background
  - Green check icon
  - Smooth fade-in animation

- **Incorrect Answer**:
  - Light red background
  - Red X icon
  - Highlight correct answer in green

### Animations
- Subtle, smooth transitions (200-300ms)
- Answer selection: Gentle scale effect
- Progress bar: Smooth width transitions
- Timer: Pulse effect when < 10 seconds
- Question transitions: Fade in/out

### Responsive Behavior
- **Mobile-first**: Optimized for portrait phone
- **Tablet/Desktop**: Same vertical layout, larger spacing
- **Max width**: Constrained to max-w-2xl for readability

### Special Features
- **Category tags**: Subtle gray badges
- **Timer urgency**: Color shift to warning as time runs low
- **Progress persistence**: Visual indicator of completion
- **Accessibility**: High contrast, clear focus states

### PWA Considerations
- **Dark mode only**: Consistent purple theme
- **No light mode**: App designed for dark environment
- **Immersive**: Full-screen experience
- **Splash screen**: Purple gradient with logo

**Key Principle**: Clean, focused, distraction-free quiz experience with elegant purple aesthetics. Every element serves a purpose without overwhelming the user.

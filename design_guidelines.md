# Design Guidelines: Aviation Quiz PWA (Kahoot!-Inspired)

## Design Approach
**Reference-Based: Kahoot! Platform**
- Draw from Kahoot!'s vibrant, gamified quiz experience
- Energetic, playful interface that makes learning engaging
- Bold geometric shapes and high-contrast design
- Full-screen immersive quiz experience

## Core Design Elements

### Typography
- **Primary Font**: Poppins or Montserrat (Google Fonts) - bold, modern, playful
- **Heading sizes**: text-4xl to text-6xl (question text), extra bold (font-bold/font-extrabold)
- **Body text**: text-xl to text-2xl (clear readability)
- **Button text**: text-lg to text-xl, font-semibold
- High contrast for instant readability during timed gameplay

### Layout System
- **Spacing primitives**: Use Tailwind units of 4, 6, 8, and 12 (p-4, gap-6, m-8, space-y-12)
- **Full viewport sections**: Each quiz screen occupies full viewport (min-h-screen)
- **Centered content**: Flex/grid centering for all quiz elements
- **Answer grid**: 2x2 grid layout for 4 answer options (grid-cols-2 gap-4 on desktop, single column on mobile)
- **Max widths**: Container max-w-4xl for quiz content, max-w-6xl for results screen

### Component Library

**A. Quiz Screens**
1. **Start Screen**: 
   - Large centered title with aviation icon
   - Prominent "Iniciar Quiz" button
   - Brief instruction text
   - Optional: airplane illustration background

2. **Question Screen**:
   - Top bar: Timer (circular progress) + Question counter (e.g., "5/10")
   - Question text: Large, centered, bold
   - Answer buttons: 4 large geometric blocks in 2x2 grid
   - Each button: Icon/letter (A, B, C, D) + answer text
   - Bottom: Progress bar showing quiz completion

3. **Feedback Screen** (after each answer):
   - Full-screen celebration/correction message
   - Show correct answer highlighted
   - Points earned display
   - Auto-advance to next question (2-3 seconds)

4. **Results Screen**:
   - Final score: Extra large, celebratory
   - Performance summary: Correct/Total, Accuracy percentage
   - Trophy/medal icon based on performance
   - "Tentar Novamente" button
   - Answer review section (expandable list)

**B. Interactive Elements**
- **Answer Buttons**: 
  - Large tap targets (min-height: 80px on mobile, 120px on desktop)
  - Rounded corners (rounded-xl or rounded-2xl)
  - Transform scale on hover (hover:scale-105)
  - Distinct states: default, hover, selected, correct, incorrect
  - Quick tap feedback animation

- **Timer Component**:
  - Circular countdown (like Kahoot!)
  - Visual urgency as time decreases
  - Positioned top-right corner
  - Numbers countdown inside circle

- **Progress Indicators**:
  - Linear progress bar at screen bottom
  - Question counter (current/total)
  - Score display updating after each question

**C. Navigation**
- Minimal navigation during quiz (no back button to prevent cheating)
- Menu icon (top-left) for: Pause, Quit Quiz, Sound toggle
- Restart button only on results screen

### Animations
**Essential for Gamification** (unlike typical apps, animations are core to quiz experience):
- Question transitions: Slide/fade between questions
- Answer feedback: Shake for wrong, bounce for correct
- Score counter: Counting up animation
- Timer: Pulse/color change as time runs low
- Results: Staggered reveal of stats
- Button interactions: Scale and color transitions

### Images
**No large hero image needed**. This is an app-style interface, not a landing page.

**Optional Decorative Elements**:
- Small airplane/aviation icons in corners
- Subtle cloud patterns as background texture
- Trophy/medal icons for achievements
- Keep decorative elements minimal to maintain focus on quiz

### Special Features
- **Offline support**: PWA must cache questions for offline use
- **Sound effects**: Optional correct/incorrect sounds (toggle-able)
- **Haptic feedback**: Vibration on mobile for answer submission
- **Streak counter**: Display consecutive correct answers
- **Category tags**: Show question category (meteorologia, navegação, etc.)

### Responsive Behavior
- **Mobile-first**: Design for portrait phone usage primarily
- **Desktop**: Larger buttons, side padding, max-width container
- **Tablet**: Optimal 2x2 answer grid
- **Portrait lock consideration**: Quiz works best in portrait mode

### PWA Considerations
- **Splash screen**: Aviation-themed loading screen
- **App icon**: Simple, recognizable aviation symbol
- **Status bar**: Match app theme
- **No browser chrome**: Full immersive app experience

**Key Principle**: Every interaction should feel immediate, responsive, and rewarding. The design should energize users to keep learning through playful competition with themselves.
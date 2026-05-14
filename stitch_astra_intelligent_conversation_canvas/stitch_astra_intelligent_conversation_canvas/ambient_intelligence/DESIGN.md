---
name: Ambient Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '300'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  user-prompt:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  card-padding: 32px
---

## Brand & Style
The design system embodies a "soft-tech" philosophy: an interface that feels less like a tool and more like an atmospheric companion. It is designed for ASTRA, an AI assistant that prioritizes calm, clarity, and fluid intelligence.

The visual style is a sophisticated blend of **Glassmorphism** and **Minimalism**. It utilizes frosted surfaces, expansive negative space, and radial light sources to create a sense of depth and focus. The aesthetic avoids the harshness of traditional "high-tech" interfaces, opting instead for organic transitions, blurred boundaries, and a "living" UI that responds subtly to user presence. The goal is to evoke a feeling of serenity and effortless capability.

## Colors
The palette is rooted in the deep spectrum of a night sky, moving away from pure black toward a rich, layered indigo. 

- **Primary & Secondary:** Indigo and Soft Violet form the "core" of the AI's personality, used for active states and brand moments.
- **Accents:** Muted Orange and Warm Amber are reserved strictly for high-importance highlights, system alerts, or "Eureka" moments in the AI's reasoning.
- **Atmosphere:** Surfaces are not solid; they are semi-transparent containers that allow the background gradients to bleed through, maintaining a sense of fluidity.

## Typography
The system utilizes **Inter** for its neutral, systematic clarity. To differentiate between "Machine" and "Human" input, the typography employs weight and style shifts:

- **AI Responses:** Standard weight, generous line-height for readability.
- **User Inputs:** Slightly larger, medium weight, and subtle italics to distinguish the human voice.
- **Display Text:** Light weights and tighter letter-spacing for a modern, architectural feel.

## Layout & Spacing
The layout philosophy favors **asymmetry** and **dynamic composition**. Instead of rigid vertical stacks, elements are often offset to create a more natural, conversational flow.

- **Grid:** A 12-column flexible grid for desktop, reducing to 4 columns for mobile.
- **Rhythm:** An 8px base unit drives all spacing. 
- **White Space:** Generous "breathing room" is mandatory. Elements should never feel crowded; the UI should feel as if it is floating in an expansive environment.
- **Alignment:** Content is often center-aligned or staggered to break the "webpage" feel and lean into the "assistant" experience.

## Elevation & Depth
Depth is achieved through **optical layers** rather than heavy shadows.

- **The Void:** The base background is a deep, fixed gradient.
- **Glass Planes:** Primary containers use a backdrop-blur (20px-40px) and a very thin, low-opacity white border (10-15%) to define edges.
- **Glows:** Instead of drop shadows, "Ambient Glows" are used. These are soft, colored radial gradients placed behind active elements to suggest they are emitting light.
- **Z-Index:** Content stacks logically, with the most recent AI interaction always occupying the highest "visual plane" (most transparent/brightest border).

## Shapes
Shapes are organic and approachable. 

- **Containers:** Use a base radius of 1rem (16px) for cards, scaling up to 2rem for larger modal surfaces.
- **Interactive Elements:** Buttons and input fields use highly rounded corners (Pill-shaped) to reinforce a friendly, non-threatening "soft-tech" vibe.
- **Fluidity:** Avoid sharp 90-degree angles in the primary user flow. The goal is to make every touchpoint feel smooth and tactile.

## Components
- **Glass Cards:** The primary container. Features a 1px inner stroke (top-down light source) and a subtle backdrop blur.
- **Action Buttons:** High-saturation indigo with a soft outer glow on hover. Transition timings should be "Ease-Out" to feel natural.
- **Input Field:** A floating, pill-shaped bar at the bottom of the viewport. It should expand vertically as the user types, maintaining its glass effect.
- **Status Chips:** Small, semi-transparent badges used for metadata (e.g., "Processing," "Source Found"). Use the secondary violet for these.
- **The "Pulse":** A unique component for this design system—a small, glowing orb that fluctuates in size and opacity when the AI is "thinking" or "listening."
- **Layered Lists:** List items are separated by subtle horizontal blurs rather than hard lines, creating a seamless stream of information.
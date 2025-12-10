# Formula 1 Marketplace - Design System

## Design Philosophy

### Visual Language
- **Editorial Luxury**: Inspired by high-end fashion publications, with generous white space and sophisticated typography
- **Minimalist Elegance**: Clean, uncluttered layouts that let products and content breathe
- **Premium Aesthetic**: Every element designed to convey exclusivity and quality

### Color Palette
- **Primary**: Pure White (#FFFFFF) - dominant background
- **Secondary**: Light Gray (#F8F9FA) - section backgrounds
- **Accent Black**: #1A1A1A - text and strong accents
- **Formula Red**: #DC143C - subtle CTA highlights and badges
- **Neutral Gray**: #6C757D - secondary text and borders

### Typography
- **Display Font**: "Playfair Display" - elegant serif for headlines and hero text
- **Body Font**: "Inter" - modern sans-serif for readability
- **Accent Font**: "JetBrains Mono" - monospace for technical details

### Layout Principles
- **Grid System**: 12-column responsive grid with generous gutters
- **White Space**: Abundant padding and margins for breathing room
- **Hierarchy**: Clear visual hierarchy through size, weight, and spacing
- **Alignment**: Precise alignment to create order and sophistication

## Visual Effects & Animation

### Core Libraries Used
1. **Anime.js** - Smooth micro-interactions and page transitions
2. **Splide.js** - Elegant product carousels and image galleries
3. **ECharts.js** - Data visualization for analytics (if needed)
4. **Typed.js** - Typewriter effect for hero headlines
5. **p5.js** - Creative background effects and particle systems
6. **Splitting.js** - Advanced text animations
7. **Matter.js** - Physics-based interactions
8. **Pixi.js** - High-performance visual effects

### Animation Strategy
- **Subtle Motion**: All animations are understated and purposeful
- **Fade Transitions**: Smooth opacity changes for section reveals
- **Parallax Elements**: Gentle parallax on hero sections (max 8% translation)
- **Hover States**: Sophisticated lift effects with soft shadows
- **Loading States**: Elegant skeleton screens and progress indicators

### Header Effects
- **Hero Background**: Subtle particle system using p5.js
- **Text Animation**: Typewriter effect with gradient color cycling
- **Image Treatment**: Ken Burns effect on hero images
- **Scroll Behavior**: Smooth parallax with opacity changes

### Interactive Elements
- **Button Hover**: 3D tilt effect with shadow expansion
- **Product Cards**: Lift animation with increased shadow depth
- **Image Galleries**: Smooth zoom and pan on hover
- **Form Fields**: Focused state with animated underlines

### Scroll Motion
- **Reveal Animations**: Elements fade in when 30% visible
- **Stagger Effects**: Sequential animation of grid items
- **Parallax Limits**: Maximum 8% translateY for decorative elements
- **Performance**: All animations use transform and opacity for 60fps

### Background Treatment
- **Consistent Base**: White background throughout
- **Section Differentiation**: Subtle light gray for content sections
- **Decorative Elements**: Minimal geometric shapes in corners
- **Texture**: Subtle paper-like texture overlay for editorial feel

### Product Display
- **Image Focus**: Large, high-quality product photography
- **Grid Layout**: Masonry-style arrangement for visual interest
- **Hover States**: Image zoom with overlay information
- **Quick View**: Modal with smooth scale animation

### Mobile Considerations
- **Touch Targets**: Minimum 44px for all interactive elements
- **Gesture Support**: Swipe navigation for galleries
- **Responsive Typography**: Fluid scaling based on viewport
- **Performance**: Optimized animations for mobile devices

## Component Styling

### Navigation
- **Sticky Header**: Fixed position with backdrop blur
- **Minimal Design**: Logo, menu items, and cart icon only
- **Hover States**: Subtle underline animations
- **Mobile**: Hamburger menu with slide-out panel

### Buttons
- **Primary**: Black background, white text, red hover state
- **Secondary**: White background, black border and text
- **Ghost**: Transparent with colored text and border
- **Sizes**: Small, medium, large with consistent padding

### Cards
- **Product Cards**: Clean white background with subtle shadow
- **Information Cards**: Light gray background for content sections
- **Hover Effects**: Lift animation with increased shadow
- **Typography**: Consistent hierarchy within cards

### Forms
- **Input Fields**: Minimal border with focus animations
- **Labels**: Floating labels with smooth transitions
- **Validation**: Inline error states with gentle shake animation
- **Buttons**: Consistent with overall button styling

### Modals
- **Backdrop**: Semi-transparent black with blur effect
- **Content**: White background with rounded corners
- **Animation**: Scale and fade in from center
- **Close Button**: Subtle hover effect with rotation

This design system ensures a cohesive, premium experience that reflects the luxury and exclusivity of Formula 1 while maintaining excellent usability across all devices.
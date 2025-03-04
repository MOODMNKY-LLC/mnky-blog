# MOOD MNKY Style Guide

## Brand Identity

### Core Colors
- **Primary Gold**: `hsl(41, 100%, 60%)` (#FFBE33)
- **Dark Gold**: `hsl(41, 100%, 45%)`
- **Light Gold**: `hsl(41, 100%, 60%)`

### Color System

#### Light Theme
```css
--background: 0 0% 98%
--foreground: 240 10% 3.9%
--card: 0 0% 100%
--popover: 0 0% 100%
--primary: 41 100% 45% /* Gold */
--secondary: 240 5% 96%
--muted: 240 5% 96%
--accent: 41 100% 45%
--destructive: 0 84% 60%
--border: 240 6% 90%
--input: 240 6% 90%
--ring: 41 100% 45%
```

#### Dark Theme
```css
--background: 240 10% 3.9%
--foreground: 0 0% 98%
--card: 240 10% 3.9%
--popover: 240 10% 3.9%
--primary: 41 100% 60% /* Brighter gold for dark mode */
--secondary: 240 4% 16%
--muted: 240 4% 16%
--accent: 41 100% 60%
--destructive: 0 63% 31%
--border: 240 4% 16%
--input: 240 4% 16%
--ring: 41 100% 60%
```

## Typography

### Font System
- **Primary Font**: System UI (Arial, Helvetica, sans-serif)
- **Base Size**: 16px
- **Scale**: 
  - h1: 3rem (48px)
  - h2: 2.25rem (36px)
  - h3: 1.875rem (30px)
  - h4: 1.5rem (24px)
  - h5: 1.25rem (20px)
  - h6: 1rem (16px)
  - body: 1rem (16px)
  - small: 0.875rem (14px)

### Text Styles

#### Headings
```css
h1 {
  @apply text-3xl font-bold tracking-tight;
}

h2 {
  @apply text-2xl font-semibold tracking-tight;
}

h3 {
  @apply text-xl font-semibold tracking-tight;
}
```

#### Body Text
```css
body {
  @apply text-base text-foreground antialiased;
}

.text-muted {
  @apply text-muted-foreground;
}
```

## Layout & Spacing

### Container
```css
.container {
  @apply mx-auto px-8 max-w-7xl;
}
```

### Spacing Scale
- 0.25rem (4px)
- 0.5rem (8px)
- 0.75rem (12px)
- 1rem (16px)
- 1.5rem (24px)
- 2rem (32px)
- 3rem (48px)
- 4rem (64px)
- 6rem (96px)
- 8rem (128px)

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}
```

#### Ghost Button
```css
.btn-ghost {
  @apply hover:bg-zinc-800/50 hover:text-amber-500
         border border-transparent
         hover:border-amber-500/50 
         hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]
         transition-all duration-300;
}
```

### Cards

#### Glass Card
```css
.glass-card {
  @apply bg-background/[0.85] 
         backdrop-blur-[8px] 
         backdrop-saturate-[1.8] 
         border border-border/50 
         shadow-lg 
         dark:shadow-primary/5;
}
```

#### Interactive Card
```css
.glass-hover {
  @apply hover:bg-background/[0.95] 
         hover:backdrop-blur-[12px] 
         hover:scale-[1.02] 
         hover:shadow-xl 
         hover:-translate-y-1 
         transition-all duration-300;
}
```

### Navigation

#### Feature Navigation
```css
.feature-nav {
  @apply relative w-14 h-14 rounded-full
         bg-zinc-900/50 dark:bg-zinc-900/50
         backdrop-blur-sm
         border border-zinc-800/50
         hover:bg-zinc-800/50
         hover:border-amber-500/50 
         hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]
         transition-all duration-300 ease-in-out;
}
```

## Effects & Animations

### Gradients

#### Gold Gradient Text
```css
.gold-gradient-text {
  @apply bg-gradient-to-r 
         from-[hsl(var(--gold-light))] 
         to-[hsl(var(--gold-dark))] 
         bg-clip-text 
         text-transparent;
}
```

#### Split Background
```css
.split-bg {
  @apply relative min-h-screen;
}

.split-bg::before {
  @apply content-[''] absolute inset-0 z-[-1];
  background: linear-gradient(
    to right,
    #FFBE33 0%,
    #FFBE33 50%,
    hsl(var(--background-alt)) 50%,
    hsl(var(--background-alt)) 100%
  );
}
```

### Animations

#### Float Animation
```css
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

#### Text Shimmer
```css
.animate-text-shimmer {
  @apply bg-[length:200%_100%] 
         animate-[text-shimmer_2s_linear_infinite];
  background-position: 100%;
}

@keyframes text-shimmer {
  from { background-position: 0%; }
  to { background-position: 200%; }
}
```

## Interactive Elements

### Hover States

#### Lift Effect
```css
.hover-lift {
  @apply transition-transform duration-300 hover:-translate-y-1;
}
```

#### Glow Effect
```css
.hover-glow {
  @apply transition-all duration-300 
         hover:shadow-[0_0_15px_rgba(var(--gold-light),0.3)];
}
```

### Scrollbar
```css
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  @apply bg-muted;
}

::-webkit-scrollbar-thumb {
  @apply bg-primary/50 rounded-full hover:bg-primary/70 transition-colors;
}
```

## Responsive Design

### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1400px

### Container Sizes
```css
container: {
  center: true,
  padding: '2rem',
  screens: {
    '2xl': '1400px'
  }
}
```

## Best Practices

1. **Component Styling**
   - Use Tailwind's utility classes for consistent styling
   - Leverage the glass effect for depth and modern feel
   - Maintain the gold accent color for interactive elements

2. **Animations**
   - Keep animations subtle and purposeful
   - Use transition-all for smooth state changes
   - Implement hover effects that enhance interactivity

3. **Dark Mode**
   - Ensure proper contrast in dark mode
   - Use brighter gold accents for dark theme
   - Maintain readability with appropriate text colors

4. **Accessibility**
   - Maintain sufficient color contrast
   - Provide focus states for interactive elements
   - Include proper ARIA attributes

5. **Performance**
   - Use hardware-accelerated animations
   - Optimize transitions for smooth performance
   - Implement proper loading states

## Usage Examples

### Feature Navigation Button
```tsx
<Button
  variant="ghost"
  size="icon"
  className={cn(
    "relative w-14 h-14 rounded-full",
    "bg-zinc-900/50 dark:bg-zinc-900/50",
    "backdrop-blur-sm",
    "border border-zinc-800/50",
    "hover:bg-zinc-800/50",
    "hover:border-amber-500/50 hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]",
    "transition-all duration-300 ease-in-out",
    "group",
    isActive && "bg-zinc-800/50 border-amber-500/50 shadow-[0_0_12px_0_rgba(245,158,11,0.5)]"
  )}
>
  <div className={cn(
    "text-zinc-400 group-hover:text-amber-500 transition-colors",
    isActive && "text-amber-500"
  )}>
    {icon}
  </div>
</Button>
```

### Glass Card Component
```tsx
<Card className="border-zinc-800 bg-zinc-900/50">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <div className="flex items-center space-x-2">
      <Icon className="h-4 w-4 text-amber-500" />
      <CardTitle className="text-lg">{title}</CardTitle>
    </div>
    <Badge variant="outline" className="border-amber-500/50 text-amber-500">
      {badge}
    </Badge>
  </CardHeader>
  <CardContent>
    <CardDescription className="text-zinc-400">
      {description}
    </CardDescription>
  </CardContent>
</Card>
``` 
/**
 * Animation utilities and configurations
 * Provides consistent animation classes and utilities for the application
 */

/**
 * Animation duration constants
 */
export const ANIMATION_DURATION = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

/**
 * Animation easing functions
 */
export const ANIMATION_EASING = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Common animation classes
 */
export const ANIMATION_CLASSES = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  
  // Slide animations
  slideInUp: 'animate-slide-up',
  slideInDown: 'animate-slide-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  
  // Hover effects
  hoverLift: 'hover-lift',
  hoverScale: 'hover-scale',
  hoverGlow: 'hover:shadow-glow',
  
  // Loading animations
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
  
  // Custom animations
  shimmer: 'animate-shimmer',
  float: 'animate-float',
  wiggle: 'animate-wiggle',
} as const;

/**
 * Stagger animation delays for lists
 */
export const STAGGER_DELAYS = {
  fast: 'delay-75',
  normal: 'delay-100',
  slow: 'delay-150',
} as const;

/**
 * Animation variants for different components
 */
export const ANIMATION_VARIANTS = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Modal animations
  modal: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  
  // Card animations
  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Button animations
  button: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    transition: { duration: 0.1 },
  },
  
  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
} as const;

/**
 * Generate stagger animation classes for lists
 */
export function getStaggerClasses(count: number, delay: keyof typeof STAGGER_DELAYS = 'normal') {
  return Array.from({ length: count }, (_, index) => 
    `animate-in slide-in-from-left-4 fade-in-0 duration-300 ${STAGGER_DELAYS[delay]}`
  );
}

/**
 * Generate animation classes with custom delay
 */
export function getAnimationClasses(
  animation: keyof typeof ANIMATION_CLASSES,
  delay?: number
): string {
  const baseClass = ANIMATION_CLASSES[animation];
  const delayClass = delay ? `delay-${delay}` : '';
  return `${baseClass} ${delayClass}`.trim();
}

/**
 * Intersection Observer options for scroll animations
 */
export const INTERSECTION_OPTIONS = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
} as const;

/**
 * Animation presets for common use cases
 */
export const ANIMATION_PRESETS = {
  // Hero section animations
  hero: {
    title: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700',
    subtitle: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200',
    button: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300',
  },
  
  // Feature section animations
  features: {
    container: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
    item: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
  },
  
  // Product grid animations
  products: {
    container: 'animate-in fade-in-0 duration-500',
    item: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-300',
  },
  
  // Form animations
  form: {
    container: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
    field: 'animate-in fade-in-0 slide-in-from-left-4 duration-300',
  },
  
  // Navigation animations
  nav: {
    item: 'transition-all duration-200 hover:scale-105',
    dropdown: 'animate-in slide-in-from-top-2 duration-200',
  },
} as const;

/**
 * Custom CSS animations to be added to globals.css
 */
export const CUSTOM_ANIMATIONS = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

@keyframes slide-in-left {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slide-in-right {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes scale-out {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0; }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-wiggle {
  animation: wiggle 1s ease-in-out infinite;
}

.animate-slide-in-left {
  animation: slide-in-left 0.3s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

.animate-scale-out {
  animation: scale-out 0.2s ease-out;
}
`;

/**
 * Utility function to create smooth transitions
 */
export function createTransition(
  properties: string[],
  duration: keyof typeof ANIMATION_DURATION = 'normal',
  easing: keyof typeof ANIMATION_EASING = 'ease'
): string {
  const durationValue = ANIMATION_DURATION[duration];
  const easingValue = ANIMATION_EASING[easing];
  const propertiesString = properties.join(', ');
  
  return `transition: ${propertiesString} ${durationValue} ${easingValue};`;
}

/**
 * Utility function to create hover effects
 */
export function createHoverEffect(
  transform: string,
  duration: keyof typeof ANIMATION_DURATION = 'normal'
): string {
  const durationValue = ANIMATION_DURATION[duration];
  
  return `
    transition: transform ${durationValue} ease;
    &:hover {
      transform: ${transform};
    }
  `;
}

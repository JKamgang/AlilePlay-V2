import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge basic class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes using clsx', () => {
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
  });

  it('should resolve tailwind class conflicts using twMerge', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    expect(cn('text-sm text-center', 'text-lg')).toBe('text-center text-lg');
  });

  it('should handle edge cases and falsy values', () => {
    expect(cn('class1', undefined, null, false, '', 'class2')).toBe('class1 class2');
  });

  it('should handle arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('should handle complex mixed inputs', () => {
    expect(
      cn(
        'base-class',
        true && 'truthy-class',
        false && 'falsy-class',
        { 'conditional-class': true, 'ignored-class': false },
        ['array-class1', 'array-class2'],
        'px-2',
        'px-4 bg-red-500'
      )
    ).toBe('base-class truthy-class conditional-class array-class1 array-class2 px-4 bg-red-500');
  });
});

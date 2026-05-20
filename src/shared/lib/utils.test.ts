import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn('class1', isTrue && 'class2', isFalse && 'class3')).toBe('class1 class2');
  });

  it('resolves tailwind conflicts', () => {
    // tailwind-merge should resolve these conflicts
    expect(cn('p-2 p-4')).toBe('p-4');
    expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-red-500 hover:bg-blue-500 bg-green-500')).toBe('hover:bg-blue-500 bg-green-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('handles falsy values gracefully', () => {
    expect(cn('class1', null, undefined, 0, false, '', 'class2')).toBe('class1 class2');
  });

  it('handles complex combinations', () => {
    expect(cn(
      'base-class',
      ['array-class1', 'array-class2'],
      {
        'object-class1': true,
        'object-class2': false,
      },
      'text-sm text-lg' // conflict
    )).toBe('base-class array-class1 array-class2 object-class1 text-lg');
  });
});

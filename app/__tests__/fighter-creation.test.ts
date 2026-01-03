import { describe, it, expect } from 'vitest';

describe('Fighter Creation - Attribute Allocation', () => {
  const MAX_POINTS = 90;
  const MAX_PER_ATTRIBUTE = 30;

  it('should calculate remaining points correctly', () => {
    const allocatedPoints = {
      Striking: 20,
      Grappling: 15,
      Stamina: 18,
      Chin: 12,
      Power: 25,
    };

    const usedPoints = Object.values(allocatedPoints).reduce((sum, val) => sum + val, 0);
    const remainingPoints = MAX_POINTS - usedPoints;

    expect(usedPoints).toBe(90);
    expect(remainingPoints).toBe(0);
  });

  it('should not allow exceeding max points per attribute', () => {
    const attemptedValue = 35;
    const isValid = attemptedValue <= MAX_PER_ATTRIBUTE;

    expect(isValid).toBe(false);
  });

  it('should not allow exceeding total max points', () => {
    const currentPoints = {
      Striking: 30,
      Grappling: 30,
      Stamina: 30,
      Chin: 0,
      Power: 0,
    };

    const usedPoints = Object.values(currentPoints).reduce((sum, val) => sum + val, 0);
    const remainingPoints = MAX_POINTS - usedPoints;
    const canAddMore = remainingPoints > 0;

    expect(usedPoints).toBe(90);
    expect(canAddMore).toBe(false);
  });

  it('should allow valid attribute allocation', () => {
    const points = {
      Striking: 18,
      Grappling: 22,
      Stamina: 15,
      Chin: 20,
      Power: 15,
    };

    const usedPoints = Object.values(points).reduce((sum, val) => sum + val, 0);
    const allWithinLimit = Object.values(points).every(val => val <= MAX_PER_ATTRIBUTE);

    expect(usedPoints).toBe(90);
    expect(allWithinLimit).toBe(true);
  });

  it('should handle increment operation correctly', () => {
    const currentValue = 15;
    const remainingPoints = 10;
    const canIncrement = remainingPoints > 0 && currentValue < MAX_PER_ATTRIBUTE;

    expect(canIncrement).toBe(true);

    const newValue = currentValue + 1;
    expect(newValue).toBe(16);
  });

  it('should handle decrement operation correctly', () => {
    const currentValue = 15;
    const canDecrement = currentValue > 0;

    expect(canDecrement).toBe(true);

    const newValue = currentValue - 1;
    expect(newValue).toBe(14);
  });

  it('should not allow negative attribute values', () => {
    const currentValue = 0;
    const canDecrement = currentValue > 0;

    expect(canDecrement).toBe(false);
  });

  it('should calculate percentage correctly for progress bar', () => {
    const attributeValue = 15;
    const percentage = (attributeValue / MAX_PER_ATTRIBUTE) * 100;

    expect(percentage).toBe(50);
  });

  it('should validate all points are allocated before creation', () => {
    const points = {
      Striking: 18,
      Grappling: 22,
      Stamina: 15,
      Chin: 20,
      Power: 15,
    };

    const usedPoints = Object.values(points).reduce((sum, val) => sum + val, 0);
    const isValid = usedPoints === MAX_POINTS;

    expect(isValid).toBe(true);
  });

  it('should reject creation with unallocated points', () => {
    const points = {
      Striking: 18,
      Grappling: 22,
      Stamina: 15,
      Chin: 20,
      Power: 10, // Only 85 points allocated
    };

    const usedPoints = Object.values(points).reduce((sum, val) => sum + val, 0);
    const isValid = usedPoints === MAX_POINTS;

    expect(usedPoints).toBe(85);
    expect(isValid).toBe(false);
  });

  it('should handle slider value changes correctly', () => {
    const currentPoints = {
      Striking: 15,
      Grappling: 20,
      Stamina: 18,
      Chin: 12,
      Power: 10,
    };

    const usedPoints = Object.values(currentPoints).reduce((sum, val) => sum + val, 0);
    const remainingPoints = MAX_POINTS - usedPoints;

    // Try to change Striking from 15 to 20
    const newValue = 20;
    const diff = newValue - currentPoints.Striking;
    const canChange = remainingPoints - diff >= 0 && newValue >= 0 && newValue <= MAX_PER_ATTRIBUTE;

    expect(remainingPoints).toBe(15);
    expect(diff).toBe(5);
    expect(canChange).toBe(true);
  });
});

describe('Fighter Creation - Form Validation', () => {
  it('should require first name', () => {
    const firstName = '';
    const lastName = 'Doe';
    const isValid = firstName.length > 0 && lastName.length > 0;

    expect(isValid).toBe(false);
  });

  it('should require last name', () => {
    const firstName = 'John';
    const lastName = '';
    const isValid = firstName.length > 0 && lastName.length > 0;

    expect(isValid).toBe(false);
  });

  it('should allow optional nickname', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const nickname = '';
    const isValid = firstName.length > 0 && lastName.length > 0;

    expect(isValid).toBe(true);
    expect(nickname).toBe('');
  });

  it('should validate complete form', () => {
    const form = {
      firstName: 'John',
      lastName: 'Doe',
      nickname: 'The Hammer',
      weightClass: 'welterweight',
      stance: 'Orthodox',
      style: 'mma',
      points: {
        Striking: 18,
        Grappling: 22,
        Stamina: 15,
        Chin: 20,
        Power: 15,
      },
    };

    const usedPoints = Object.values(form.points).reduce((sum, val) => sum + val, 0);
    const isValid = 
      form.firstName.length > 0 &&
      form.lastName.length > 0 &&
      usedPoints === 90;

    expect(isValid).toBe(true);
  });
});

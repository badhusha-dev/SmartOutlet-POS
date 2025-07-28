import { Discount } from '../types/pos';

export const applyDiscount = (subtotal: number, type: 'PERCENT' | 'FIXED', value: number): number => {
  if (type === 'PERCENT') {
    return subtotal * (1 - value / 100);
  } else {
    return Math.max(0, subtotal - value);
  }
};

export const validateDiscount = (discount: Discount, subtotal: number): { isValid: boolean; error?: string } => {
  // Check if discount is active
  if (!discount.isActive) {
    return { isValid: false, error: 'Coupon EXPIRED' };
  }

  // Check if discount has expired
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return { isValid: false, error: 'Coupon EXPIRED' };
  }

  // Check minimum order amount
  if (discount.minOrderAmount && subtotal < discount.minOrderAmount) {
    return { 
      isValid: false, 
      error: `Minimum order amount: $${discount.minOrderAmount}` 
    };
  }

  // Check maximum uses
  if (discount.maxUses && discount.usedCount >= discount.maxUses) {
    return { isValid: false, error: 'Coupon usage limit reached' };
  }

  return { isValid: true };
};

export const calculateDiscountAmount = (subtotal: number, discount: Discount): number => {
  if (discount.type === 'PERCENT') {
    return subtotal * (discount.value / 100);
  } else {
    return Math.min(discount.value, subtotal);
  }
};

export const formatDiscountCode = (code: string): string => {
  return code.toUpperCase().replace(/\s+/g, '');
};
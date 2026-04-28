import { WARRANTY_STATUS, EXPIRING_SOON_DAYS } from '../config/constants.js';

export const calculateWarrantyStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  
  if (today > expiry) {
    return WARRANTY_STATUS.EXPIRED;
  }

  const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysRemaining <= EXPIRING_SOON_DAYS && daysRemaining > 0) {
    return WARRANTY_STATUS.EXPIRING_SOON;
  }

  return WARRANTY_STATUS.ACTIVE;
};

export const calculateExpiryDate = (purchaseDate, warrantyPeriodMonths) => {
  const expiry = new Date(purchaseDate);
  expiry.setMonth(expiry.getMonth() + warrantyPeriodMonths);
  return expiry;
};

export const calculateDaysRemaining = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return daysRemaining > 0 ? daysRemaining : 0;
};

export const isWarrantyActive = (expiryDate) => {
  return new Date() < new Date(expiryDate);
};

export const isExpiringsSoon = (expiryDate) => {
  const daysRemaining = calculateDaysRemaining(expiryDate);
  return daysRemaining <= EXPIRING_SOON_DAYS && daysRemaining > 0;
};

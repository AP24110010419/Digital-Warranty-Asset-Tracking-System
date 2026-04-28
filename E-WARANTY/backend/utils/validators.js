export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateProductData = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Product name is required';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (!data.purchaseDate) {
    errors.purchaseDate = 'Purchase date is required';
  }

  if (data.purchasePrice === undefined || data.purchasePrice === null) {
    errors.purchasePrice = 'Purchase price is required';
  }

  if (!data.warrantyPeriod || data.warrantyPeriod < 1) {
    errors.warrantyPeriod = 'Warranty period must be at least 1 month';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateMaintenanceData = (data) => {
  const errors = {};

  if (!data.type) {
    errors.type = 'Maintenance type is required';
  }

  if (!data.date) {
    errors.date = 'Date is required';
  }

  if (!data.description || data.description.trim() === '') {
    errors.description = 'Description is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

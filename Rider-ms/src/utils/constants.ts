export const isValidNigerianPhone = (phone) => {
    // Check if it starts with +234 and followed by 10 digits
    const phoneRegex = /^\+234[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
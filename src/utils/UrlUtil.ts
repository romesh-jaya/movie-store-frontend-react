export const isValidUrl = (uRLToValidate?: string): boolean => {
  if (!uRLToValidate) {
    return false;
  }

  try {
    const url = new URL(uRLToValidate);
    return !!url;
  } catch (_) {
    return false;
  }
};

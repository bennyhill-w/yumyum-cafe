/**
 * Formats a number as Nigerian Naira
 * @param {number} amount
 * @returns {string} e.g. ₦3,500
 */
export function formatCurrency(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number as a plain string with commas
 * @param {number} amount
 * @returns {string} e.g. 3,500
 */
export function formatNumber(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0";
  return new Intl.NumberFormat("en-NG").format(amount);
}

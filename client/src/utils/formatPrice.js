export default function formatPrice(price) {
  return `$${Number(price || 0).toLocaleString()}`;
}

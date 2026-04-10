function PriceTag({ value }) {
  return <span className="font-bold">${Number(value || 0).toLocaleString()}</span>;
}

export default PriceTag;

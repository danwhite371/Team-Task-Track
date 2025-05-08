function formatDatetime(value: string | undefined): string | undefined {
  if (value == undefined) return;
  const date = new Date(Number(value));
  return date.toLocaleString();
}

const nullToZero = (value: number | undefined | null) =>
  value == null ? 0 : value;

export { formatDatetime, nullToZero };

export function downloadCodesCSV(
  codes: string[],
  productName: string,
  txId: string,
) {
  const rows = [
    "#,Código",
    ...codes.map((code, index) => `${index + 1},${code}`),
  ].join("\n");

  const blob = new Blob([rows], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `codigos-${productName.replace(/\s+/g, "-")}-${txId}.csv`;

  link.click();

  URL.revokeObjectURL(url);
}

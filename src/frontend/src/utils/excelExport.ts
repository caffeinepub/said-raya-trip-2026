import type { FamilyRaya } from '../backend';

function escapeCSV(value: string | number): string {
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function createCSVContent(headers: string[], rows: (string | number)[][]): string {
  const headerRow = headers.map(escapeCSV).join(',');
  const dataRows = rows.map(row => row.map(escapeCSV).join(',')).join('\n');
  return `${headerRow}\n${dataRows}`;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(families: FamilyRaya[]) {
  // Calculate summary statistics
  const totalOrang = families.reduce((sum, family) => sum + family.members.length, 0);
  const totalKeluarga = families.length;
  const uniqueFoods = new Set(families.map((f) => f.platter));
  const totalJenisMakanan = uniqueFoods.size;

  let keluargaPalingRamai = '';
  let maxMembers = 0;
  families.forEach((family) => {
    if (family.members.length > maxMembers) {
      maxMembers = family.members.length;
      keluargaPalingRamai = `${family.familyName} (${family.members.length} orang)`;
    }
  });

  // Sheet 1: Raw Data
  const rawDataHeaders = ['Nama Keluarga', 'Nama Ahli', 'Makanan'];
  const rawDataRows: (string | number)[][] = [];
  families.forEach((family) => {
    family.members.forEach((member) => {
      rawDataRows.push([family.familyName, member, family.platter]);
    });
  });

  // Sheet 2: Summary
  const summaryHeaders = ['Statistik', 'Nilai'];
  const summaryRows: (string | number)[][] = [
    ['Total Orang', totalOrang],
    ['Total Keluarga', totalKeluarga],
    ['Total Jenis Makanan', totalJenisMakanan],
    ['Keluarga Paling Ramai', keluargaPalingRamai],
  ];

  // Sheet 3: Makanan Breakdown
  const foodCount = new Map<string, number>();
  families.forEach((family) => {
    foodCount.set(family.platter, (foodCount.get(family.platter) || 0) + 1);
  });

  const makananHeaders = ['Makanan', 'Bilangan Keluarga Membawa'];
  const makananRows: (string | number)[][] = Array.from(foodCount.entries()).map(([makanan, count]) => [
    makanan,
    count,
  ]);

  // Create combined CSV content with sections
  const sections = [
    '=== RAW DATA ===',
    createCSVContent(rawDataHeaders, rawDataRows),
    '',
    '=== SUMMARY ===',
    createCSVContent(summaryHeaders, summaryRows),
    '',
    '=== MAKANAN BREAKDOWN ===',
    createCSVContent(makananHeaders, makananRows),
  ];

  const fullContent = sections.join('\n');

  // Download as CSV file
  downloadFile(
    fullContent,
    'SAID_Raya_Trip_2026_Full_Report.csv',
    'text/csv;charset=utf-8;'
  );
}

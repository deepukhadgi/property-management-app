const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('YSMR Departure Cleaning (1).xlsx');
  
  for (const sheet of ['Database', 'Extra cleaning', 'Irregular Checkouts', '2024']) {
      if (!workbook.Sheets[sheet]) continue;
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });
      console.log(`\n--- First 3 rows of ${sheet} ---`);
      console.log(JSON.stringify(data.slice(0, 3), null, 2));
  }
} catch (e) {
  console.error(e);
}

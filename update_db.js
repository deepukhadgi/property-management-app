const XLSX = require('xlsx');
const fs = require('fs');

try {
    const workbook = XLSX.readFile('YSMR Departure Cleaning (1).xlsx');
    const dbSheet = workbook.Sheets['Database'];
    if (!dbSheet) {
        console.error("Database sheet not found.");
        process.exit(1);
    }

    const resData = XLSX.utils.sheet_to_json(dbSheet);
    
    // Exact mapping from components/ExcelUploader.tsx
    const newResidents = resData.map(row => ({
        reservationNumber: String(row['Reservation Number'] || ''),
        roomNumber: String(row.RoomNo || ''),
        firstName: String(row.FirstName || ''),
        lastName: String(row.LastName || ''),
        fullName: String(row.FullName || `${row.FirstName} ${row.LastName}`)
    })).filter(r => r.reservationNumber && r.roomNumber);

    console.log(`Parsed ${newResidents.length} valid residents from Excel.`);

    const contextPath = 'src/context/AppDataContext.tsx';
    let code = fs.readFileSync(contextPath, 'utf-8');
    
    // Format the array into a valid JS layout
    const residentsStr = JSON.stringify(newResidents, null, 2)
        .replace(/"([^"]+)":/g, '$1:') // Remove quotes around keys
        .replace(/"/g, "'");           // Use single quotes for strings to match project style
    
    // Regex replace the initialResidents array completely
    const regex = /(const initialResidents: Resident\[\] = )\[[\s\S]*?\];/;
    if (regex.test(code)) {
        code = code.replace(regex, `$1${residentsStr};`);
        fs.writeFileSync(contextPath, code);
        console.log("Successfully updated src/context/AppDataContext.tsx");
    } else {
        console.error("Could not find initialResidents array in AppDataContext.tsx");
        process.exit(1);
    }

} catch (e) {
    console.error(e);
    process.exit(1);
}

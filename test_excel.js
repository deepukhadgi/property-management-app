const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');

try {
  const workbook = XLSX.readFile('YSMR Departure Cleaning (1).xlsx');
  console.log("Sheet names:", workbook.SheetNames);

  // Parse Database
  if (workbook.SheetNames.includes('Database')) {
    const resData = XLSX.utils.sheet_to_json(workbook.Sheets['Database']);
    const newResidents = resData.map(row => ({
      reservationNumber: String(row['Reservation Number'] || ''),
      roomNumber: String(row.RoomNo || ''),
      firstName: String(row.FirstName || ''),
      lastName: String(row.LastName || ''),
      fullName: String(row.FullName || `${row.FirstName} ${row.LastName}`)
    })).filter(r => r.reservationNumber && r.roomNumber && r.reservationNumber !== 'undefined');
    console.log("Database valid rows:", newResidents.length);
  } else {
    console.log("No Database sheet!");
  }

  // Parse Extra cleaning
  if (workbook.SheetNames.includes('Extra cleaning')) {
    const extraData = XLSX.utils.sheet_to_json(workbook.Sheets['Extra cleaning']);
    const newExtra = extraData.map(row => ({
      id: uuidv4(),
      dateLogged: String(row.Date || ''),
      roomNumber: String(row['Room No.'] || ''),
      chargeAmount: parseFloat(row.Charge) || 0,
      notes: String(row.Notes || `For resident: ${row['Full Name']}`)
    })).filter(x => x.roomNumber && x.roomNumber !== 'undefined');
    console.log("Extra cleaning valid rows:", newExtra.length);
  } else {
    console.log("No Extra cleaning sheet found.");
  }

  // Irregular
  const irregSheet = workbook.SheetNames.find(n => n.includes('Irregular Checkouts'));
  if (irregSheet) {
    const irregData = XLSX.utils.sheet_to_json(workbook.Sheets[irregSheet]);
    const newIrreg = irregData.map(row => ({
      id: uuidv4(),
      month: String(row.Month || ''),
      reservationNumber: String(row['Reservation Number'] || ''),
      fullName: String(row['Full Name'] || ''),
      roomNumber: String(row['Room No.'] || ''),
      status: row.Status || 'Lease Abandonment',
      arrearsAmount: parseFloat(row['Arrears Amount']) || 0,
      outstandingFees: parseFloat(row['Outstanding Fees']) || 0
    })).filter(x => x.reservationNumber && x.reservationNumber !== 'undefined');
    console.log("Irregular Checkout valid rows:", newIrreg.length);
  } else {
    console.log("No Irregular checkout sheet.");
  }

  // Departures
  const departureSheets = workbook.SheetNames.filter(name => /202\d|March 2026/.test(name) && !name.includes('Irregular'));
  let allDepartures = [];
  for (const sheetName of departureSheets) {
    const depData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const mapped = depData.map(row => ({
      departureId: uuidv4(),
      reservationNumber: String(row['Reservation Number'] || ''),
      roomType: String(row['Room Type'] || 'Studio'),
      departDate: String(row.Date || new Date().toISOString().split('T')[0]),
      inspectedDate: null,
      originalBond: 1000,
      irregularCheckoutArrears: 0,
      fmObservations: '',
      cleanStatus: row['Clean status'] || 'Pending',
      repairStatus: row['Repair status'] || 'Pending'
    })).filter(x => x.reservationNumber && x.reservationNumber !== 'undefined' && x.reservationNumber !== '');
    allDepartures = [...allDepartures, ...mapped];
  }
  console.log("Departures valid rows:", allDepartures.length);
} catch (e) {
  console.error("DEBUG SCRIPT EXCEPTION:");
  console.error(e);
}

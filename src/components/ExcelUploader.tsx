import { useState, useRef, ChangeEvent } from 'react';
import { useAppContext } from '../context/AppDataContext';
import { UploadCloud, Check, AlertCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { PriceListItem, Resident, Departure, IrregularCheckout, ExtraCleaningCharge } from '../types';

export default function ExcelUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { 
    setPriceList, setResidents, setDepartures, 
    setIrregularCheckouts, setExtraCleaningCharges 
  } = useAppContext();

  const parseExcel = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('parsing');
    setErrorMsg('');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // PARSE PRICE LIST
      if (workbook.SheetNames.includes('Price list')) {
         const priceData = XLSX.utils.sheet_to_json<any>(workbook.Sheets['Price list']);
         const newPriceList: PriceListItem[] = priceData.map((row: any) => ({
           id: uuidv4(),
           itemCode: String(row.ItemCode || ''),
           area: String(row.Area || 'General'),
           damageDescription: String(row.DamageDescription || ''),
           cost: parseFloat(row.Cost) || 0
         })).filter(item => item.itemCode && item.damageDescription);
         if (newPriceList.length > 0) setPriceList(newPriceList);
      }

      // HELPER: Auto-detect header row based on known column names
      const parseOffset = (sheet: any) => {
        const raw = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
        let headerRowIdx = 0;
        for (let i = 0; i < Math.min(20, raw.length); i++) {
          const r = raw[i] || [];
          if (r.some((v: any) => typeof v === 'string' && (v.includes('Res #') || v.includes('Reservation Number') || v.includes('Accolade') || v.includes('Extra Charge')))) {
            headerRowIdx = i; break;
          }
        }
        return XLSX.utils.sheet_to_json<any>(sheet, { range: headerRowIdx });
      };

      // PARSE RESIDENTS DATABASE
      if (workbook.SheetNames.includes('Database')) {
        const resData = parseOffset(workbook.Sheets['Database']);
        const newResidents: Resident[] = resData.map((row: any) => ({
          reservationNumber: String(row['Res #'] || row['Reservation Number'] || ''),
          roomNumber: String(row['Room'] || row.RoomNo || ''),
          firstName: String(row['First Name'] || row.FirstName || ''),
          lastName: String(row['Last Name'] || row.LastName || ''),
          fullName: String(row['Full Name'] || row.FullName || `${row['First Name'] || ''} ${row['Last Name'] || ''}`)
        })).filter((r: any) => r.reservationNumber && r.reservationNumber !== 'undefined' && r.roomNumber);
        if (newResidents.length > 0) setResidents(newResidents);
      }

      // PARSE EXTRA CLEANING
      if (workbook.SheetNames.includes('Extra cleaning')) {
        const extraData = parseOffset(workbook.Sheets['Extra cleaning']);
        const newExtra: ExtraCleaningCharge[] = extraData.map((row: any) => ({
          id: uuidv4(),
          dateLogged: String(row.Date || new Date().toISOString().split('T')[0]),
          roomNumber: String(row.Accolade || row['Room No.'] || ''),
          chargeAmount: parseFloat(row['Extra Charge'] || row.Charge) || 0,
          notes: String(row.Notes || `Extra cleaning charge mapped automatically`)
        })).filter((x: any) => x.roomNumber && x.roomNumber !== 'undefined');
        if (newExtra.length > 0) setExtraCleaningCharges(newExtra);
      }

      // PARSE IRREGULAR CHECKOUTS
      const irregSheet = workbook.SheetNames.find((n: string) => n.includes('Irregular Checkouts'));
      if (irregSheet) {
        const irregData = parseOffset(workbook.Sheets[irregSheet]);
        const newIrreg: IrregularCheckout[] = irregData.map((row: any) => ({
          id: uuidv4(),
          month: String(row.Month || ''),
          reservationNumber: String(row['Res #'] || row['Reservation Number'] || ''),
          fullName: String(row['Full Name'] || ''),
          roomNumber: String(row['Room'] || row['Room No.'] || ''),
          status: (row.Status) || 'Lease Abandonment',
          arrearsAmount: parseFloat(row['Arrears Amount']) || 0,
          outstandingFees: parseFloat(row['Outstanding Fees']) || 0
        })).filter((x: any) => x.reservationNumber && x.reservationNumber !== 'undefined');
        if (newIrreg.length > 0) setIrregularCheckouts(newIrreg);
      }

      // PARSE DEPARTURES
      const departureSheets = workbook.SheetNames.filter((name: string) => /202\d|March 2026/.test(name) && !name.includes('Irregular'));
      let allDepartures: Departure[] = [];
      for (const sheetName of departureSheets) {
        const depData = parseOffset(workbook.Sheets[sheetName]);
        const mapped = depData.map((row: any) => ({
          departureId: uuidv4(),
          reservationNumber: String(row['Res #'] || row['Reservation Number'] || ''),
          roomType: String(row['Room Type'] || 'Studio'),
          departDate: String(row['Inspection Date'] || row.Date || new Date().toISOString().split('T')[0]),
          inspectedDate: null,
          originalBond: 1000,
          irregularCheckoutArrears: 0,
          fmObservations: '',
          cleanStatus: (row['Clean status'] || 'Pending') as any,
          repairStatus: (row['Repair status'] || 'Pending') as any
        })).filter((x: any) => x.reservationNumber && x.reservationNumber !== 'undefined');
        allDepartures = [...allDepartures, ...mapped];
      }
      if (allDepartures.length > 0) setDepartures(allDepartures);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Failed to parse Excel file. Ensure it is a valid .xlsx file.');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-800">Import Data</h3>
        <p className="text-sm text-gray-500">Upload your YSMR Departure Cleaning Excel file to populate the application databases instantly.</p>
      </div>

      <input 
        type="file" 
        accept=".xlsx, .xls" 
        ref={fileInputRef} 
        onChange={parseExcel} 
        className="hidden" 
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        disabled={status === 'parsing'}
        className={`relative flex items-center justify-center w-full max-w-md py-4 rounded-xl border-2 border-dashed transition-all duration-200 ${
          status === 'parsing' ? 'bg-gray-50 border-gray-300 cursor-not-allowed' :
          isHovering ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-blue-400 text-gray-600'
        }`}
      >
        {status === 'idle' && (
          <>
            <UploadCloud className={`w-6 h-6 mr-3 ${isHovering ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="font-medium">Click to upload Excel File</span>
          </>
        )}
        {status === 'parsing' && (
          <>
            <Loader2 className="w-6 h-6 mr-3 text-blue-500 animate-spin" />
            <span className="font-medium text-blue-700">Parsing workbook...</span>
          </>
        )}
        {status === 'success' && (
          <>
            <Check className="w-6 h-6 mr-3 text-emerald-500" />
            <span className="font-medium text-emerald-700">Import Successful!</span>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-6 h-6 mr-3 text-red-500" />
            <span className="font-medium text-red-700">{errorMsg}</span>
          </>
        )}
      </button>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppDataContext';
import { ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function InspectionForm() {
  const { departureId } = useParams<{ departureId: string }>();
  const navigate = useNavigate();
  const { departures, residents, damageCharges, priceList, addDamageCharge, removeDamageCharge, updateDeparture } = useAppContext();

  const departure = useMemo(() => departures.find(d => d.departureId === departureId), [departures, departureId]);
  const resident = useMemo(() => departure ? residents.find(r => r.reservationNumber === departure.reservationNumber) : null, [residents, departure]);
  
  const departureCharges = useMemo(() => damageCharges.filter(c => c.departureId === departureId), [damageCharges, departureId]);

  const [obsText, setObsText] = useState(departure?.fmObservations || '');
  const [selectedPriceId, setSelectedPriceId] = useState('');
  const [rectNote, setRectNote] = useState('');

  if (!departure || !resident) {
    return <div className="p-6">Departure not found.</div>;
  }

  const fmCost = departureCharges.reduce((acc, charge) => {
    const item = priceList.find(p => p.id === charge.priceListItemId);
    if (!item) return acc;
    return acc + (charge.costOverride !== undefined ? charge.costOverride : item.cost);
  }, 0);

  const bondToRefund = Math.max(0, departure.originalBond - fmCost - departure.irregularCheckoutArrears);

  const handleAddDamage = () => {
    if (!selectedPriceId) return;
    addDamageCharge({
      chargeId: uuidv4(),
      departureId: departure.departureId,
      priceListItemId: selectedPriceId,
      rectificationNote: rectNote,
    });
    setSelectedPriceId('');
    setRectNote('');
  };

  const handleSave = () => {
    updateDeparture({
      ...departure,
      fmObservations: obsText,
      inspectedDate: new Date().toISOString(),
      cleanStatus: 'Needs Cleaning',
    });
    alert('Inspection saved successfully!');
    navigate('/departures');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspection & Checkout</h1>
          <p className="text-gray-500 mt-1">Room {resident.roomNumber} - {resident.fullName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Resident Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Reservation:</span><span className="font-medium text-gray-900">{departure.reservationNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Room Type:</span><span className="font-medium text-gray-900">{departure.roomType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Depart Date:</span><span className="font-medium text-gray-900">{new Date(departure.departDate).toLocaleDateString()}</span></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 bg-gradient-to-br from-blue-50 to-white">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-blue-100">Financial Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Original Bond:</span><span className="font-medium text-gray-900">${departure.originalBond.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Arrears:</span><span className="font-medium text-red-600">-${departure.irregularCheckoutArrears.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Damage Costs (FM):</span><span className="font-medium text-red-600">-${fmCost.toFixed(2)}</span></div>
              <div className="pt-3 mt-3 border-t border-blue-100 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Refund:</span>
                <span className="text-xl font-bold text-green-600">${bondToRefund.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Damage Charges</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Damage Item</label>
                  <select 
                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border bg-white"
                    value={selectedPriceId}
                    onChange={(e) => setSelectedPriceId(e.target.value)}
                  >
                    <option value="">-- Select Item --</option>
                    {priceList.map(item => (
                      <option key={item.id} value={item.id}>{item.itemCode} - {item.damageDescription} (${item.cost})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rectification Note (Optional)</label>
                  <input 
                    type="text"
                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                    placeholder="e.g. Scratches on left side"
                    value={rectNote}
                    onChange={(e) => setRectNote(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleAddDamage}
                  disabled={!selectedPriceId}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Charge
                </button>
              </div>
            </div>

            {departureCharges.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No damages recorded yet.</div>
            ) : (
              <div className="space-y-3">
                {departureCharges.map(charge => {
                  const item = priceList.find(p => p.id === charge.priceListItemId);
                  if (!item) return null;
                  return (
                    <div key={charge.chargeId} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:border-red-100 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.damageDescription}</p>
                        <p className="text-xs text-gray-500">{charge.rectificationNote || 'No notes'}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-red-600">${item.cost.toFixed(2)}</span>
                        <button 
                          onClick={() => removeDamageCharge(charge.chargeId)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">FM Observations</h3>
            <textarea 
              className="w-full border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 text-sm min-h-[120px] border outline-none"
              placeholder="Record any general observations about the room's condition..."
              value={obsText}
              onChange={(e) => setObsText(e.target.value)}
            />
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSave}
                className="flex items-center px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Inspection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

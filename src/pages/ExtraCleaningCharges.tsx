import { useState, FormEvent } from 'react';
import { useAppContext } from '../context/AppDataContext';
import { Sparkles, Plus } from 'lucide-react';
import { ExtraCleaningCharge } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function ExtraCleaningCharges() {
  const { extraCleaningCharges, addExtraCleaningCharge } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<ExtraCleaningCharge>>({
    roomNumber: '',
    chargeAmount: 50,
    notes: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.roomNumber) return;
    
    addExtraCleaningCharge({
      id: uuidv4(),
      dateLogged: new Date().toISOString().split('T')[0],
      roomNumber: formData.roomNumber,
      chargeAmount: Number(formData.chargeAmount),
      notes: formData.notes
    });
    
    setFormData({
      roomNumber: '',
      chargeAmount: 50,
      notes: ''
    });
  };

  const totalCharges = extraCleaningCharges.reduce((acc, curr) => acc + curr.chargeAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Extra Cleaning Charges</h1>
        <p className="text-gray-500 mt-1">Log ad-hoc cleaning fees separating from standard catalog damages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Extra Fees Logged</p>
                <p className="text-2xl font-bold text-gray-900">${totalCharges.toFixed(2)}</p>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-4 border-t pt-5">Log New Charge</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room No.</label>
                <input type="text" required value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 101A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extra Charge ($)</label>
                <div className="flex space-x-2 mb-2">
                  {[50, 100, 200].map(amount => (
                    <button type="button" key={amount} onClick={() => setFormData({...formData, chargeAmount: amount})} className={`flex-1 py-1.5 font-medium text-sm border rounded ${formData.chargeAmount === amount ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600'}`}>${amount}</button>
                  ))}
                </div>
                <input type="number" step="0.01" value={formData.chargeAmount} onChange={e => setFormData({...formData, chargeAmount: Number(e.target.value)})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea rows={2} value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Reason for extreme cleaning..." />
              </div>
              <button type="submit" className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5 mr-2" />
                Save Charge
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-700">Recent Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-sm font-semibold text-gray-600">
                    <th className="p-4 w-32">Date Logged</th>
                    <th className="p-4 w-28">Room</th>
                    <th className="p-4 w-28">Amount</th>
                    <th className="p-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {extraCleaningCharges.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 bg-gray-50/50">
                        No extra cleaning charges logged yet.
                      </td>
                    </tr>
                  ) : (
                    [...extraCleaningCharges].reverse().map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-500">{record.dateLogged}</td>
                        <td className="p-4 text-sm font-medium text-gray-900">{record.roomNumber}</td>
                        <td className="p-4 text-sm font-medium text-red-600">${record.chargeAmount.toFixed(2)}</td>
                        <td className="p-4 text-sm text-gray-600">{record.notes || <span className="text-gray-400 italic">No notes</span>}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

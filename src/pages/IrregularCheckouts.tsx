import { useState, useMemo, FormEvent } from 'react';
import { useAppContext } from '../context/AppDataContext';
import { AlertTriangle, ArrowRightLeft, HelpCircle, Plus } from 'lucide-react';
import { IrregularCheckout, IrregularStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function IrregularCheckouts() {
  const { irregularCheckouts, addIrregularCheckout } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState<Partial<IrregularCheckout>>({
    month: new Date().toLocaleString('default', { month: 'short' }),
    status: 'Lease Abandonment',
    arrearsAmount: 0,
    outstandingFees: 0,
  });

  const stats = useMemo(() => {
    return {
      abandonments: irregularCheckouts.filter(c => c.status === 'Lease Abandonment').length,
      transfers: irregularCheckouts.filter(c => c.status === 'Lease Transfer').length,
      special: irregularCheckouts.filter(c => c.status === 'Special Consideration').length,
    };
  }, [irregularCheckouts]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.reservationNumber || !formData.fullName || !formData.roomNumber) return;
    
    addIrregularCheckout({
      id: uuidv4(),
      month: formData.month || '',
      reservationNumber: formData.reservationNumber,
      fullName: formData.fullName,
      roomNumber: formData.roomNumber,
      status: formData.status as IrregularStatus,
      arrearsAmount: Number(formData.arrearsAmount),
      outstandingFees: Number(formData.outstandingFees)
    });
    
    setShowAddForm(false);
    setFormData({
      month: new Date().toLocaleString('default', { month: 'short' }),
      status: 'Lease Abandonment',
      arrearsAmount: 0,
      outstandingFees: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Irregular Checkouts</h1>
          <p className="text-gray-500 mt-1">Track lease abandonments, transfers, and special considerations.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Checkout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Abandonments</p>
            <p className="text-2xl font-bold text-gray-900">{stats.abandonments}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Lease Transfers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.transfers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Special Considerations</p>
            <p className="text-2xl font-bold text-gray-900">{stats.special}</p>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 transition-all">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Log New Irregular Checkout</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input type="text" required value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Res #</label>
              <input type="text" required value={formData.reservationNumber} onChange={e => setFormData({...formData, reservationNumber: e.target.value})} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room No.</label>
              <input type="text" required value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as IrregularStatus})} className="w-full border border-gray-300 rounded-md p-2">
                <option>Lease Abandonment</option>
                <option>Lease Transfer</option>
                <option>Special Consideration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrears ($)</label>
              <input type="number" step="0.01" value={formData.arrearsAmount} onChange={e => setFormData({...formData, arrearsAmount: Number(e.target.value)})} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outstanding Fees ($)</label>
              <input type="number" step="0.01" value={formData.outstandingFees} onChange={e => setFormData({...formData, outstandingFees: Number(e.target.value)})} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div className="lg:col-span-4 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Record</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <th className="p-4">Month</th>
                <th className="p-4">Res #</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Room No.</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Arrears</th>
                <th className="p-4 text-right">Outstanding Fees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {irregularCheckouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No irregular checkouts logged yet.
                  </td>
                </tr>
              ) : (
                irregularCheckouts.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-900">{record.month}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{record.reservationNumber}</td>
                    <td className="p-4 text-sm text-gray-600">{record.fullName}</td>
                    <td className="p-4 text-sm text-gray-900">{record.roomNumber}</td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${record.status === 'Lease Abandonment' ? 'bg-red-100 text-red-800' : 
                          record.status === 'Lease Transfer' ? 'bg-blue-100 text-blue-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-right text-gray-900">${record.arrearsAmount.toFixed(2)}</td>
                    <td className="p-4 text-sm text-right text-gray-900">${record.outstandingFees.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppDataContext';
import { Eye, Filter, Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Departure } from '../types';

export default function Departures() {
  const { departures, residents, updateDeparture, addDeparture, role } = useAppContext();
  const navigate = useNavigate();

  const [filterYear, setFilterYear] = useState<string>('All');
  const [filterMonth, setFilterMonth] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [isAddingCheckout, setIsAddingCheckout] = useState(false);
  const [newCheckoutRes, setNewCheckoutRes] = useState('');
  const [newCheckoutDate, setNewCheckoutDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckoutRes) return;
    
    const res = residents.find(r => r.reservationNumber === newCheckoutRes);
    if (!res) return;

    const newDep: Departure = {
      departureId: uuidv4(),
      reservationNumber: res.reservationNumber,
      roomType: 'Studio',
      departDate: newCheckoutDate,
      inspectedDate: null,
      originalBond: 1000,
      irregularCheckoutArrears: 0,
      fmObservations: '',
      cleanStatus: 'Pending' as any,
      repairStatus: 'Pending' as any
    };

    addDeparture(newDep);
    setIsAddingCheckout(false);
    setNewCheckoutRes('');
  };

  const handleStatusChange = (departureId: string, field: 'cleanStatus' | 'repairStatus', value: string) => {
    const dep = departures.find(d => d.departureId === departureId);
    if (dep) {
      updateDeparture({ ...dep, [field]: value });
    }
  };

  const filteredDepartures = useMemo(() => {
    return departures.filter(dep => {
      const depDate = new Date(dep.departDate);
      const year = depDate.getFullYear().toString();
      const month = depDate.toLocaleString('default', { month: 'short' });

      if (filterYear !== 'All' && filterYear !== year) return false;
      if (filterMonth !== 'All' && filterMonth !== month) return false;
      if (filterStatus !== 'All' && filterStatus !== dep.cleanStatus) return false;

      return true;
    });
  }, [departures, filterYear, filterMonth, filterStatus]);

  const availableYears = useMemo(() => {
    const years = departures.map(d => new Date(d.departDate).getFullYear().toString());
    return ['All', ...Array.from(new Set(years)).sort()];
  }, [departures]);

  const availableMonths = useMemo(() => {
    const months = departures.map(d => new Date(d.departDate).toLocaleString('default', { month: 'short' }));
    return ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].filter(m => m === 'All' || Array.from(new Set(months)).includes(m));
  }, [departures]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Departures & Cleaning Schedule</h1>
            {role === 'Admin' && (
              <button 
                onClick={() => setIsAddingCheckout(true)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                New Checkout
              </button>
            )}
          </div>
          <p className="text-gray-500 mt-1">Manage all move-outs and coordinate cleaning tasks.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center text-gray-500 mr-2">
            <Filter className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <select 
            value={filterYear} 
            onChange={e => setFilterYear(e.target.value)}
            className="text-sm border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8"
          >
            {availableYears.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
          </select>
          <select 
            value={filterMonth} 
            onChange={e => setFilterMonth(e.target.value)}
            className="text-sm border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8"
          >
            {availableMonths.map(m => <option key={m} value={m}>{m === 'All' ? 'All Months' : m}</option>)}
          </select>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8"
          >
            <option value="All">All Statuses</option>
            <option value="Awaiting PT Outgoing">Awaiting PT Outgoing</option>
            <option value="Needs Cleaning">Needs Cleaning</option>
            <option value="Runner">Runner</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 border-collapse">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
              <tr>
                <th className="p-4">Room / Resident</th>
                <th className="p-4">Depart Date</th>
                <th className="p-4">Clean Status</th>
                <th className="p-4">Repair Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDepartures.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="p-8 text-center text-gray-500">
                     No departures match your filter criteria.
                   </td>
                 </tr>
              ) : (
                filteredDepartures.map(dep => {
                  const resident = residents.find(r => r.reservationNumber === dep.reservationNumber);
                  return (
                    <tr key={dep.departureId} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{resident?.roomNumber}</div>
                        <div className="text-gray-500 text-xs">{resident?.fullName}</div>
                      </td>
                      <td className="p-4">{new Date(dep.departDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex mb-2 px-2 py-0.5 rounded text-xs font-medium 
                          ${dep.cleanStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                            dep.cleanStatus === 'Runner' ? 'bg-purple-100 text-purple-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {dep.cleanStatus}
                        </span>
                        <select 
                          value={dep.cleanStatus}
                          onChange={(e) => handleStatusChange(dep.departureId, 'cleanStatus', e.target.value)}
                          className="block w-full text-xs border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1 border bg-white"
                        >
                          <option value="Awaiting PT Outgoing">Awaiting PT Outgoing</option>
                          <option value="Needs Cleaning">Needs Cleaning</option>
                          <option value="Runner">Runner</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="p-4">
                       <span className={`inline-flex mb-2 px-2 py-0.5 rounded text-xs font-medium 
                          ${dep.repairStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                            dep.repairStatus === 'None' ? 'bg-gray-100 text-gray-800' : 
                            'bg-orange-100 text-orange-800'}`}>
                          {dep.repairStatus}
                        </span>
                        <select 
                          value={dep.repairStatus}
                          onChange={(e) => handleStatusChange(dep.departureId, 'repairStatus', e.target.value)}
                          className="block w-full text-xs border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1 border bg-white disabled:bg-gray-100 disabled:text-gray-500"
                          disabled={role !== 'Facility'} // Only Facility can change repair status
                        >
                          <option value="None">None</option>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="p-4 text-right align-middle">
                        <button 
                          onClick={() => navigate(`/inspection/${dep.departureId}`)}
                          className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors border border-blue-200"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* New Checkout Modal */}
      {isAddingCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Add Resident Checkout</h2>
              <button onClick={() => setIsAddingCheckout(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCheckout} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Resident</label>
                <select 
                  required
                  value={newCheckoutRes}
                  onChange={e => setNewCheckoutRes(e.target.value)}
                  className="w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-gray-50 text-sm"
                >
                  <option value="">-- Choose Resident --</option>
                  {residents.map(r => (
                    <option key={r.reservationNumber} value={r.reservationNumber}>
                      {r.roomNumber} - {r.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                <input 
                  type="date" 
                  required
                  value={newCheckoutDate}
                  onChange={e => setNewCheckoutDate(e.target.value)}
                  className="w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-gray-50 text-sm"
                />
              </div>

              <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddingCheckout(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newCheckoutRes}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

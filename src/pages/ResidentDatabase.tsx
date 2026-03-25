import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppDataContext';
import { Search, Plus, X } from 'lucide-react';

export default function ResidentDatabase() {
  const { residents, addResident, role } = useAppContext();
  
  const [isAddingResident, setIsAddingResident] = useState(false);
  const [newResNum, setNewResNum] = useState('');
  const [newRoomNum, setNewRoomNum] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  const handleAddResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResNum || !newRoomNum || !newFirstName || !newLastName) return;

    addResident({
      reservationNumber: newResNum,
      roomNumber: newRoomNum,
      firstName: newFirstName,
      lastName: newLastName,
      fullName: `${newFirstName} ${newLastName}`
    });

    setIsAddingResident(false);
    setNewResNum('');
    setNewRoomNum('');
    setNewFirstName('');
    setNewLastName('');
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredResidents = useMemo(() => {
    return residents.filter(res => {
      const term = searchTerm.toLowerCase();
      return res.fullName.toLowerCase().includes(term) || 
             res.roomNumber.toLowerCase().includes(term) ||
             res.reservationNumber.toLowerCase().includes(term);
    });
  }, [residents, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Resident Database</h1>
            {role === 'Admin' && (
              <button 
                onClick={() => setIsAddingResident(true)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                New Resident
              </button>
            )}
          </div>
          <p className="text-gray-500 mt-1">Master list of all current residents across properties.</p>
        </div>
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
            placeholder="Search by name, resident # or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <th className="p-4">Res #</th>
                <th className="p-4">Room</th>
                <th className="p-4">First Name</th>
                <th className="p-4">Last Name</th>
                <th className="p-4">Full Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No residents found matching your search.
                  </td>
                </tr>
              ) : (
                filteredResidents.map((resident) => {
                  // Derive first/last from full name if missing (mock data simplification)
                  const nameParts = resident.fullName.split(' ');
                  const firstName = nameParts[0];
                  const lastName = nameParts.slice(1).join(' ');

                  return (
                    <tr key={resident.reservationNumber} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-900">{resident.reservationNumber}</td>
                      <td className="p-4 text-sm font-medium text-blue-600">{resident.roomNumber}</td>
                      <td className="p-4 text-sm text-gray-600">{firstName}</td>
                      <td className="p-4 text-sm text-gray-600">{lastName}</td>
                      <td className="p-4 text-sm text-gray-900">{resident.fullName}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Resident Modal */}
      {isAddingResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Add New Resident</h2>
              <button onClick={() => setIsAddingResident(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddResident} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reservation #</label>
                  <input 
                    type="text" 
                    required
                    value={newResNum}
                    onChange={e => setNewResNum(e.target.value)}
                    placeholder="e.g. RES-001"
                    className="w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room #</label>
                  <input 
                    type="text" 
                    required
                    value={newRoomNum}
                    onChange={e => setNewRoomNum(e.target.value)}
                    placeholder="e.g. 01.01"
                    className="w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-gray-50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={newFirstName}
                    onChange={e => setNewFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    required
                    value={newLastName}
                    onChange={e => setNewLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-gray-50 text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddingResident(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newResNum || !newRoomNum || !newFirstName || !newLastName}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

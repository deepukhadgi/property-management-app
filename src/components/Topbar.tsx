import { useAppContext } from '../context/AppDataContext';
import { ShieldCheck, Wrench } from 'lucide-react';

export default function Topbar() {
  const { role, setRole } = useAppContext();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
      <h2 className="text-xl font-semibold text-gray-800">
        Property Departure Management
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-500">View As:</span>
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setRole('Admin')}
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              role === 'Admin' 
                ? 'bg-white shadow-sm text-blue-700 ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Admin
          </button>
          <button
            onClick={() => setRole('Facility')}
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              role === 'Facility' 
                ? 'bg-white shadow-sm text-blue-700 ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Wrench className="w-4 h-4 mr-2" />
            Facility
          </button>
        </div>
      </div>
    </header>
  );
}

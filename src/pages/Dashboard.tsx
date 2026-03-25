import { useAppContext } from '../context/AppDataContext';
import { ClipboardList, Droplets, DollarSign, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { departures, damageCharges, priceList } = useAppContext();
  const navigate = useNavigate();

  const totalDepartures = departures.length;
  const pendingInspections = departures.filter(d => !d.inspectedDate).length;
  const roomsCleaning = departures.filter(d => d.cleanStatus === 'Needs Cleaning' || d.cleanStatus === 'Runner').length;

  const totalRefunds = departures.reduce((acc, dep) => {
    const depCharges = damageCharges.filter(c => c.departureId === dep.departureId);
    const fmCost = depCharges.reduce((sum, charge) => {
      const item = priceList.find(p => p.id === charge.priceListItemId);
      return sum + (charge.costOverride ?? (item?.cost || 0));
    }, 0);
    const refund = Math.max(0, dep.originalBond - fmCost - dep.irregularCheckoutArrears);
    return acc + refund;
  }, 0);

  const stats = [
    { label: 'Upcoming Departures', value: totalDepartures, icon: <Users className="w-8 h-8 text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Pending Inspections', value: pendingInspections, icon: <ClipboardList className="w-8 h-8 text-amber-500" />, bg: 'bg-amber-50' },
    { label: 'Rooms to Clean', value: roomsCleaning, icon: <Droplets className="w-8 h-8 text-cyan-500" />, bg: 'bg-cyan-50' },
    { label: 'Total Bonds to Refund', value: `$${totalRefunds.toFixed(2)}`, icon: <DollarSign className="w-8 h-8 text-green-500" />, bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">High-level metrics for departures and inspections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-lg ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Recent Departures</h3>
            <button onClick={() => navigate('/departures')} className="text-blue-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {departures.slice(0, 3).map(dep => (
              <div key={dep.departureId} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-900">Res: {dep.reservationNumber}</p>
                  <p className="text-xs text-gray-500">Date: {new Date(dep.departDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${dep.inspectedDate ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {dep.inspectedDate ? 'Inspected' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

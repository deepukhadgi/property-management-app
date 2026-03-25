import { NavLink } from 'react-router-dom';
import { ClipboardCheck, Users, Sparkles, CalendarClock, ListOrdered, Settings as SettingsIcon, LogOut, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppDataContext';

export default function Sidebar() {
  const { role, logout } = useAppContext();

  const getNavLinks = () => {
    const adminLinks = [
      { to: '/irregular-checkouts', icon: <ClipboardCheck className="w-5 h-5 mr-3" />, label: 'Irregular Checkouts' },
      { to: '/residents', icon: <Users className="w-5 h-5 mr-3" />, label: 'Resident Database' },
      { to: '/pricelist', icon: <ListOrdered className="w-5 h-5 mr-3" />, label: 'Price List Manager' },
      { to: '/settings', icon: <SettingsIcon className="w-5 h-5 mr-3" />, label: 'Settings' },
    ];

    const facilityLinks = [
      { to: '/departures', icon: <CalendarClock className="w-5 h-5 mr-3" />, label: 'Cleaning Schedule' },
      { to: '/extra-cleaning', icon: <Sparkles className="w-5 h-5 mr-3" />, label: 'Log Extra Cleaning' },
    ];
    
    if (role === 'Superuser') {
      return [
        { to: '/users', icon: <ShieldAlert className="w-5 h-5 mr-3" />, label: 'User Management' },
        ...facilityLinks,
        ...adminLinks
      ];
    }

    return role === 'Facility' ? facilityLinks : adminLinks;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="font-bold text-xl text-blue-600 tracking-tight">PropManage</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {getNavLinks().map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex w-full items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

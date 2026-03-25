import { useState, FormEvent } from 'react';
import { useAppContext } from '../context/AppDataContext';
import { Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function PriceListManager() {
  const { priceList, setPriceList } = useAppContext();
  
  const [itemCode, setItemCode] = useState('');
  const [area, setArea] = useState('');
  const [desc, setDesc] = useState('');
  const [cost, setCost] = useState('');

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (!itemCode || !desc || !cost) return;

    const newItem = {
      id: uuidv4(),
      itemCode,
      area: area || 'General',
      damageDescription: desc,
      cost: parseFloat(cost)
    };

    setPriceList(prev => [...prev, newItem]);
    setItemCode(''); setArea(''); setDesc(''); setCost('');
  };

  const handleRemove = (id: string) => {
    setPriceList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Damage Price List</h1>
        <p className="text-gray-500 mt-1">Manage standardized costs for damages and cleaning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={handleAddItem} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Add New Item</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Item Code</label>
              <input type="text" required value={itemCode} onChange={e => setItemCode(e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="e.g. K2" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Area</label>
              <input type="text" value={area} onChange={e => setArea(e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="e.g. Kitchen" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input type="text" required value={desc} onChange={e => setDesc(e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="e.g. Broken Tile" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cost ($)</label>
              <input type="number" step="0.01" required value={cost} onChange={e => setCost(e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="50.00" />
            </div>

            <button type="submit" className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white font-medium rounded text-sm hover:bg-blue-700 transition">
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Area</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Cost</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {priceList.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.itemCode}</td>
                    <td className="px-6 py-4 text-gray-500">{item.area}</td>
                    <td className="px-6 py-4">{item.damageDescription}</td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">${item.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-red-600 transition p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {priceList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No items found in price list.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import ExcelUploader from '../components/ExcelUploader';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Manage application data and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ExcelUploader />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">Data Persistence</h3>
          <p className="text-sm text-gray-500 mb-4">
            Currently, all application data is stored in your browser's LocalStorage. This means the data is persistent across page reloads on this machine, but is not synced externally to a backend server.
          </p>
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
            <strong>Note:</strong> Clearing your browser data will delete the application database. Make sure to keep your source Excel files safe!
          </div>
        </div>
      </div>
    </div>
  );
}

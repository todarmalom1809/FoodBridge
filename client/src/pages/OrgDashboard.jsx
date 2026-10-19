import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { PlusCircle, Package, ClipboardList } from 'lucide-react';

export default function OrgDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('requests');
  const [myRequests, setMyRequests] = useState([]);
  const [available, setAvailable] = useState([]);

  const fetchAll = () => {
    api.get('/requests/my').then(r => setMyRequests(r.data)).catch(() => {});
    api.get(`/donations/available?foodType=${user.orgType}`).then(r => setAvailable(r.data)).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, []);

  const stats = {
    open: myRequests.filter(r => r.status === 'open').length,
    fulfilled: myRequests.filter(r => r.status === 'fulfilled').length,
    total: myRequests.length,
  };

  const isAnimal = user.orgType === 'animal';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name} 👋</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isAnimal ? '🐾 Animal Care' : '🏠 Human Care'} Organization Dashboard
            </p>
          </div>
          <Link to="/request" className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-orange-600 transition">
            <PlusCircle className="w-4 h-4" /> Post Food Request
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Open Requests', value: stats.open, color: 'text-orange-500' },
            { label: 'Fulfilled', value: stats.fulfilled, color: 'text-green-600' },
            { label: 'Total Requests', value: stats.total, color: 'text-gray-800' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Food type notice */}
        <div className={`rounded-xl p-4 mb-6 text-sm font-medium ${isAnimal ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {isAnimal
            ? '🐾 Your organization is registered for animal care. You will only see animal food donations and your requests will be for animal food.'
            : '🍽️ Your organization is registered for human care. You will only see human food donations and your requests will be for human food.'}
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { key: 'requests', label: 'My Requests', icon: <ClipboardList className="w-4 h-4" /> },
            { key: 'available', label: 'Available Donations', icon: <Package className="w-4 h-4" /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'requests' && (
          <div className="space-y-4">
            {myRequests.length === 0 && (
              <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-dashed border-gray-200">
                No requests yet. <Link to="/request" className="text-orange-500 font-medium">Post your first food request →</Link>
              </div>
            )}
            {myRequests.map(r => (
              <div key={r._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{r.foodDescription}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.foodType === 'animal' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {r.foodType === 'animal' ? '🐾 Animal Food' : '🍽️ Human Food'}
                    </span>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-gray-500 mt-2">Quantity: {r.quantity} · Required by: {new Date(r.requiredDate).toLocaleDateString()}</p>
                {r.fulfilledBy && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">✅ Fulfilled via donation: {r.fulfilledBy.foodName}</p>
                    {r.fulfilledBy.distributionProof && <img src={r.fulfilledBy.distributionProof} alt="proof" className="w-24 h-16 object-cover rounded mt-2" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'available' && (
          <div className="space-y-4">
            {available.length === 0 && (
              <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-dashed border-gray-200">
                No {isAnimal ? 'animal' : 'human'} food donations available right now.
              </div>
            )}
            {available.map(d => (
              <div key={d._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                {d.photoUrl && <img src={d.photoUrl} alt={d.foodName} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800">{d.foodName}</h3>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Qty: {d.quantity}</p>
                  <p className="text-sm text-gray-500">📍 {d.pickupLocation} · ⏰ {d.pickupTime}</p>
                  {d.description && <p className="text-sm text-gray-600 mt-1">{d.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">Contact NGO to arrange pickup</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

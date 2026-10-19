import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import { PlusCircle, History, Package } from 'lucide-react';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState('donations');

  useEffect(() => {
    api.get('/donations/my').then(r => setDonations(r.data)).catch(() => {});
    api.get('/requests/open').then(r => setRequests(r.data)).catch(() => {});
  }, []);

  const stats = {
    total: donations.length,
    active: donations.filter(d => ['available', 'claimed', 'picked_up'].includes(d.status)).length,
    completed: donations.filter(d => d.status === 'distributed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name} 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Individual Donor Dashboard</p>
          </div>
          <Link to="/donate" className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-700 transition">
            <PlusCircle className="w-4 h-4" /> New Donation
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Donations', value: stats.total, color: 'text-gray-800' },
            { label: 'Active', value: stats.active, color: 'text-blue-600' },
            { label: 'Completed', value: stats.completed, color: 'text-green-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'donations', label: 'My Donations', icon: <Package className="w-4 h-4" /> },
            { key: 'requests', label: 'Food Requests', icon: <History className="w-4 h-4" /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* My Donations */}
        {tab === 'donations' && (
          <div className="space-y-4">
            {donations.length === 0 && (
              <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-dashed border-gray-200">
                No donations yet. <Link to="/donate" className="text-green-600 font-medium">Create your first donation →</Link>
              </div>
            )}
            {donations.map(d => (
              <div key={d._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                {d.photoUrl && <img src={d.photoUrl} alt={d.foodName} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-800">{d.foodName}</h3>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Qty: {d.quantity} · {d.foodType === 'animal' ? '🐾 Animal Food' : d.foodType === 'both' ? '🍽️ Human & Animal' : '🍽️ Human Food'}</p>
                  <p className="text-sm text-gray-500">📍 {d.pickupLocation} · ⏰ {d.pickupTime}</p>
                  {d.claimedBy && <p className="text-sm text-blue-600 mt-1">Claimed by: {d.claimedBy.ngoName || d.claimedBy.name}</p>}
                  {d.deliveredTo && <p className="text-sm text-purple-600">Delivered to: {d.deliveredTo.orgName || d.deliveredTo.name}</p>}
                  {d.distributionProof && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Distribution Proof:</p>
                      <img src={d.distributionProof} alt="proof" className="w-24 h-16 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Food Requests from Organizations */}
        {tab === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 && (
              <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-dashed border-gray-200">No open food requests at the moment.</div>
            )}
            {requests.map(r => (
              <div key={r._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{r.orgId?.orgName || r.orgId?.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.foodType === 'animal' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {r.foodType === 'animal' ? '🐾 Animal Food' : '🍽️ Human Food'}
                    </span>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-gray-600 mt-2">{r.foodDescription}</p>
                <p className="text-sm text-gray-500 mt-1">Qty needed: {r.quantity} · Required by: {new Date(r.requiredDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">📍 {r.orgId?.address} · Serves: {r.orgId?.peopleServed} {r.orgId?.orgType === 'animal' ? 'animals' : 'people'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

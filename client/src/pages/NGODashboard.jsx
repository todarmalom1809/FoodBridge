import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import { Truck, CheckCircle, Package, ClipboardList } from 'lucide-react';

export default function NGODashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('available');
  const [available, setAvailable] = useState([]);
  const [claimed, setClaimed] = useState([]);
  const [requests, setRequests] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [statusModal, setStatusModal] = useState(null); // { donation }
  const [statusForm, setStatusForm] = useState({ status: 'picked_up', deliveredTo: '', proof: null });
  const [loading, setLoading] = useState(false);

  const fetchAll = () => {
    api.get('/donations/available').then(r => setAvailable(r.data)).catch(() => {});
    api.get('/donations/claimed').then(r => setClaimed(r.data)).catch(() => {});
    api.get('/requests/open').then(r => setRequests(r.data)).catch(() => {});
    api.get('/users/organizations').then(r => setOrgs(r.data)).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, []);

  const claim = async (id) => {
    try {
      await api.patch(`/donations/${id}/claim`);
      toast.success('Donation claimed!');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim');
    }
  };

  const updateStatus = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('status', statusForm.status);
      if (statusForm.deliveredTo) fd.append('deliveredTo', statusForm.deliveredTo);
      if (statusForm.proof) fd.append('proof', statusForm.proof);
      await api.patch(`/donations/${statusModal._id}/status`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Status updated!');
      setStatusModal(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const fulfillRequest = async (reqId, donationId) => {
    try {
      await api.patch(`/requests/${reqId}/fulfill`, { donationId });
      toast.success('Request marked as fulfilled!');
      fetchAll();
    } catch (err) {
      toast.error('Failed to fulfill request');
    }
  };

  const stats = {
    available: available.length,
    active: claimed.filter(d => d.status !== 'distributed').length,
    completed: claimed.filter(d => d.status === 'distributed').length,
  };

  const tabs = [
    { key: 'available', label: 'Available Donations', icon: <Package className="w-4 h-4" /> },
    { key: 'claimed', label: 'My Pickups', icon: <Truck className="w-4 h-4" /> },
    { key: 'requests', label: 'Food Requests', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">NGO Dashboard</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Available', value: stats.available, color: 'text-green-600' },
            { label: 'In Progress', value: stats.active, color: 'text-blue-600' },
            { label: 'Distributed', value: stats.completed, color: 'text-purple-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Available Donations */}
        {tab === 'available' && (
          <div className="space-y-4">
            {available.length === 0 && <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-dashed border-gray-200">No available donations right now.</div>}
            {available.map(d => (
              <div key={d._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                {d.photoUrl && <img src={d.photoUrl} alt={d.foodName} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800">{d.foodName}</h3>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Qty: {d.quantity}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.foodType === 'animal' ? 'bg-orange-100 text-orange-700' : d.foodType === 'both' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {d.foodType === 'animal' ? '🐾 Animal Food' : d.foodType === 'both' ? '🍽️ Human & Animal' : '🍽️ Human Food'}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">📍 {d.pickupLocation} · ⏰ {d.pickupTime}</p>
                  <p className="text-sm text-gray-500">Donor: {d.donorId?.name} · {d.donorId?.contact}</p>
                  {d.description && <p className="text-sm text-gray-600 mt-1">{d.description}</p>}
                  <button onClick={() => claim(d._id)}
                    className="mt-3 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">
                    Claim Donation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Claimed / My Pickups */}
        {tab === 'claimed' && (
          <div className="space-y-4">
            {claimed.length === 0 && <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-dashed border-gray-200">No claimed donations yet.</div>}
            {claimed.map(d => (
              <div key={d._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                {d.photoUrl && <img src={d.photoUrl} alt={d.foodName} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800">{d.foodName}</h3>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Qty: {d.quantity} · 📍 {d.donorId?.address}</p>
                  <p className="text-sm text-gray-500">Donor: {d.donorId?.name} · {d.donorId?.contact}</p>
                  {d.deliveredTo && <p className="text-sm text-purple-600 mt-1">Delivered to: {d.deliveredTo.orgName || d.deliveredTo.name}</p>}
                  {d.distributionProof && <img src={d.distributionProof} alt="proof" className="w-24 h-16 object-cover rounded mt-2" />}
                  {d.status !== 'distributed' && (
                    <button onClick={() => { setStatusModal(d); setStatusForm({ status: 'picked_up', deliveredTo: '', proof: null }); }}
                      className="mt-3 bg-yellow-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-yellow-600 transition">
                      Update Status
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Food Requests */}
        {tab === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 && <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-dashed border-gray-200">No open food requests.</div>}
            {requests.map(r => (
              <div key={r._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{r.orgId?.orgName || r.orgId?.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.foodType === 'animal' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {r.foodType === 'animal' ? '🐾 Animal Food Required' : '🍽️ Human Food Required'}
                    </span>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-gray-600 mt-2">{r.foodDescription}</p>
                <p className="text-sm text-gray-500 mt-1">Qty: {r.quantity} · Required by: {new Date(r.requiredDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">📍 {r.orgId?.address} · 📞 {r.orgId?.contact}</p>
                <p className="text-sm text-gray-500">Serves: {r.orgId?.peopleServed} {r.orgId?.orgType === 'animal' ? 'animals' : 'people'}</p>
                <button onClick={() => fulfillRequest(r._id)}
                  className="mt-3 flex items-center gap-1 bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 transition">
                  <CheckCircle className="w-4 h-4" /> Mark as Fulfilled
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Update Status: {statusModal.foodName}</h3>
            <form onSubmit={updateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select value={statusForm.status} onChange={e => setStatusForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="picked_up">Picked Up</option>
                  <option value="distributed">Distributed</option>
                </select>
              </div>
              {statusForm.status === 'distributed' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivered To (Organization)</label>
                    <select value={statusForm.deliveredTo} onChange={e => setStatusForm(f => ({ ...f, deliveredTo: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                      <option value="">Select organization...</option>
                      {orgs.map(o => <option key={o._id} value={o._id}>{o.orgName || o.name} ({o.orgCategory})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distribution Proof Photo</label>
                    <input type="file" accept="image/*" onChange={e => setStatusForm(f => ({ ...f, proof: e.target.files[0] }))}
                      className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 file:font-medium" />
                  </div>
                </>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStatusModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

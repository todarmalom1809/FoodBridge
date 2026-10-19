import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

export default function DonationForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    foodName: '', quantity: '', description: '',
    pickupLocation: '', pickupTime: '', foodType: 'human',
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (file) { setPhoto(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);
      await api.post('/donations', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Donation posted successfully!');
      navigate('/donor');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post donation');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Post a Food Donation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
            <select value={form.foodType} onChange={e => set('foodType', e.target.value)} className={inp}>
              <option value="human">🍽️ Human Food</option>
              <option value="animal">🐾 Animal Food</option>
              <option value="both">🍽️🐾 Both (Human & Animal)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Name *</label>
            <input required placeholder="e.g. Rice, Vegetables, Dog Food" value={form.foodName} onChange={e => set('foodName', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input required placeholder="e.g. 5 kg, 20 servings" value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} placeholder="Describe the food, freshness, packaging..." value={form.description} onChange={e => set('description', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location *</label>
            <input required placeholder="Full address for pickup" value={form.pickupLocation} onChange={e => set('pickupLocation', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Pickup Time *</label>
            <input required placeholder="e.g. Today 4–7 PM, Weekdays 10 AM–2 PM" value={form.pickupTime} onChange={e => set('pickupTime', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Photo</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-400 transition">
              {preview ? (
                <img src={preview} alt="preview" className="w-full max-h-48 object-cover rounded-lg" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload photo</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/donor')}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Posting...' : 'Post Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

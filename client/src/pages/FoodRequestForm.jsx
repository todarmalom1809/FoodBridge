import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function FoodRequestForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAnimal = user.orgType === 'animal';

  const [form, setForm] = useState({
    foodType: isAnimal ? 'animal' : 'human',
    foodDescription: '',
    quantity: '',
    requiredDate: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/requests', form);
      toast.success('Food request posted!');
      navigate('/org');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post request');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Post a Food Request</h2>
        <p className="text-sm text-gray-500 mb-6">Let NGOs know what food your organization needs.</p>

        {/* Food type lock notice */}
        <div className={`rounded-xl p-3 mb-6 text-sm font-medium ${isAnimal ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {isAnimal
            ? '🐾 Your request will be posted as Animal Food only, since your organization is registered as an animal care centre.'
            : '🍽️ Your request will be posted as Human Food only, since your organization is registered as a human care centre.'}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
            <input value={isAnimal ? '🐾 Animal Food' : '🍽️ Human Food'} disabled
              className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Description *</label>
            <textarea required rows={3}
              placeholder={isAnimal ? 'e.g. Dry dog food, cat food, grain-free kibble...' : 'e.g. Cooked meals, rice, vegetables, bread...'}
              value={form.foodDescription} onChange={e => set('foodDescription', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Needed *</label>
            <input required placeholder="e.g. 20 kg, 50 servings" value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required By Date *</label>
            <input required type="date" min={new Date().toISOString().split('T')[0]}
              value={form.requiredDate} onChange={e => set('requiredDate', e.target.value)} className={inp} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/org')}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50">
              {loading ? 'Posting...' : 'Post Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

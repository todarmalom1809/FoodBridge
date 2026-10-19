import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { Leaf } from 'lucide-react';

const ROLE_LABELS = { donor: 'Individual Donor', ngo: 'NGO', organization: 'Organization' };

export default function Register() {
  const [params] = useSearchParams();
  const initialRole = params.get('role') === 'org' ? 'organization' : params.get('role') || 'donor';
  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    name: '', email: '', password: '', address: '', contact: '',
    ngoName: '', ngoType: '',
    orgName: '', orgType: 'human', orgCategory: '', peopleServed: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { ...form, role });
      login(data.user, data.token);
      toast.success('Account created!');
      navigate(role === 'donor' ? '/donor' : role === 'ngo' ? '/ngo' : '/org');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-lg">
        <div className="flex items-center gap-2 justify-center mb-6 text-green-700">
          <Leaf className="w-6 h-6" />
          <span className="text-2xl font-bold">FoodBridge</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Create Account</h2>

        {/* Role selector */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          {['donor', 'ngo', 'organization'].map(r => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${role === r ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}>
              {ROLE_LABELS[r]}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Full Name" value={form.name} onChange={e => set('name', e.target.value)} className={inp} />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} className={inp} />
          <input required type="password" placeholder="Password (min 6 chars)" minLength={6} value={form.password} onChange={e => set('password', e.target.value)} className={inp} />
          <input placeholder="Address" value={form.address} onChange={e => set('address', e.target.value)} className={inp} />
          <input placeholder="Contact Number" value={form.contact} onChange={e => set('contact', e.target.value)} className={inp} />

          {role === 'ngo' && (
            <>
              <input required placeholder="NGO Name" value={form.ngoName} onChange={e => set('ngoName', e.target.value)} className={inp} />
              <input placeholder="Type of Work (e.g. Food Distribution)" value={form.ngoType} onChange={e => set('ngoType', e.target.value)} className={inp} />
            </>
          )}

          {role === 'organization' && (
            <>
              <input required placeholder="Organization Name" value={form.orgName} onChange={e => set('orgName', e.target.value)} className={inp} />
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Organization Type</label>
                <select value={form.orgType} onChange={e => set('orgType', e.target.value)} className={inp}>
                  <option value="human">Human Care (Orphanage, Old-age Home, etc.)</option>
                  <option value="animal">Animal Care (Shelter, Adoption Centre, etc.)</option>
                </select>
              </div>
              <input placeholder={form.orgType === 'animal' ? 'Category (e.g. Dog Shelter)' : 'Category (e.g. Orphanage)'} value={form.orgCategory} onChange={e => set('orgCategory', e.target.value)} className={inp} />
              <input type="number" placeholder={form.orgType === 'animal' ? 'Number of animals served' : 'Number of people served'} value={form.peopleServed} onChange={e => set('peopleServed', e.target.value)} className={inp} />
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

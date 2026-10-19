import { Link } from 'react-router-dom';
import { Leaf, Heart, Building2, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <Leaf className="w-14 h-14 text-green-200" />
          </div>
          <h1 className="text-5xl font-bold mb-4">FoodBridge</h1>
          <p className="text-xl text-green-100 mb-8">Connecting food donors with NGOs and organizations in need. Together, we eliminate food waste and feed communities.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-white text-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition">Get Started</Link>
            <Link to="/login" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-700 transition">Login</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How FoodBridge Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Heart className="w-8 h-8 text-green-600" />, title: 'Donors Share Food', desc: 'Individual donors upload available food with photos, quantity, and pickup details.' },
              { icon: <Users className="w-8 h-8 text-blue-600" />, title: 'NGOs Collect', desc: 'NGOs browse donations, claim them, arrange pickup, and deliver to organizations.' },
              { icon: <Building2 className="w-8 h-8 text-orange-600" />, title: 'Organizations Receive', desc: 'Orphanages, shelters, and care homes post food needs and receive donations.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Join As</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { color: 'green', label: 'Individual Donor', desc: 'Donate surplus food from your home, events, or business.', role: 'donor' },
              { color: 'blue', label: 'NGO', desc: 'Collect food from donors and distribute to organizations in need.', role: 'ngo' },
              { color: 'orange', label: 'Organization', desc: 'Post food requirements for your orphanage, shelter, or care home.', role: 'org' },
            ].map((item, i) => (
              <Link key={i} to={`/register?role=${item.role}`}
                className={`border-2 border-${item.color}-200 rounded-2xl p-6 hover:border-${item.color}-400 hover:shadow-md transition group`}>
                <h3 className={`font-bold text-lg text-${item.color}-700 mb-2`}>{item.label}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                <span className={`text-sm font-semibold text-${item.color}-600 group-hover:underline`}>Register →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-green-800 text-green-200 text-center py-6 text-sm">
        © 2024 FoodBridge — Bridging the gap between surplus and need.
      </footer>
    </div>
  );
}

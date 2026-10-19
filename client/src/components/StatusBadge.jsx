const STATUS_STYLES = {
  available: 'bg-green-100 text-green-700',
  claimed: 'bg-blue-100 text-blue-700',
  picked_up: 'bg-yellow-100 text-yellow-700',
  distributed: 'bg-purple-100 text-purple-700',
  open: 'bg-orange-100 text-orange-700',
  fulfilled: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

const STATUS_LABELS = {
  available: 'Available',
  claimed: 'Claimed',
  picked_up: 'Picked Up',
  distributed: 'Distributed',
  open: 'Open',
  fulfilled: 'Fulfilled',
  closed: 'Closed',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

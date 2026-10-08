const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="p-3 bg-primary-50 rounded-lg">
        <Icon className="h-6 w-6 text-primary-600" />
      </div>
    </div>
    {trend && (
      <div className="mt-4">
        <span className="text-sm font-medium text-success-500">{trend}</span>
      </div>
    )}
  </div>
);
export default StatsCard;

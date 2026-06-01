function StatCard({ title, value, icon: Icon, bgColor = 'bg-blue-500', textColor = 'text-white' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className={`${bgColor} ${textColor} p-3 rounded-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  )
}

export default StatCard

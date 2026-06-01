import { Inbox } from 'lucide-react'

function EmptyState({ message = 'No data found', icon: Icon }) {
  const IconComponent = Icon || Inbox

  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <IconComponent className="w-16 h-16 mb-3" />
      <p className="text-lg">{message}</p>
    </div>
  )
}

export default EmptyState

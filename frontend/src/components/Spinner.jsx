function Spinner({ fullPage = false }) {
  const spinner = (
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center h-64">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  )
}

export default Spinner

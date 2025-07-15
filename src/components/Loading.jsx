import React from 'react'

function Loading() {
  return (
    <div className='w-full h-screen flex flex-col font-light gap-3 text-xl justify-center items-center bg-indigo-50'>
      <div className="loading w-20 h-20 border-6 rounded-full border-gray-300 border-t-indigo-500 animate-spin"></div>
      <p>Almost there...</p>
    </div>
  )
}

export default Loading

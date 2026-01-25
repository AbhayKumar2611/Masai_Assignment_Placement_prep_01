import React from 'react'

const Progress = ({correct, incorrect}) => {
  return (
    <div className='flex gap-6 mt-6'>
        <p className='text-green-600 font-semibold'>
            ✅ Correct: {correct}
        </p>
        <p className='text-red-600 font-semibold'>
            ❌ Incorrect: {incorrect}
        </p>
    </div>
  )
}

export default Progress
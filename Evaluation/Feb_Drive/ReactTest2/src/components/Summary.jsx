import React from 'react'

const Summary = ({total, correct, incorrect}) => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center'>
            <h2 className='text-2xl font-bold mb-6'>📊 Session Summary</h2>

            <div className='space-y-3 text-lg'>
                <p>Total Cards Studied: {total}</p>
                <p className='text-green-600'>Correct AnswersL {correct}</p>
                <p className='text-red-600'>Incorrect Answers: {incorrect}</p>
                <p className='text-gray-600'>
                    Unattempted Cards: {total - (correct + incorrect)}
                </p>
            </div>
        </div>
    </div>
  )
}

export default Summary
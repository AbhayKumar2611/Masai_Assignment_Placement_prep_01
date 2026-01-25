import React, { useEffect } from 'react'

const Timer = ({timeLeft, setTimeLeft, onTimeUp}) => {

  useEffect(() => {
    if(timeLeft <= 0){
      onTimeUp();
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])
  
  return (
    <div className='text-lg font-medium text-gray-700 mb-4'>
        ⏱️ Time Left: <span className='font-bold'>{timeLeft}</span>
    </div>
  )
}

export default Timer
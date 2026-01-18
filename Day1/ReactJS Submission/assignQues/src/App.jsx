import React from 'react'
import Ques1 from './components/Ques1'
import Ques2 from './components/Ques2'

const App = () => {
  return (
    <div>
      <Ques1 />
      <hr style={{ margin: '40px 0', border: 'none', borderTop: '2px solid #ddd' }} />
      <Ques2 />
    </div>
  )
}

export default App
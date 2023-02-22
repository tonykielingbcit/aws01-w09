import { useState } from 'react'
import * as cognito from "./helpers/cognito.js";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Autorization Application</h1>
    </div>
  )
}

export default App

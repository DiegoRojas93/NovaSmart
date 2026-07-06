import Form from './Pages/Form.tsx'
import PageNotFound from './Pages/PageNotFound.tsx'
import User from './Pages/User.tsx'

function App() {
  return (
    <>
      <div className="bg-background-light min-h-screen h-dvh max-h-auto flex flex-col items-center justify-center">
          {/* <Form /> */}
          {/* <PageNotFound /> */}
          <User/>
      </div>
    </>
  )
}

export default App

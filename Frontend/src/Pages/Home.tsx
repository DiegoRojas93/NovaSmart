import { Link } from "react-router"

const Home = () => {
  return (
    <div>
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="text-center">
          <p>Hola soy el Home</p>
          <Link to="/Home/Register">Registro</Link>
        </div>
      </div> 
    </div>
  )
}

export default Home

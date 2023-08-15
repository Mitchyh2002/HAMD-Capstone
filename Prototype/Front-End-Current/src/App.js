import './App.css';
import { BrowserRouter, RouterProvider, createBrowserRouter} from 'react-router-dom';
import { AllRoutes, allRoutes } from 'Functions/Routing';
import { useEffect,  useState} from 'react';
import { getToken } from 'Functions/User';

function App() {
  const [modules, setModules] = useState([]);
  const [loaded, setLoaded] = useState(false);

  //Get all active modules from the server and store in state
  useEffect(() => {
    fetch("http://localhost:5000/module/getactive", {
      method: "GET",
      Authorisation: getToken()
    })
    .then( response => {
        return response.json();
    }).then(data => {
      console.log(data)
      console.log("Modules")
      setModules(data.Values)
    }).then(() => {
      setLoaded(true);
    })
  }, []);

  return (
    <>
      <RouterProvider router={createBrowserRouter(allRoutes(modules))} />
    </>
  );
}

export default App;
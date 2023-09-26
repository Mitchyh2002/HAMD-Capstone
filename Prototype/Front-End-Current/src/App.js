import './App.css';
import { BrowserRouter, RouterProvider, createBrowserRouter} from 'react-router-dom';
import { AllRoutes, allRoutes } from 'Functions/Routing';
import { useEffect,  useState} from 'react';
import { getToken } from 'Functions/User';

function App() {
  const [modules, setModules] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [pages, setPages] = useState([]);

  //Get all active modules from the server and store in state
  useEffect(() => {
    // Get active modules
    fetch("http://localhost:5000/module/getactive", {
      method: "GET",
      headers: {
	'Authorization': "Bearer " + getToken(),
	}
    })
    .then( response => {
        return response.json();
    }).then(data => {
      console.log(data)
      console.log("Modules")
      setModules(data.Values)
    }).then(() => {
    })
  }, []);

  return (
    <>
      <RouterProvider router={createBrowserRouter(allRoutes(modules, pages))} />
    </>
  );
}

export default App;
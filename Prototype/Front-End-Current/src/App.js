import './App.css';
import { BrowserRouter, RouterProvider, createBrowserRouter} from 'react-router-dom';
import { AllRoutes, allRoutes } from 'Functions/Routing';
import { useEffect,  useState} from 'react';
import { getToken, logout } from 'Functions/User';
import { baseUrl } from 'config';
import { AppLoader } from 'Components/loader';

function App() {
  const [modules, setModules] = useState([]);
  const [pages, setPages] = useState([]);
  const [router, setRouter] = useState();

  //Get all active modules from the server and store in state
  useEffect(() => {
    fetch(baseUrl + "/mst/module/getactive", {
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
      if(data.StatusCode == 403){
        logout();
      }else{
      setModules(data.Values);
      setRouter(createBrowserRouter(allRoutes(data.Values, pages)));
      console.log(router);
      }
    }).catch(err => {
      console.log();
      setRouter(createBrowserRouter(allRoutes(modules, pages)));
    })
  }, []);

  return (
    <>
      {router &&
      <RouterProvider 
      router={router} 
      fallbackElement={<AppLoader />} />}
    </>
  );
}

export default App;
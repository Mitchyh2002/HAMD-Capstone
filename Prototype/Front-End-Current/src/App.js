import './App.css';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Main from 'Pages/Main';
import { AllRoutes } from 'Functions/Routing';
import { useEffect,  useState} from 'react';

function App() {
  const [modules, setModules] = useState([]);
  const [loaded, setLoaded] = useState(false);

  //Load Data on mount
  useEffect(() => {
    const data = fetch("http://localhost:5000/module/getactive")
    .then( response => {
        return response.json();
    }).then(data => {
      setModules(data.Values)
    }).then(() => {
      setLoaded(true);
    })
  }, []);

  return (
    <>
      <BrowserRouter>
      {(loaded == true)&&
        <AllRoutes Modules={modules}/>}
      </BrowserRouter>
    </>
  );
}

export default App;
import './App.css';
import { BrowserRouter} from 'react-router-dom';
import { AllRoutes } from 'Functions/Routing';
import { useEffect,  useState} from 'react';

function App() {
  const [modules, setModules] = useState([]);
  const [loaded, setLoaded] = useState(false);

  //Get all active modules from the server and store in state
  useEffect(() => {
    fetch("http://localhost:5000/module/getactive")
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
import './App.css';
import Map from './components/Maps'

const accessToken = process.env.REACT_APP_MAPBOX_KEY

function App() {
  console.log(accessToken)
  return (
    <div className="App">
      <Map accessToken={accessToken}/>
    </div>
  );
}

export default App;

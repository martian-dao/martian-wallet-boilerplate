import './App.css';
import { AuthProvider } from './context/auth';
import Routes from './routes';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <div className="App-container">
          <Routes />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

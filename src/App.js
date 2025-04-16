import './App.css';
import { ImageProvider } from './contexts/ImageContext';
import MainRoute from './routes/MainRoute';

function App() {
  return (
    <ImageProvider>
         <MainRoute/>
    </ImageProvider>
  );
}

export default App;
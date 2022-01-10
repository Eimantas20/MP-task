import './App.scss';
import Search from './Components/Search';
import Catalogue from './Components/Catalogue';
import { PicturesProvider } from './Components/PicturesContext';


function App() {
	return (
		<PicturesProvider>
			<div className="container">
				<Search />
				<Catalogue />
			</div>
		</PicturesProvider>

	);
}

export default App;

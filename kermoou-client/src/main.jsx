import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import AuthProvider from './providers/authProvider';
import ScrollToTopOnMount from './components/ScrollToTopOnMount.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<AuthProvider>
			<ScrollToTopOnMount />
			<App />
		</AuthProvider>
	</BrowserRouter>,
);

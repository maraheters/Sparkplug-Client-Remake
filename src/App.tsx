import { Route, BrowserRouter as Router, Routes } from 'react-router'
import './App.css'
import { Layout } from './components/custom/Layout'
import Login from './features/auth/pages/Login'
import { AuthProvider } from './hooks/AuthContext'
import Home from './Home'
import { Toaster } from 'react-hot-toast'

function App() {

	return (
		<>
			<Router>
				<AuthProvider>
				
				<Routes>

					<Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                    </Route>
	
					<Route path="login" element={<Login />}></Route>

				</Routes>

				</AuthProvider>
			</Router>

			<Toaster position='bottom-right'/>
		</>
	)
}

export default App

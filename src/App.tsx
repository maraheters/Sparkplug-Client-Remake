import { Route, BrowserRouter as Router, Routes } from 'react-router'
import './App.css'
import { Layout } from './components/custom/Layout'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import CreateListing from './features/listings/pages/CreateListing'
import ListingDetails from './features/listings/pages/ListingDetails'
import { AuthProvider } from './hooks/AuthContext'
import Home from './Home'
import { Toaster } from 'react-hot-toast'
import ModifyListing from './features/listings/pages/ModifyListing'

function App() {

	return (
		<>
			<Router>
				<AuthProvider>
				
				<Routes>

					<Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="create-listing" element={<CreateListing />} />
                        <Route path="listings/:id" element={<ListingDetails />} />
                        <Route path="listings/:id/edit" element={<ModifyListing />} />
                    </Route>
	
					<Route path="login" element={<Login />}></Route>
					<Route path="register" element={<Register />}></Route>

				</Routes>

				</AuthProvider>
			</Router>

			<Toaster position='bottom-right'/>
		</>
	)
}

export default App

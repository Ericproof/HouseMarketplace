import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Category from './pages/ Category';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
// import Explore from './pages/Explore';
// import Offers from './pages/Offers';
// import Profile from './pages/Profile';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import ForgotPassword from './pages/ForgotPassword';
// import CreateListing from './pages/CreateListing';
// import Listing from './pages/Lisitng';
import Spinner from './components/Spinner';
const Profile = React.lazy(() => import('./pages/Profile'));
const Offers = React.lazy(() => import('./pages/Offers'));
const Explore = React.lazy(() => import('./pages/Explore'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Listing = React.lazy(() => import('./pages/Lisitng'));
const CreateListing = React.lazy(() => import('./pages/CreateListing'));

function App() {
	return (
		<>
			<BrowserRouter>
				<Suspense fallback={<Spinner />}>
					<Routes>
						<Route path="/" element={<Explore />}></Route>
						<Route path="/offers" element={<Offers />}></Route>
						<Route
							path="/category/:categoryName"
							element={<Category />}
						></Route>
						<Route path="/profile" element={<PrivateRoute />}>
							<Route path="/profile" element={<Profile />}></Route>
						</Route>
						<Route path="/sign-in" element={<SignIn />}></Route>
						<Route path="/sign-up" element={<SignUp />}></Route>
						<Route path="/forgot-password" element={<ForgotPassword />}></Route>
						<Route path="/create-listing" element={<CreateListing />}></Route>
						<Route path="/contact/:landlordId" element={<Contact />}></Route>
						<Route
							path="/category/:categoryName/:listingId"
							element={<Listing />}
						></Route>
					</Routes>
				</Suspense>
				<Navbar />
			</BrowserRouter>
			<ToastContainer />
		</>
	);
}

export default App;

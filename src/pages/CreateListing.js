import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';

function CreateListing() {
	// eslint-disable-next-line no-unused-vars
	const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0
	});
	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude
	} = formData;

	const auth = getAuth();
	const navigate = useNavigate();
	const isMountedRef = useRef(true);

	useEffect(() => {
		if (isMountedRef) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setFormData({
						...formData,
						userRef: user.uid
					});
				} else {
					navigate('/sign-in');
				}
			});
		}
		return () => {
			isMountedRef.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMountedRef]);

	async function onSubmitHandler(event) {
		event.preventDefault();
		setIsLoading(true);
		if (discountedPrice >= regularPrice) {
			setIsLoading(false);
			toast.error('Discounted price needs to be less than regular price');
			return;
		}
		if (images.length > 6) {
			setIsLoading(false);
			toast.error('Max 6 image');
			return;
		}

		let geolocation = {};
		let location = {};
		if (geoLocationEnabled) {
			const res = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBXJaZ6kH9TEnrkdsc2oK9VyqW5MQN1hbY`
			);
			const data = await res.json();
			console.log(data);
			geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
			geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
			location =
				data.status === 'ZERO_RESULTS'
					? undefined
					: data.results[0]?.formatted_address;
			if (location === undefined || location.includes('undefined')) {
				setIsLoading(false);
				toast.error('Please enter a correct address');
				return;
			}
		} else {
			geolocation.lat = latitude;
			geolocation.lng = longitude;
		}

		// store img in firebase
		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

				const storageRef = ref(storage, 'images/' + fileName);

				const uploadTask = uploadBytesResumable(storageRef, image);

				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log('Upload is ' + progress + '% done');
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused');
								break;
							case 'running':
								console.log('Upload is running');
								break;
							default:
								break;
						}
					},
					(error) => {
						reject(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					}
				);
			});
		};

		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch(() => {
			setIsLoading(false);
			toast.error('Images not uploaded');
			return;
		});

		const formDataCopy = {
			...formData,
			imgUrls,
			geolocation,
			timestamp: serverTimestamp()
		};
		formDataCopy.location = address;
		delete formDataCopy.images;
		delete formDataCopy.address;

		location && (formDataCopy.location = location);
		!formDataCopy.offer && delete formDataCopy.discountedPrice;

		const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
		setIsLoading(false);
		toast.success('Listing saved and submitted');
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);
	}

	function onMutateHandler(event) {
		let boolean = null;
		if (event.target.value === 'true') {
			boolean = true;
		}
		if (event.target.value === 'false') {
			boolean = false;
		}
		// Files
		if (event.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: event.target.files
			}));
		}
		//Text/Booleans//Numbers
		if (!event.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[event.target.id]: boolean ?? event.target.value
			}));
		}
	}

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="profile">
			<header>
				<p className="pageHeader">Create a Listing</p>
			</header>
			<main>
				<form onSubmit={onSubmitHandler}>
					<label className="formLabel">Sell / Rent</label>
					<div className="formButton">
						<button
							type="button"
							className={type === 'sale' ? 'formButtonActive' : 'formButton'}
							id="type"
							value="sale"
							onClick={onMutateHandler}
						>
							Sell
						</button>
						<button
							type="button"
							className={type === 'rent' ? 'formButtonActive' : 'formButton'}
							id="type"
							value="rent"
							onClick={onMutateHandler}
						>
							Rent
						</button>
					</div>
					<label className="formLabel">Name</label>
					<input
						className="formInputName"
						type="text"
						id="name"
						value={name}
						onChange={onMutateHandler}
						maxLength="32"
						minLength="10"
						required
					/>

					<div className="formRooms flex">
						<div>
							<label className="formLabel">Bedrooms</label>
							<input
								className="formInputSmall"
								type="number"
								id="bedrooms"
								value={bedrooms}
								onChange={onMutateHandler}
								min="1"
								max="50"
								required
							/>
						</div>
						<div>
							<label className="formLabel">Bathrooms</label>
							<input
								className="formInputSmall"
								type="number"
								id="bathrooms"
								value={bathrooms}
								onChange={onMutateHandler}
								min="1"
								max="50"
								required
							/>
						</div>
					</div>

					<label className="formLabel">Parking spot</label>
					<div className="formButtons">
						<button
							className={parking ? 'formButtonActive' : 'formButton'}
							type="button"
							id="parking"
							value={true}
							onClick={onMutateHandler}
							min="1"
							max="50"
						>
							Yes
						</button>
						<button
							className={
								!parking && parking !== null ? 'formButtonActive' : 'formButton'
							}
							type="button"
							id="parking"
							value={false}
							onClick={onMutateHandler}
						>
							No
						</button>
					</div>

					<label className="formLabel">Furnished</label>
					<div className="formButtons">
						<button
							className={furnished ? 'formButtonActive' : 'formButton'}
							type="button"
							id="furnished"
							value={true}
							onClick={onMutateHandler}
						>
							Yes
						</button>
						<button
							className={
								!furnished && furnished !== null
									? 'formButtonActive'
									: 'formButton'
							}
							type="button"
							id="furnished"
							value={false}
							onClick={onMutateHandler}
						>
							No
						</button>
					</div>

					<label className="formLabel">Address</label>
					<textarea
						className="formInputAddress"
						type="text"
						id="address"
						value={address}
						onChange={onMutateHandler}
						required
					/>
					{!geoLocationEnabled && (
						<div className="formLatLng flex">
							<div>
								<label className="formLabel">Latitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="latitude"
									value={latitude}
									onChange={onMutateHandler}
									required
								/>
							</div>
							<div>
								<label className="formLabel">Longitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="longitude"
									value={longitude}
									onChange={onMutateHandler}
									required
								/>
							</div>
						</div>
					)}

					<label className="formLabel">Offer</label>
					<div className="formButtons">
						<button
							className={offer ? 'formButtonActive' : 'formButton'}
							type="button"
							id="offer"
							value={true}
							onClick={onMutateHandler}
						>
							Yes
						</button>
						<button
							className={
								!offer && offer !== null ? 'formButtonActive' : 'formButton'
							}
							type="button"
							id="offer"
							value={false}
							onClick={onMutateHandler}
						>
							No
						</button>
					</div>

					<label className="formLabel">Regular Price</label>
					<div className="formPriceDiv">
						<input
							className="formInputSmall"
							type="number"
							id="regularPrice"
							value={regularPrice}
							onChange={onMutateHandler}
							min="50"
							max="750000000"
							required
						/>
						{type === 'rent' && <p className="formPriceText">$ / Month</p>}
					</div>

					{offer && (
						<>
							<label className="formLabel">Discounted Price</label>
							<input
								className="formInputSmall"
								type="number"
								id="discountedPrice"
								value={discountedPrice}
								onChange={onMutateHandler}
								min="50"
								max="750000000"
								required={offer}
							/>
						</>
					)}

					<label className="formLabel">Images</label>
					<p className="imagesInfo">
						The first image will be the cover (max 6).
					</p>
					<input
						className="formInputFile"
						type="file"
						id="images"
						onChange={onMutateHandler}
						max="6"
						accept=".jpg,.png,.jpeg"
						multiple
						required
					/>
					<button type="submit" className="primaryButton createListingButton">
						Create Listing
					</button>
				</form>
			</main>
		</div>
	);
}
export default CreateListing;

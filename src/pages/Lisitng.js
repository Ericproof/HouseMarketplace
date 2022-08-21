import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Map from '../components/Map';
import ListingSlider from '../components/ListingSlider';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';

function Listing() {
	const [listing, setListing] = useState(null);
	const [isLoading, setIsloading] = useState(true);
	const [shareLink, setShareLink] = useState(false);

	const navigate = useNavigate();
	const params = useParams();
	const auth = getAuth();
	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				// console.log(docSnap.data());
				setListing(docSnap.data());
				setIsloading(false);
			}
		};
		fetchListing();
	}, [navigate, params.listingId]);
	if (isLoading) {
		return <Spinner />;
	}

	return (
		<main>
			<ListingSlider imgs={listing.imgUrls} />
			<div
				className="shareIconDiv"
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLink(true);
					setTimeout(() => {
						setShareLink(false);
					}, 2000);
				}}
			>
				<img src={shareIcon} alt="" />
			</div>
			{shareLink && <p className="linkCopied">Link Copied</p>}
			<div className="listingDetails">
				<p className="listingName">
					{listing.name}-{' $'}
					{listing.offer
						? listing.discountedPrice
						: listing.regularPrice
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				</p>
				<p className="listingLocation">{listing.location}</p>
				<p className="listingType">
					For {listing.type === 'rent' ? 'Rent' : 'Sale'}
				</p>
				{listing.offer && (
					<p className="discountPrice">
						${listing.regularPrice - listing.discountedPrice} discount
					</p>
				)}
				<ul className="listingDetailsList">
					<li>
						{listing.bedrooms > 1
							? `${listing.bedrooms} Bedrooms`
							: '1 Bedroom'}
					</li>
					<li>
						{listing.bathrooms > 1
							? `${listing.bathrooms} Bathrooms`
							: '1 Bathroom'}
					</li>
					<li>{listing.parking && 'Parking Spot'}</li>
					<li>{listing.furnished && 'Parking Spot'}</li>
				</ul>
				<p className="listingLocationTitle">Location</p>
				<Map listing={listing} />

				{auth.currentUser?.uid !== listing.userRef && (
					<Link
						to={`/contact/${listing.userRef}?listingName=${listing.name}`}
						className="primaryButton"
					>
						Contact Landlord
					</Link>
				)}
			</div>
		</main>
	);
}

export default Listing;

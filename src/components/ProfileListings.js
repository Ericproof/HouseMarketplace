import ListingItem from '../components/ListingItem';

function ProfileListings(props) {
	return (
		<>
			<p className="listingText">Your Listings</p>
			<ul className="listingsList">
				{props.listings.map((listing) => (
					<ListingItem
						key={listing.id}
						listing={listing.data}
						id={listing.id}
						onDelete={() => props.onDelete(listing.id)}
						// onEdit={() => onEdit(listing.id)}
					/>
				))}
			</ul>
		</>
	);
}
export default ProfileListings;

import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
// import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem(props) {
	return (
		<li className="categoryListing">
			<Link
				to={`/category/${props.listing.type}/${props.id}`}
				className="categoryListingLink"
			>
				<img
					src={props.listing.imgUrls[0]}
					alt={props.listing.name}
					className="categoryListingImg"
				/>
				<div className="categoryListingDetails">
					<p className="categoryListingLocation">{props.listing.location}</p>
					<p className="categoryListingName">{props.listing.name}</p>

					<p className="categoryListingPrice">
						$
						{props.listing.offer
							? props.listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							: props.listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						{props.listing.type === 'rent' && ' / Month'}
					</p>
					<div className="categoryListingInfoDiv">
						<img src={bedIcon} alt="bed" />
						<p className="categoryListingInfoText">
							{props.listing.bedrooms > 1
								? `${props.listing.bedrooms} Bedrooms`
								: '1 Bedroom'}
						</p>
						<img src={bathtubIcon} alt="bath" />
						<p className="categoryListingInfoText">
							{props.listing.bathrooms > 1
								? `${props.listing.bathrooms} Bathrooms`
								: '1 Bathroom'}
						</p>
					</div>
				</div>
			</Link>

			{props.onDelete && (
				<DeleteIcon
					className="removeIcon"
					// fill="rgb(231, 76,60)"
					onClick={() => props.onDelete(props.listing.id, props.listing.name)}
				/>
			)}

			{/* {props.onEdit && (
				<EditIcon className="editIcon" onClick={() => props.onEdit(props.id)} />
			)} */}
		</li>
	);
}

export default ListingItem;

import { useState, useEffect } from 'react';
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
// import Spinner from '../components/Spinner';
export function useFetchListings(
	isConditionSearch = false,
	limitNumber = 5,
	condition = {}
) {
	const [isLoading, setIsloading] = useState(true);
	const [listings, setListings] = useState(null);
	// const [lastFetchListings, setLastFetchListings] = useState(null);

	useEffect(() => {
		const fetchListing = async () => {
			try {
				const listingsRef = collection(db, 'listings');

				let q;
				// const lastVisiable = querySnap.docs[querySnap.docs.length - 1];
				// // setLastFetchListings(lastVisiable);
				if (isConditionSearch) {
					const field = condition.field;
					const option = condition.option;
					const value = condition.value;
					// console.log(field, option, value);
					q = query(
						listingsRef,
						where(field, option, value),
						orderBy('timestamp', 'desc'),
						limit(limitNumber)
					);
				} else {
					q = query(
						listingsRef,
						orderBy('timestamp', 'desc'),
						limit(limitNumber)
					);
				}
				const querySnap = await getDocs(q);
				let listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data()
					});
				});
				setListings(listings);
				setIsloading(false);
			} catch (error) {
				toast.error('Could not fetch listings');
			}
		};

		fetchListing();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [limitNumber, isConditionSearch, condition.value]);

	// if (isLoading) {
	// 	return <Spinner />;
	// }
	return { listings, isLoading };
}

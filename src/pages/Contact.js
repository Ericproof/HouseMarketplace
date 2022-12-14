import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
function Contact() {
	const [message, setMessage] = useState('');
	const [landlord, setLandlord] = useState(null);
	// eslint-disable-next-line no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();

	const params = useParams();
	// const navigate = useNavigate();
	// console.log(params.landlordId);

	useEffect(() => {
		const getLandlord = async () => {
			const docRef = doc(db, 'users', params.landlordId);

			const docSnap = await getDoc(docRef);
			// console.log(docSnap);
			if (docSnap.exists()) {
				setLandlord(docSnap.data());
			} else {
				toast.error('Could not find the landlord data');
				// navigate.goBack();
			}
		};
		getLandlord();
	}, [params.landlordId]);

	const onChangeHanlder = (event) => {
		setMessage(event.target.value);
	};

	return (
		<div className="pageContainer">
			<header>
				<p className="pageHeader">Contact Landlord</p>
			</header>
			{landlord !== null && (
				<main>
					<div className="contactLandlord">
						<p className="landlordName">Contact {landlord?.name}</p>
					</div>
					<form className="messageForm">
						<div className="messageDiv">
							<label htmlFor="message" className="messageLabel">
								Message
							</label>
							<textarea
								name="message"
								id="message"
								className="textarea"
								value={message}
								onChange={onChangeHanlder}
							></textarea>
						</div>
						<a
							href={`mailto:${landlord.email}?Subject=${searchParams.get(
								'listingName'
							)}&body=${message}`}
						>
							<button type="button" className="primaryButton">
								Send Message
							</button>
						</a>
					</form>
				</main>
			)}
		</div>
	);
}
export default Contact;

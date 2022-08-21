import { useNavigate } from 'react-router-dom';

import { useFetchListings } from '../hooks/useFetchListings';
import Spinner from './Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Slider() {
	const navigate = useNavigate();
	const fetchRes = useFetchListings();
	const { listings, isLoading } = fetchRes;
	// console.log(listings);
	if (isLoading) {
		return <Spinner />;
	}
	return (
		listings && (
			<>
				<p className="exploreHeading">Recommended</p>
				<Swiper slidesPerView={1} pagination={{ clickable: true }}>
					{listings.map(({ data, id }) => (
						<SwiperSlide
							key={id}
							onClick={() => navigate(`/category/${data.type}/${id}`)}
						>
							<div
								className="swiperSlideDiv"
								style={{
									background: `url(${data.imgUrls[0]})
                                center no-repeat`,
									backgroundSize: 'cover'
								}}
							>
								<p className="swiperSlideText">{data.name}</p>
								<p className="swiperSlidePrice">
									${data.discountedPrice ?? data.regularPrice}{' '}
									{data.type === 'rent' && '/ month'}
								</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</>
		)
	);
}
export default Slider;

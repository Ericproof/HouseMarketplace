import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
function ListingSlider(props) {
	return (
		<Swiper slidesPerView={1} pagination={{ clickable: true }}>
			{props.imgs.map((url, index) => {
				const slider = (
					<SwiperSlide key={index}>
						<div
							className="swiperSlideDiv"
							style={{
								background: `url(${props.imgs[index]}) center no-repeat`,
								backgroundSize: 'cover'
							}}
						></div>
					</SwiperSlide>
				);
				return slider;
			})}
		</Swiper>
	);
}
export default ListingSlider;

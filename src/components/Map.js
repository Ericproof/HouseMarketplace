import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

function Map(props) {
	return (
		<div className="leafletContainer">
			<MapContainer
				style={{ height: '100%', width: '100%' }}
				center={[props.listing.geolocation.lat, props.listing.geolocation.lng]}
				zoom={15}
				scrollWheelZoom={false}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
				/>
				<Marker
					position={[
						props.listing.geolocation.lat,
						props.listing.geolocation.lng
					]}
				>
					<Popup>{props.listing.location}</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}
export default Map;

import React, {useEffect} from "react";
import {Text, useWindowDimensions, View} from "react-native";
import {MapContainer, Marker, Polyline, Popup, TileLayer, useMap} from "react-leaflet";
import L from "leaflet";

import {IFlight} from "../models/interfaces";
import {interpolateGreatCircle} from "../utils/greatCircle";
import {flightMapStyles, getDynamicMapHeight} from "../styles/flightMap.styles";

if (typeof document !== "undefined") {
    const leafletCssUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    if (!document.querySelector(`link[href="${leafletCssUrl}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = leafletCssUrl;
        document.head.appendChild(link);
    }
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
    flights: IFlight[];
    selectedFlight?: IFlight | null;
    onSelectFlight?: (flight: IFlight) => void;
};

function FitMapToFlights({flights}: { flights: IFlight[] }) {
    const map = useMap();
    const {height, width} = useWindowDimensions();

    useEffect(() => {
        if (!flights.length) {
            map.setView([20, 0], 2);
            return;
        }

        const points = flights.flatMap((flight) => [
            [flight.departure.coordinates.latitude, flight.departure.coordinates.longitude] as [number, number],
            [flight.arrival.coordinates.latitude, flight.arrival.coordinates.longitude] as [number, number],
        ]);

        const bounds = L.latLngBounds(points);
        if (bounds.isValid()) {
            map.fitBounds(bounds, {padding: [40, 40]});
        }
    }, [flights, map]);

    return null;
}

export const FlightMap = ({flights, selectedFlight, onSelectFlight}: Props) => {
    const {height} = useWindowDimensions();

    return (
        <View style={[flightMapStyles.container, {height: getDynamicMapHeight(height)}]}>
            <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom style={flightMapStyles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitMapToFlights flights={flights}/>

                {flights.map((flight) => {
                    const path = interpolateGreatCircle(
                        flight.departure.coordinates,
                        flight.arrival.coordinates,
                        64
                    );

                    const selected = selectedFlight?._id?.toString() === flight._id?.toString();

                    return (
                        <React.Fragment key={flight._id?.toString() ?? `${flight.flightNumber}-${flight.date}`}>
                            <Polyline
                                positions={path.map((point) => [point.latitude, point.longitude] as [number, number])}
                                weight={selected ? 4 : 2}
                                color={selected ? "#1976d2" : "#4a90e2"}
                            />

                            <Marker
                                position={[
                                    flight.departure.coordinates.latitude,
                                    flight.departure.coordinates.longitude,
                                ]}
                                eventHandlers={{click: () => onSelectFlight?.(flight)}}
                            >
                                <Popup>
                                    <strong>{flight.departure.iataCode} Departure</strong>
                                    <br/>
                                    {flight.departure.name}
                                </Popup>
                            </Marker>

                            <Marker
                                position={[
                                    flight.arrival.coordinates.latitude,
                                    flight.arrival.coordinates.longitude,
                                ]}
                                eventHandlers={{click: () => onSelectFlight?.(flight)}}
                            >
                                <Popup>
                                    <strong>{flight.arrival.iataCode} Arrival</strong>
                                    <br/>
                                    {flight.arrival.name}
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                })}
            </MapContainer>

            {flights.length === 0 ? (
                <View style={flightMapStyles.emptyOverlay}>
                    <Text style={flightMapStyles.emptyText}>No flights to display</Text>
                </View>
            ) : null}
        </View>
    );
};

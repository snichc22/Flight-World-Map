import {SeatClass} from "./types";

// Koordinaten eines Ortes
export interface ICoordinates {
    latitude: number;
    longitude: number;
}

// Flughafen
export interface IAirport {
    iataCode: string;
    name: string;
    city: string;
    country: string;
    coordinates: ICoordinates;
}

// Flug-Eintrag
export interface IFlight {
    _id?: string;
    flightNumber: string;
    airline: string;
    departure: IAirport;
    arrival: IAirport;
    date: Date;
    durationMinutes: number;
    distanceKm: number;
    seatClass: SeatClass;
    notes?: string;
    createdAt?: Date;
}

// API Response Wrapper
export interface IApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Filter-State in der App
export interface IFlightFilter {
    searchQuery: string;
    seatClass: SeatClass | "All";
    year: number | null;
    country: string | null;
}

// Statistiken
export interface IFlightStats {
    totalFlights: number;
    totalDistanceKm: number;
    totalDurationMinutes: number;
    mostVisitedCountry: string;
    uniqueAirports: number;
}

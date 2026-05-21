// Koordinaten eines Ortes
interface Coordinates {
    latitude: number;
    longitude: number;
}

// Flughafen
interface Airport {
    iataCode: string;
    name: string;
    city: string;
    country: string;
    coordinates: Coordinates;
}

// Flug-Eintrag
interface Flight {
    _id?: string;
    flightNumber: string;
    airline: string;
    departure: Airport;
    arrival: Airport;
    date: string;
    durationMinutes: number;
    distanceKm: number;
    seatClass: SeatClass;
    notes?: string;
    createdAt?: string;
}

// API Response Wrapper
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Filter-State in der App
interface FlightFilter {
    searchQuery: string;
    seatClass: SeatClass | "All";
    year: number | null;
    country: string | null;
}

// Statistiken
interface FlightStats {
    totalFlights: number;
    totalDistanceKm: number;
    totalDurationMinutes: number;
    mostVisitedCountry: string;
    uniqueAirports: number;
}

export class IFlight {
}
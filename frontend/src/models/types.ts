import { IFlight } from "./interfaces";

// Seat-Klasse als Union Type
export type SeatClass = "Economy" | "Business" | "First";

// Request Body zum Erstellen eines Fluges
export type CreateFlightDTO = Omit<IFlight, "createdAt">;
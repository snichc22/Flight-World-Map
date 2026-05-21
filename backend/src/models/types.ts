// Seat-Klasse als Union Type
import {IFlight} from "./interfaces";

export type SeatClass = "Economy" | "Business" | "First";

// Request Body zum Erstellen eines Fluges
export type CreateFlightDTO = Omit<IFlight, "createdAt">;
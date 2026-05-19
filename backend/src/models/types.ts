// Seat-Klasse als Union Type
type SeatClass = "Economy" | "Business" | "First";

// Request Body zum Erstellen eines Fluges
type CreateFlightDTO = Omit<Flight, "_id" | "createdAt">;
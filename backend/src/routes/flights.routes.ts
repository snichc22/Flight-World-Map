import express, {Request, Response, Router} from "express";
import Flight from "../models/Flight";

const router: Router = express.Router();

// Alle Flüge abrufen (mit optionalen Query-Parametern: ?year=, ?class=, ?search=)
router.get("/", async (req: Request, res: Response) => {
    try {
        const { year, class: flightClass, search, country } = req.query;
        let query: any = {};

        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
            query.date = { $gte: startDate, $lte: endDate };
        }

        if (flightClass) {
            query.seatClass = flightClass;
        }

        if (country) {
            query.$or = [
                { "departure.country": country },
                { "arrival.country": country }
            ];
        }

        if (search) {
            const searchRegex = new RegExp(search as string, "i");
            const searchCriteria = [
                { flightNumber: searchRegex },
                { airline: searchRegex },
                { "departure.name": searchRegex },
                { "arrival.name": searchRegex },
                { "departure.iataCode": searchRegex },
                { "arrival.iataCode": searchRegex }
            ];

            if (query.$or) {
                query.$and = [ { $or: query.$or }, { $or: searchCriteria } ];
                delete query.$or;
            } else {
                query.$or = searchCriteria;
            }
        }

        const flights =
            await Flight.find(query).sort({ date: -1 });
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch flights" });
    }
});

// Statistiken abrufen (Gesamtdistanz, Anzahl, ...)
router.get("/stats", async (req: Request, res: Response) => {
    try {
        const stats = await Flight.aggregate([
            {
                $group: {
                    _id: null,
                    totalFlights: { $sum: 1 },
                    totalDistanceKm: {$sum: "$distanceKm"},
                    totalDurationMinutes: {$sum: "$durationMinutes"}
                }
            }
        ]);
        const flights = await Flight.find({}, "departure arrival").lean();

        const countries = flights.flatMap((flight) => [
            flight.departure.country,
            flight.arrival.country,
        ]);

        const countryCounts = countries.reduce<Record<string, number>>((acc, country) => {
            acc[country] = (acc[country] ?? 0) + 1;
            return acc;
        }, {});

        const airportCodes = new Set(
            flights.flatMap((flight) => [
                flight.departure.iataCode,
                flight.arrival.iataCode,
            ])
        );

        const mostVisitedCountry =
            Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";

        return res.json({
            success: true,
            data: stats.length > 0 ? {
                totalFlights: stats[0].totalFlights,
                totalDistanceKm: stats[0].totalDistanceKm,
                totalDurationMinutes: stats[0].totalDurationMinutes,
                mostVisitedCountry,
                uniqueAirports: airportCodes.size
            } : {
                totalFlights: 0,
                totalDistanceKm: 0,
                totalDurationMinutes: 0,
                mostVisitedCountry: "",
                uniqueAirports: 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// Einzelnen Flug abrufen
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) return res.status(404).json({ error: "Flight not found" });
        return res.json(flight);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch flight" });
    }
});

// Neuen Flug erstellen
router.post("/", async (req: Request, res: Response) => {
    try {
        const newFlight = new Flight(req.body);
        const savedFlight = await newFlight.save();
        res.status(201).json(savedFlight);
    } catch (error) {
        res.status(400).json({ error: "Failed to create flight", details: error });
    }
});

// Flug bearbeiten
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedFlight) return res.status(404).json({ error: "Flight not found" });
        return res.json(updatedFlight);
    } catch (error) {
        return res.status(400).json({ error: "Failed to update flight", details: error });
    }
});

// Flug löschen
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const deletedFlight = await Flight.findByIdAndDelete(req.params.id);
        if (!deletedFlight) return res.status(404).json({ error: "Flight not found" });
        return res.json({ message: "Flight deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete flight" });
    }
});

export default router;

import express, {Request, Response, Router} from "express";
import Flight from "../models/Flight";

const router: Router = express.Router();

// Alle Flüge abrufen (mit optionalen Query-Parametern: ?year=, ?class=, ?search=)
router.get("/", async (req: Request, res: Response) => {
    try {
        const { year, class: flightClass, search } = req.query;
        let query: any = {};

        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
            query.date = { $gte: startDate, $lte: endDate };
        }

        if (flightClass) {
            query.seatClass = flightClass;
        }

        if (search) {
            const searchRegex = new RegExp(search as string, "i");
            query.$or = [
                { flightNumber: searchRegex },
                { airline: searchRegex },
                { "departure.name": searchRegex },
                { "arrival.name": searchRegex }
            ];
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
                    totalDistance: { $sum: "$distanceKm" },
                    totalDuration: { $sum: "$durationMinutes" }
                }
            }
        ]);

        if (stats.length > 0) {
            res.json({
                totalFlights: stats[0].totalFlights,
                totalDistance: stats[0].totalDistance,
                totalDuration: stats[0].totalDuration
            });
        } else {
            res.json({ totalFlights: 0, totalDistance: 0, totalDuration: 0 });
        }
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

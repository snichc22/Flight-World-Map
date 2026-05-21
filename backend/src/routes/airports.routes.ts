import express, { Request, Response, Router } from "express";
import Airport from "../models/Airport";

const router: Router = express.Router();

// Flughäfen per IATA-Code oder Name suchen
router.get("/search", async (req: Request, res: Response) => {
    const searchQuery = req.query.q as string;

    if (!searchQuery) {
        return res.status(400).json({ error: "Missing search parameter 'q'" });
    }

    const airports = await Airport.find({
        $or: [
            { iataCode: new RegExp(searchQuery, "i") },
            { name: new RegExp(searchQuery, "i") }
        ]
    });
    return res.json(airports);
});

export default router;

import express, {Request, Response, Router} from "express";

const router: Router = express.Router();

// Alle Flüge abrufen (mit optionalen Query-Parametern: ?year=, ?class=, ?search=)
router.get("/", (req, res) => {
    const { year, class: flightClass, search } = req.query;


});

// Einzelnen Flug abrufen
router.get("/:id", (req, res) => {
    const flightId = req.params.id;


});

// Neuen Flug erstellen
router.post("/", (req, res) => {
    const newFlightData = req.body;



    res.status(201).send("New flight created");
});

// Flug bearbeiten
router.put("/:id", (req, res) => {
    const flightId = req.params.id;
    const updateData = req.body;



    res.send(`Updated flight with ID: ${flightId}`);
});

// Flug löschen
router.delete("/:id", (req, res) => {
    const flightId = req.params.id;


});

// Statistiken abrufen (Gesamtdistanz, Anzahl, ...)
router.get("/stats", (req, res) => {

});

export default router;

import app from "./app";
import connectDB from "./config/db";
import {Flight} from "./models/Flight";
import {mockFlights} from "./data/mock_flights";

const PORT = 4000;

const startServer = async () => {
    await connectDB();

    const count = await Flight.countDocuments();
    if (count === 0) {
        console.log("DB is empty. Seeding...");
        try {
            await Flight.insertMany(mockFlights);
            console.log("Mock flights seeded successfully.");
        } catch (error) {
            console.error("Error seeding DB:", error);
        }
    }

    app.listen(PORT, () => {
        console.log("Server running on port =", PORT);
    });
};

startServer();

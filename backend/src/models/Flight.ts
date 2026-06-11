import mongoose, {Schema} from "mongoose";
import {IFlight} from "./interfaces";
import {SeatClass} from "./types";
import {AirportSchema} from "./Airport";

const FlightSchema = new Schema<IFlight>(
    {
        flightNumber: {type: String, required: true, trim: true},
        airline: {type: String, required: true, trim: true},
        departure: {type: AirportSchema, required: true},
        arrival: {type: AirportSchema, required: true},
        date: {type: Date, required: true},
        durationMinutes: {type: Number, required: true, min: 0},
        distanceKm: {type: Number, required: true, min: 0},
        seatClass: {
            type: String,
            enum: ["Economy", "Business", "First"] as SeatClass[],
            required: true,
            default: "Economy",
        },
        notes: {type: String, trim: true},
    },
    {
        timestamps: {createdAt: "createdAt", updatedAt: false},
        collection: "flights",
    }
);

FlightSchema.index({date: -1});
FlightSchema.index({"departure.country": 1});
FlightSchema.index({"arrival.country": 1});
FlightSchema.index({airline: 1});

export const Flight =
    mongoose.model<IFlight>("Flight", FlightSchema);

export default Flight;
import mongoose, {Schema} from "mongoose";
import {IAirport} from "./interfaces";
import {CoordinatesSchema} from "./Flight";

const AirportSchema = new Schema<IAirport>(
    {
        iataCode: { type: String, required: true, uppercase: true, trim: true },
        name: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        coordinates: { type: CoordinatesSchema, required: true },
    },
    { _id: false }
);

export const Airport =
    mongoose.model<IAirport>("Airport", AirportSchema);

export default Airport;
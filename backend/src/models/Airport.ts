import mongoose, {Schema} from "mongoose";
import {IAirport, ICoordinates} from "./interfaces";

export const CoordinatesSchema = new Schema<ICoordinates>(
    {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    { _id: false }
);

export const AirportSchema = new Schema<IAirport>(
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
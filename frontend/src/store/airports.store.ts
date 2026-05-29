import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {IAirport} from "../models/interfaces";

export interface AirportsState {
    airports: IAirport[] | null;
    setAirports(airports: IAirport[]): void;
}

export const useAirportsStore =
    create<AirportsState>()(
        persist(
            (set) => ({
                airports: null,
                setAirports: (airports: IAirport[]) => set({airports})
            }),
            {
                name: "airports-storage",
            }
        )
    )
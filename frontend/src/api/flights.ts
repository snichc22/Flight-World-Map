import { api } from "./client";
import {IApiResponse, IFlight, IFlightStats} from "../models/interfaces";
import {CreateFlightDTO} from "../models/types";

export async function getFlights(params?: {
    year?: number | null;
    seatClass?: string;
    searchQuery?: string;
    country?: string | null;
}) {
    const response =
        await api.get<IApiResponse<IFlight[]>>("/flights", {
            params: {
                year: params?.year ?? undefined,
                class: params?.seatClass && params.seatClass !== "All" ? params.seatClass : undefined,
                search: params?.searchQuery ?? undefined,
                country: params?.country ?? undefined,
            },
        });
    return (response.data as any).data ?? response.data;
}

export async function createFlight(payload: CreateFlightDTO) {
    const response =
        await api.post<IApiResponse<IFlight>>("/flights", payload);
    return response.data.data;
}

export async function deleteFlight(id: string) {
    const response =
        await api.delete<IApiResponse<null>>(`/flights/${id}`);
    return response.data;
}

export async function getFlightStats() {
    const response =
        await api.get<IApiResponse<IFlightStats>>("/flights/stats");
    return response.data.data;
}
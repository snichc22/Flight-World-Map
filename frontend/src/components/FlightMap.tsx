import {IFlight} from "../models/interfaces";

type Props = {
    flights: IFlight[];
    selectedFlight?: IFlight | null;
    onSelectFlight?: (flight: IFlight) => void;
};

export const FlightMap = ({flights, selectedFlight, onSelectFlight}: Props) => {
    return (
        <></>
    );
};
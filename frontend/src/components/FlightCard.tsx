import React from "react";
import {IFlight} from "../models/interfaces";

type Props = {
    flight: IFlight;
    selected?: boolean;
    onPress?: () => void;
    onDelete?: () => void;
};

export const FlightCard = ({flight, selected, onPress, onDelete}: Props) => {
    return (
        <></>
    );
}
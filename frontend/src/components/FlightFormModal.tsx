import {CreateFlightDTO} from "../models/types";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (flight: CreateFlightDTO) => Promise<void> | void;
};

export const FlightFormModal = ({visible, onClose, onSubmit}: Props) => {
    return (
        <></>
    );
};
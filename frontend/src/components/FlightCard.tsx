import React from "react";
import {IFlight} from "../models/interfaces";
import {Pressable, Text, View} from "react-native";
import {styles} from "../styles/flightCard.styles";

type Props = {
    flight: IFlight;
    selected?: boolean;
    darkMode?: boolean;
    onPress?: () => void;
    onDelete?: () => void;
};

export const FlightCard = ({flight, selected, darkMode, onPress, onDelete}: Props) => {
    return (
        <View style={[
            styles.card,
            darkMode && styles.cardDark,
            selected && styles.cardSelected,
            selected && darkMode && styles.cardSelectedDark,
        ]}>
            <View style={styles.cardContainer}>
                <Pressable onPress={onPress} style={styles.cardContent}>
                    <Text style={[styles.flightTitle, darkMode && styles.flightTitleDark]}>
                        {flight.flightNumber} - {flight.airline}
                    </Text>
                    <Text style={[styles.routeText, darkMode && styles.routeTextDark]}>
                        {flight.departure.iataCode} --{">"} {flight.arrival.iataCode}
                    </Text>
                    <Text style={[styles.detailText, darkMode && styles.detailTextDark]}>
                        {flight.departure.city}, {flight.departure.country} --{">"} {flight.arrival.city}, {" "}
                        {flight.arrival.country}
                    </Text>
                    <Text style={[styles.detailText, darkMode && styles.detailTextDark]}>
                        {new Date(flight.date).toLocaleDateString()} - {flight.seatClass}
                    </Text>
                    <Text style={[styles.detailText, darkMode && styles.detailTextDark]}>
                        {flight.distanceKm.toFixed(0)} km - {flight.durationMinutes} min
                    </Text>
                    {!!flight.notes &&
                        <Text style={[styles.notesText, darkMode && styles.notesTextDark]}>{flight.notes}</Text>}
                </Pressable>

                {onDelete ? (
                    <Pressable onPress={onDelete} style={styles.deleteBtn}>
                        <Text style={styles.deleteBtnText}>Delete</Text>
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
};

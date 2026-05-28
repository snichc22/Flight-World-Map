import React from "react";
import {IFlight} from "../models/interfaces";
import {Pressable, Text, View} from "react-native";
import {styles} from "../styles/flightCard.styles";

type Props = {
    flight: IFlight;
    selected?: boolean;
    onPress?: () => void;
    onDelete?: () => void;
};

export const FlightCard = ({flight, selected, onPress, onDelete}: Props) => {
    return (
        <>
            <Pressable
                onPress={onPress}
                style={[styles.card, selected && styles.cardSelected]}
            >
                <View style={styles.cardContainer}>
                    <View style={styles.cardContent}>
                        <Text style={styles.flightTitle}>
                            {flight.flightNumber} - {flight.airline}
                        </Text>
                        <Text style={styles.routeText}>
                            {flight.departure.iataCode} --{">"} {flight.arrival.iataCode}
                        </Text>
                        <Text style={styles.detailText}>
                            {flight.departure.city}, {flight.departure.country} --{">"} {flight.arrival.city},{" "}
                            {flight.arrival.country}
                        </Text>
                        <Text style={styles.detailText}>
                            {new Date(flight.date).toLocaleDateString()} - {flight.seatClass}
                        </Text>
                        <Text style={styles.detailText}>
                            {flight.distanceKm.toFixed(0)} km - {flight.durationMinutes} min
                        </Text>
                        {!!flight.notes && (
                            <Text style={styles.notesText}>{flight.notes}</Text>
                        )}
                    </View>

                    {onDelete ? (
                        <Pressable
                            onPress={onDelete}
                            style={styles.deleteBtn}
                        >
                            <Text style={styles.deleteBtnText}>Delete</Text>
                        </Pressable>
                    ) : null}
                </View>
            </Pressable>
        </>
    );
}
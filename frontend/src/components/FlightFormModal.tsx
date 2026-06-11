import React, {useMemo, useState, useEffect} from "react";
import {Modal, Pressable, ScrollView, Text, TextInput, View, Platform} from "react-native";
import {Picker} from "@react-native-picker/picker";
const StyledPicker = Picker as any;
import DateTimePicker from "@react-native-community/datetimepicker";
import {CreateFlightDTO, SeatClass} from "../models/types";
import {IAirport} from "../models/interfaces";
import {styles} from "../styles/flightFormModal.styles";
import {calculateGreatCircleDistanceKm} from "../utils/greatCircle";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (flight: CreateFlightDTO) => Promise<void> | void;
};

const EMPTY_AIRPORT: IAirport = {
    iataCode: "",
    name: "",
    city: "",
    country: "",
    coordinates: {latitude: 0, longitude: 0},
};

// const {airports, setAirports} = useAirportsStore();
let airports: any[] | null = null;

function estimateDurationMinutes(distanceKm: number) {
    const averageCruiseSpeedKmH = 850;
    const taxiAndBufferMinutes = 30;

    return Math.round((distanceKm / averageCruiseSpeedKmH) * 60 + taxiAndBufferMinutes);
}

export function FlightFormModal({visible, onClose, onSubmit}: Props) {
    const [flightNumber, setFlightNumber] = useState("");
    const [airline, setAirline] = useState("");
    const [departure, setDeparture] = useState<IAirport>(EMPTY_AIRPORT);
    const [arrival, setArrival] = useState<IAirport>(EMPTY_AIRPORT);
    const [date, setDate] = useState(new Date());
    const [durationMinutes, setDurationMinutes] = useState("0");
    const [distanceKm, setDistanceKm] = useState("0");
    const [seatClass, setSeatClass] = useState<SeatClass>("Economy");
    const [notes, setNotes] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (departure.iataCode.trim().length === 3) {
            fetchAirportInfo(departure.iataCode.trim(), true);
        }
    }, [departure.iataCode]);

    useEffect(() => {
        if (arrival.iataCode.trim().length === 3) {
            fetchAirportInfo(arrival.iataCode.trim(), false);
        }
    }, [arrival.iataCode]);

    useEffect(() => {
        const coordinatesAreReady =
            departure.iataCode.trim().length === 3 &&
            arrival.iataCode.trim().length === 3;

        if (coordinatesAreReady) {
            const calculatedDistanceKm = calculateGreatCircleDistanceKm(departure.coordinates, arrival.coordinates);
            setDistanceKm(String(Math.round(calculatedDistanceKm)));
            setDurationMinutes(String(estimateDurationMinutes(calculatedDistanceKm)));
        }
    }, [
        arrival.coordinates.latitude,
        arrival.coordinates.longitude,
        arrival.iataCode,
        departure.coordinates.latitude,
        departure.coordinates.longitude,
        departure.iataCode,
    ]);

    async function fetchAirportInfo(iataCode: string, isDeparture: boolean) {
        try {
            if (airports === null) {
                const res = await fetch("https://raw.githubusercontent.com/mwgg/Airports/master/airports.json");
                const airportData = await res.json();
                airports = Array.isArray(airportData) ? airportData : Object.values(airportData);
            }

            const upperIata = iataCode.toUpperCase();
            const airport = airports.find((a) => a.iata === upperIata);

            if (airport) {
                const newInfo = {
                    name: airport.name || "",
                    city: airport.city || "",
                    country: airport.country || "",
                    coordinates: {
                        latitude: airport.lat || 0,
                        longitude: airport.lon || 0,
                    }
                };

                if (isDeparture) {
                    setDeparture(prev => ({...prev, ...newInfo}));
                } else {
                    setArrival(prev => ({...prev, ...newInfo}));
                }
            }
        } catch (e) {
            console.log("Failed to fetch airport data", e);
        }
    }

    const canSubmit = useMemo(() => {
        return (
            flightNumber.trim().length > 0 &&
            airline.trim().length > 0 &&
            departure.iataCode.trim().length === 3 &&
            arrival.iataCode.trim().length === 3
        );
    }, [airline, arrival.iataCode, departure.iataCode, flightNumber]);

    async function handleSubmit() {
        if (!canSubmit) return;

        await onSubmit({
            flightNumber: flightNumber.trim(),
            airline: airline.trim(),
            departure,
            arrival,
            date: date as any,
            durationMinutes: Number(durationMinutes) || 0,
            distanceKm: Number(distanceKm) || 0,
            seatClass,
            notes: notes.trim() || undefined,
        } as CreateFlightDTO);

        setFlightNumber("");
        setAirline("");
        setDeparture(EMPTY_AIRPORT);
        setArrival(EMPTY_AIRPORT);
        setDate(new Date());
        setDurationMinutes("0");
        setDistanceKm("0");
        setSeatClass("Economy");
        setNotes("");
        onClose();
    }

    return (
        <>
            <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.modalTitle}>
                        Add Flight
                    </Text>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Flight Number">
                                <TextInput value={flightNumber} onChangeText={setFlightNumber} style={styles.inputStyle}/>
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Airline">
                                <TextInput value={airline} onChangeText={setAirline} style={styles.inputStyle}/>
                            </Field>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Departure</Text>
                    <View style={styles.row}>
                        <View style={styles.flex04}>
                            <Field label="IATA">
                                <TextInput
                                    value={departure.iataCode}
                                    onChangeText={(v) => setDeparture({...departure, iataCode: v.toUpperCase()})}
                                    style={styles.inputStyle}
                                    maxLength={3}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Name">
                                <TextInput
                                    value={departure.name}
                                    onChangeText={(v) => setDeparture({...departure, name: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="City">
                                <TextInput
                                    value={departure.city}
                                    onChangeText={(v) => setDeparture({...departure, city: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Country">
                                <TextInput
                                    value={departure.country}
                                    onChangeText={(v) => setDeparture({...departure, country: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Latitude">
                                <TextInput
                                    value={String(departure.coordinates.latitude)}
                                    onChangeText={(v) =>
                                        setDeparture({
                                            ...departure,
                                            coordinates: {...departure.coordinates, latitude: Number(v) || 0},
                                        })
                                    }
                                    keyboardType="numeric"
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Longitude">
                                <TextInput
                                    value={String(departure.coordinates.longitude)}
                                    onChangeText={(v) =>
                                        setDeparture({
                                            ...departure,
                                            coordinates: {...departure.coordinates, longitude: Number(v) || 0},
                                        })
                                    }
                                    keyboardType="numeric"
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Arrival</Text>
                    <View style={styles.row}>
                        <View style={styles.flex04}>
                            <Field label="IATA">
                                <TextInput
                                    value={arrival.iataCode}
                                    onChangeText={(v) => setArrival({...arrival, iataCode: v.toUpperCase()})}
                                    style={styles.inputStyle}
                                    maxLength={3}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Name">
                                <TextInput
                                    value={arrival.name}
                                    onChangeText={(v) => setArrival({...arrival, name: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="City">
                                <TextInput
                                    value={arrival.city}
                                    onChangeText={(v) => setArrival({...arrival, city: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Country">
                                <TextInput
                                    value={arrival.country}
                                    onChangeText={(v) => setArrival({...arrival, country: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Latitude">
                                <TextInput
                                    value={String(arrival.coordinates.latitude)}
                                    onChangeText={(v) =>
                                        setArrival({
                                            ...arrival,
                                            coordinates: {...arrival.coordinates, latitude: Number(v) || 0},
                                        })
                                    }
                                    keyboardType="numeric"
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Longitude">
                                <TextInput
                                    value={String(arrival.coordinates.longitude)}
                                    onChangeText={(v) =>
                                        setArrival({
                                            ...arrival,
                                            coordinates: {...arrival.coordinates, longitude: Number(v) || 0},
                                        })
                                    }
                                    keyboardType="numeric"
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Flight Details</Text>
                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Date">
                                {Platform.OS === 'web' ? (
                                    React.createElement('input', {
                                        type: 'date',
                                        value: new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 10),
                                        onChange: (e: any) => {
                                            if (e.target.value) {
                                                setDate(new Date(e.target.value));
                                            }
                                        },
                                        style: styles.dateInputWeb as any
                                    })
                                ) : (
                                    <>
                                        <Pressable
                                            onPress={() => setShowDatePicker(true)}
                                            style={[styles.inputStyle, styles.datePressable]}
                                        >
                                            <Text style={styles.dateText}>
                                                {new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000))
                                                    .toISOString()
                                                    .slice(0, 10)}
                                            </Text>
                                        </Pressable>
                                        {showDatePicker && (
                                            <DateTimePicker
                                                value={date}
                                                mode="date"
                                                display="default"
                                                onChange={(e, selectedDate) => {
                                                    if (Platform.OS === 'android') {
                                                        setShowDatePicker(false);
                                                    }
                                                    if (selectedDate) setDate(selectedDate);
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Seat Class">
                                <View style={[styles.pickerWrap, styles.pickerWrapCentered]}>
                                    <StyledPicker style={styles.pickerStyle} selectedValue={seatClass} onValueChange={(v: SeatClass) => setSeatClass(v)}>
                                        <StyledPicker.Item label="Economy" value="Economy"/>
                                        <StyledPicker.Item label="Business" value="Business"/>
                                        <StyledPicker.Item label="First" value="First"/>
                                    </StyledPicker>
                                </View>
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Duration (min)">
                                <TextInput
                                    value={durationMinutes}
                                    onChangeText={setDurationMinutes}
                                    keyboardType="numeric"
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Distance (km)">
                                <TextInput
                                    value={distanceKm}
                                    editable={false}
                                    style={[styles.inputStyle, styles.readOnlyInput]}
                                />
                            </Field>
                        </View>
                    </View>

                    <Field label="Notes">
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            style={[styles.inputStyle, styles.notesInput]}
                            multiline
                        />
                    </Field>

                    <View style={styles.buttonRow}>
                        <Pressable onPress={onClose} style={[styles.buttonStyle, styles.cancelButton]}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleSubmit}
                            disabled={!canSubmit}
                            style={[
                                styles.buttonStyle,
                                canSubmit ? styles.saveButtonEnabled : styles.saveButtonDisabled,
                            ]}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </Modal>
        </>
    );
}

function Field({label, children}: { label: string; children: React.ReactNode }) {
    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>
            {children}
        </View>
    );
}

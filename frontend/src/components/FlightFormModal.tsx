import React, {useEffect, useMemo, useState} from "react";
import {Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {CreateFlightDTO, SeatClass} from "../models/types";
import {IAirport} from "../models/interfaces";
import {styles} from "../styles/flightFormModal.styles";
import {calculateGreatCircleDistanceKm} from "../utils/greatCircle";

const StyledPicker = Picker as any;

type Props = {
    visible: boolean;
    darkMode?: boolean;
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

export function FlightFormModal({visible, darkMode, onClose, onSubmit}: Props) {
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

    const inputStyle = [styles.inputStyle, darkMode && styles.inputStyleDark];
    const readOnlyInputStyle = [styles.inputStyle, styles.readOnlyInput, darkMode && styles.readOnlyInputDark];
    const datePressableStyle = [styles.inputStyle, styles.datePressable, darkMode && styles.inputStyleDark];
    const dateTextStyle = [styles.dateText, darkMode && styles.dateTextDark];
    const pickerWrapStyle = [styles.pickerWrap, styles.pickerWrapCentered, darkMode && styles.pickerWrapDark];
    const pickerStyle = [styles.pickerStyle, darkMode && styles.pickerStyleDark];
    const pickerItemColor = darkMode ? "#f4f7fb" : undefined;
    const placeholderColor = darkMode ? "#a8b3c7" : undefined;
    const dateInputWebStyle = {
        ...StyleSheet.flatten([
            styles.dateInputWeb,
            darkMode && styles.dateInputWebDark,
        ]),
        ...(darkMode ? {colorScheme: "dark"} : {}),
    };

    return (
        <>
            <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
                <ScrollView
                    style={[styles.modalBody, darkMode && styles.modalBodyDark]}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>
                        Add Flight
                    </Text>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Flight Number" darkMode={darkMode}>
                                <TextInput value={flightNumber} onChangeText={setFlightNumber}
                                           placeholderTextColor={placeholderColor} style={inputStyle}/>
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Airline" darkMode={darkMode}>
                                <TextInput value={airline} onChangeText={setAirline}
                                           placeholderTextColor={placeholderColor} style={inputStyle}/>
                            </Field>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Departure</Text>
                    <View style={styles.row}>
                        <View style={styles.flex04}>
                            <Field label="IATA" darkMode={darkMode}>
                                <TextInput
                                    value={departure.iataCode}
                                    onChangeText={(v) => setDeparture({...departure, iataCode: v.toUpperCase()})}
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                    maxLength={3}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Name" darkMode={darkMode}>
                                <TextInput
                                    value={departure.name}
                                    onChangeText={(v) => setDeparture({...departure, name: v})}
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="City" darkMode={darkMode}>
                                <TextInput
                                    value={departure.city}
                                    onChangeText={(v) => setDeparture({...departure, city: v})}
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Country" darkMode={darkMode}>
                                <TextInput
                                    value={departure.country}
                                    onChangeText={(v) => setDeparture({...departure, country: v})}
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Latitude" darkMode={darkMode}>
                                <TextInput
                                    value={String(departure.coordinates.latitude)}
                                    onChangeText={(v) =>
                                        setDeparture({
                                            ...departure,
                                            coordinates: {...departure.coordinates, latitude: Number(v) || 0},
                                        })
                                    }
                                    keyboardType="numeric"
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Longitude" darkMode={darkMode}>
                                <TextInput
                                    value={String(departure.coordinates.longitude)}
                                    onChangeText={(v) =>
                                        setDeparture({
                                            ...departure,
                                            coordinates: {...departure.coordinates, longitude: Number(v) || 0},
                                        })
                                    }
                                    keyboardType="numeric"
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Arrival</Text>
                    <View style={styles.row}>
                        <View style={styles.flex04}>
                            <Field label="IATA" darkMode={darkMode}>
                                <TextInput
                                    value={arrival.iataCode}
                                    onChangeText={(v) => setArrival({...arrival, iataCode: v.toUpperCase()})}
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                    maxLength={3}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Name" darkMode={darkMode}>
                                <TextInput
                                    value={arrival.name}
                                    onChangeText={(v) => setArrival({...arrival, name: v})}
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="City" darkMode={darkMode}>
                                <TextInput
                                    value={arrival.city}
                                    onChangeText={(v) => setArrival({...arrival, city: v})}
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Country" darkMode={darkMode}>
                                <TextInput
                                    value={arrival.country}
                                    onChangeText={(v) => setArrival({...arrival, country: v})}
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Latitude" darkMode={darkMode}>
                                <TextInput
                                    value={String(arrival.coordinates.latitude)}
                                    onChangeText={(v) =>
                                        setArrival({
                                            ...arrival,
                                            coordinates: {...arrival.coordinates, latitude: Number(v) || 0},
                                        })
                                    }
                                    keyboardType="numeric"
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Longitude" darkMode={darkMode}>
                                <TextInput
                                    value={String(arrival.coordinates.longitude)}
                                    onChangeText={(v) =>
                                        setArrival({
                                            ...arrival,
                                            coordinates: {...arrival.coordinates, longitude: Number(v) || 0},
                                        })
                                    }
                                    keyboardType="numeric"
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Flight Details</Text>
                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Date" darkMode={darkMode}>
                                {Platform.OS === 'web' ? (
                                    React.createElement('input', {
                                        type: 'date',
                                        value: new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 10),
                                        onChange: (e: any) => {
                                            if (e.target.value) {
                                                setDate(new Date(e.target.value));
                                            }
                                        },
                                        style: dateInputWebStyle as any
                                    })
                                ) : (
                                    <>
                                        <Pressable
                                            onPress={() => setShowDatePicker(true)}
                                            style={datePressableStyle}
                                        >
                                            <Text style={dateTextStyle}>
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
                            <Field label="Seat Class" darkMode={darkMode}>
                                <View style={pickerWrapStyle}>
                                    <StyledPicker
                                        style={pickerStyle}
                                        dropdownIconColor={pickerItemColor}
                                        selectedValue={seatClass}
                                        onValueChange={(v: SeatClass) => setSeatClass(v)}
                                    >
                                        <StyledPicker.Item label="Economy" value="Economy" color={pickerItemColor}/>
                                        <StyledPicker.Item label="Business" value="Business" color={pickerItemColor}/>
                                        <StyledPicker.Item label="First" value="First" color={pickerItemColor}/>
                                    </StyledPicker>
                                </View>
                            </Field>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Field label="Duration (min)" darkMode={darkMode}>
                                <TextInput
                                    value={durationMinutes}
                                    onChangeText={setDurationMinutes}
                                    keyboardType="numeric"
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={styles.flex1}>
                            <Field label="Distance (km)" darkMode={darkMode}>
                                <TextInput
                                    value={distanceKm}
                                    editable={false}
                                    style={readOnlyInputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <Field label="Notes" darkMode={darkMode}>
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholderTextColor={placeholderColor}
                            style={[styles.inputStyle, styles.notesInput, darkMode && styles.inputStyleDark]}
                            multiline
                        />
                    </Field>

                    <View style={styles.buttonRow}>
                        <Pressable onPress={onClose}
                                   style={[styles.buttonStyle, styles.cancelButton, darkMode && styles.cancelButtonDark]}>
                            <Text
                                style={[styles.cancelButtonText, darkMode && styles.cancelButtonTextDark]}>Cancel</Text>
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

function Field({label, darkMode, children}: { label: string; darkMode?: boolean; children: React.ReactNode }) {
    return (
        <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, darkMode && styles.fieldLabelDark]}>{label}</Text>
            {children}
        </View>
    );
}

import React, {useMemo, useState} from "react";
import {Modal, Pressable, ScrollView, Text, TextInput, View,} from "react-native";
import {Picker} from "@react-native-picker/picker";
const StyledPicker = Picker as any;
import DateTimePicker from "@react-native-community/datetimepicker";
import {CreateFlightDTO, SeatClass} from "../models/types";
import {IAirport} from "../models/interfaces";
import {styles} from "../styles/flightFormModal.styles";

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
                <ScrollView contentContainerStyle={{padding: 18, paddingBottom: 40}}>
                    <Text style={{fontSize: 22, fontWeight: "800", marginBottom: 14}}>
                        Add Flight
                    </Text>

                    <View style={{flexDirection: "row", gap: 10}}>
                        <View style={{flex: 1}}>
                            <Field label="Flight Number">
                                <TextInput value={flightNumber} onChangeText={setFlightNumber} style={styles.inputStyle}/>
                            </Field>
                        </View>
                        <View style={{flex: 1}}>
                            <Field label="Airline">
                                <TextInput value={airline} onChangeText={setAirline} style={styles.inputStyle}/>
                            </Field>
                        </View>
                    </View>

                    <Text style={{fontWeight: "700", marginTop: 10, marginBottom: 10, fontSize: 16, color: "#102a43"}}>Departure</Text>
                    <View style={{flexDirection: "row", gap: 10}}>
                        <View style={{flex: 0.4}}>
                            <Field label="IATA">
                                <TextInput
                                    value={departure.iataCode}
                                    onChangeText={(v) => setDeparture({...departure, iataCode: v.toUpperCase()})}
                                    style={styles.inputStyle}
                                    maxLength={3}
                                />
                            </Field>
                        </View>
                        <View style={{flex: 1}}>
                            <Field label="Name">
                                <TextInput
                                    value={departure.name}
                                    onChangeText={(v) => setDeparture({...departure, name: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={{flexDirection: "row", gap: 10}}>
                        <View style={{flex: 1}}>
                            <Field label="City">
                                <TextInput
                                    value={departure.city}
                                    onChangeText={(v) => setDeparture({...departure, city: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={{flex: 1}}>
                            <Field label="Country">
                                <TextInput
                                    value={departure.country}
                                    onChangeText={(v) => setDeparture({...departure, country: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={{flexDirection: "row", gap: 10}}>
                        <View style={{flex: 1}}>
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
                        <View style={{flex: 1}}>
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

                    <Text style={{fontWeight: "700", marginTop: 10, marginBottom: 10, fontSize: 16, color: "#102a43"}}>Arrival</Text>
                    <View style={{flexDirection: "row", gap: 10}}>
                        <View style={{flex: 0.4}}>
                            <Field label="IATA">
                                <TextInput
                                    value={arrival.iataCode}
                                    onChangeText={(v) => setArrival({...arrival, iataCode: v.toUpperCase()})}
                                    style={styles.inputStyle}
                                    maxLength={3}
                                />
                            </Field>
                        </View>
                        <View style={{flex: 1}}>
                            <Field label="Name">
                                <TextInput
                                    value={arrival.name}
                                    onChangeText={(v) => setArrival({...arrival, name: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={{flexDirection: "row", gap: 10}}>
                        <View style={{flex: 1}}>
                            <Field label="City">
                                <TextInput
                                    value={arrival.city}
                                    onChangeText={(v) => setArrival({...arrival, city: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={{flex: 1}}>
                            <Field label="Country">
                                <TextInput
                                    value={arrival.country}
                                    onChangeText={(v) => setArrival({...arrival, country: v})}
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <View style={{flexDirection: "row", gap: 10}}>
                        <View style={{flex: 1}}>
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
                        <View style={{flex: 1}}>
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

                    <Text style={{fontWeight: "700", marginTop: 10, marginBottom: 10, fontSize: 16, color: "#102a43"}}>Flight Details</Text>
                    <View style={{flexDirection: "row", gap: 10}}>
                        <View style={{flex: 1}}>
                            <Field label="Date">
                                <Pressable
                                    onPress={() => setShowDatePicker(true)}
                                    style={[styles.inputStyle, {justifyContent: "center", minHeight: 46}]}
                                >
                                    <Text>
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
                                        onChange={(_, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) setDate(selectedDate);
                                        }}
                                    />
                                )}
                            </Field>
                        </View>
                        <View style={{flex: 1}}>
                            <Field label="Seat Class">
                                <View style={[styles.pickerWrap, {height: 46, justifyContent: "center"}]}>
                                    <StyledPicker style={{height: 46, width: "100%", color: "#102a43"}} selectedValue={seatClass} onValueChange={(v: SeatClass) => setSeatClass(v)}>
                                        <StyledPicker.Item label="Economy" value="Economy"/>
                                        <StyledPicker.Item label="Business" value="Business"/>
                                        <StyledPicker.Item label="First" value="First"/>
                                    </StyledPicker>
                                </View>
                            </Field>
                        </View>
                    </View>

                    <View style={{flexDirection: "row", gap: 10}}>
                        <View style={{flex: 1}}>
                            <Field label="Duration (min)">
                                <TextInput
                                    value={durationMinutes}
                                    onChangeText={setDurationMinutes}
                                    keyboardType="numeric"
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                        <View style={{flex: 1}}>
                            <Field label="Distance (km)">
                                <TextInput
                                    value={distanceKm}
                                    onChangeText={setDistanceKm}
                                    keyboardType="numeric"
                                    style={styles.inputStyle}
                                />
                            </Field>
                        </View>
                    </View>

                    <Field label="Notes">
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            style={[styles.inputStyle, {minHeight: 90, textAlignVertical: "top"}]}
                            multiline
                        />
                    </Field>

                    <View style={{flexDirection: "row", gap: 12, marginTop: 10}}>
                        <Pressable onPress={onClose} style={[styles.buttonStyle, {backgroundColor: "#eee"}]}>
                            <Text style={{fontWeight: "700"}}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleSubmit}
                            disabled={!canSubmit}
                            style={[
                                styles.buttonStyle,
                                {backgroundColor: canSubmit ? "#1976d2" : "#9ebee0"},
                            ]}
                        >
                            <Text style={{fontWeight: "700", color: "#fff"}}>Save</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </Modal>
        </>
    );
}

function Field({label, children}: { label: string; children: React.ReactNode }) {
    return (
        <View style={{marginBottom: 12}}>
            <Text style={{fontWeight: "700", marginBottom: 6}}>{label}</Text>
            {children}
        </View>
    );
}


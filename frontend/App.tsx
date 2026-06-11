import React, {useEffect, useMemo, useState} from "react";
import {createFlight, deleteFlight, getFlights, getFlightStats} from "./src/api/flights";
import {FlightMap} from "./src/components/FlightMap";
import {FlightCard} from "./src/components/FlightCard";
import {FlightFormModal} from "./src/components/FlightFormModal";
import {IFlight, IFlightFilter, IFlightStats} from "./src/models/interfaces";
import {CreateFlightDTO} from "./src/models/types";
import {ActivityIndicator, Alert, Animated, Platform, Pressable, SafeAreaView, Text, TextInput, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {styles} from "./src/styles/app.styles";

const StyledPicker = Picker as any;
const ScrollView = Animated.ScrollView;

function getFlightCountries(flights: IFlight[]) {
    return Array.from(
        new Set(
            flights.flatMap((flight) => [
                flight.departure.country,
                flight.arrival.country,
            ]).filter(Boolean)
        )
    ).sort((a, b) => a.localeCompare(b));
}

export default function App() {
    const [flights, setFlights] = useState<IFlight[]>([]);
    const [filter, setFilter] = useState<IFlightFilter>({
        searchQuery: "",
        seatClass: "All",
        year: null,
        country: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<IFlight | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [stats, setStats] = useState<IFlightStats | null>(null);
    const [yearInput, setYearInput] = useState("");
    const [countries, setCountries] = useState<string[]>([]);

    async function loadFlights() {
        setLoading(true);
        setError(null);

        try {
            const data = await getFlights(filter);
            console.log("Flights loaded:", data);
            setFlights(data);
            setSelectedFlight((prev) => {
                if (!prev) return data[0] ?? null;
                return data.find((f: IFlight) => f._id === prev._id) ?? data[0] ?? null;
            });
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e.message ?? "Failed to load flights");
        } finally {
            setLoading(false);
        }
    }

    async function loadStats() {
        try {
            const data = await getFlightStats();
            setStats(data);
            console.log("Stats loaded:", data);
        } catch (e) {
            console.log("Stats error:", e);
        }
    }

    async function loadCountries() {
        try {
            const allFlights = await getFlights();
            setCountries(getFlightCountries(allFlights));
        } catch (e) {
            console.log("Countries error:", e);
        }
    }

    useEffect(() => {
        loadFlights();
        loadStats();
    }, [filter.searchQuery, filter.seatClass, filter.year, filter.country]);

    useEffect(() => {
        loadCountries();
    }, []);

    useEffect(() => {
        if (filter.country && countries.length > 0 && !countries.includes(filter.country)) {
            setFilter((prev) => ({...prev, country: null}));
        }
    }, [countries, filter.country]);

    async function handleCreateFlight(payload: CreateFlightDTO) {
        try {
            await createFlight(payload);
            await loadFlights();
            await loadStats();
            await loadCountries();
        } catch (e: any) {
            console.error("Error", e?.response?.data?.message ?? e.message ?? "Could not save flight");
        }
    }

    async function handleDelete(id?: string) {
        if (!id) return;
        try {
            await deleteFlight(id);
            await loadFlights();
            await loadStats();
            await loadCountries();
        } catch (e: any) {
            Alert.alert("Error", e?.response?.data?.message ?? e.message ?? "Could not delete flight");
        }
    }

    function confirmDelete(id?: string) {
        if (!id) return;

        if (Platform.OS === "web") {
            const confirmed = (globalThis as any).confirm?.("Remove this flight permanently?") ?? false;
            if (confirmed) void handleDelete(id);
            return;
        }

        Alert.alert("Delete flight", "Remove this flight permanently?", [
            {text: "Cancel", style: "cancel"},
            {
                text: "Delete",
                style: "destructive",
                onPress: () => handleDelete(id),
            },
        ]);
    }

    const flightCountText = useMemo(
        () => `${flights.length} flight${flights.length === 1 ? "" : "s"}`,
        [flights.length]
    );

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Flight World Map</Text>

                {stats && (
                    <View style={styles.statsCard}>
                        <Stat label="Flights" value={stats.totalFlights.toString()}/>
                        <Stat label="Distance" value={`${stats.totalDistanceKm.toFixed(0)} km`}/>
                        <Stat label="Duration" value={`${stats.totalDurationMinutes.toFixed(0)} min`}/>
                        <Stat label="Unique Airports" value={stats.uniqueAirports.toString()}/>
                        <Stat label="Top Country" value={stats.mostVisitedCountry || "-"}/>
                    </View>
                )}

                <View style={styles.controlsCard}>
                    <Text style={styles.sectionTitle}>Filters</Text>

                    <TextInput
                        placeholder="Search airline, city, airport, ..."
                        value={filter.searchQuery}
                        onChangeText={(searchQuery) => setFilter((prev) => ({...prev, searchQuery}))}
                        style={styles.input}
                    />

                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <TextInput
                                placeholder="Year (e.g. 2026)"
                                value={yearInput}
                                onChangeText={(v) => {
                                    setYearInput(v);
                                    const year = v.trim() ? Number(v) : null;
                                    setFilter((prev) => ({...prev, year: Number.isFinite(year ?? NaN) ? year : null}));
                                }}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.flex1}>
                            <View style={styles.pickerWrap}>
                                <StyledPicker
                                    style={styles.picker}
                                    selectedValue={filter.seatClass}
                                    onValueChange={(seatClass: any) => setFilter((prev) => ({...prev, seatClass}))}
                                >
                                    <StyledPicker.Item label="All Classes" value="All"/>
                                    <StyledPicker.Item label="Economy" value="Economy"/>
                                    <StyledPicker.Item label="Business" value="Business"/>
                                    <StyledPicker.Item label="First" value="First"/>
                                </StyledPicker>
                            </View>
                        </View>
                    </View>

                    <View style={styles.pickerWrap}>
                        <StyledPicker
                            style={styles.picker}
                            selectedValue={filter.country || ""}
                            onValueChange={(country: any) => {
                                setFilter((prev) => ({...prev, country: country || null}));
                            }}
                        >
                            <StyledPicker.Item label="All Countries" value=""/>
                            {countries.map((c) => (
                                <StyledPicker.Item key={c} label={c} value={c}/>
                            ))}
                        </StyledPicker>
                    </View>

                    <View style={styles.row}>
                        <Pressable style={styles.primaryButton} onPress={() => setShowForm(true)}>
                            <Text style={styles.primaryButtonText}>Flug hinzufügen</Text>
                        </Pressable>

                        <Pressable
                            style={styles.secondaryButton}
                            onPress={() => {
                                setFilter({searchQuery: "", seatClass: "All", year: null, country: null});
                                setYearInput("");
                            }}
                        >
                            <Text style={styles.secondaryButtonText}>Reset</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Map</Text>
                    <FlightMap
                        flights={flights}
                        selectedFlight={selectedFlight}
                        onSelectFlight={(flight) => setSelectedFlight(flight)}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        Flights ({flightCountText})
                    </Text>

                    {loading ? (
                        <View style={styles.loadingWrapper}>
                            <ActivityIndicator size="large"/>
                        </View>
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : flights.length === 0 ? (
                        <Text style={styles.emptyText}>No flights found.</Text>
                    ) : (
                        flights.map((flight) => (
                            <FlightCard
                                key={flight._id?.toString() ?? `${flight.flightNumber}-${flight.date}`}
                                flight={flight}
                                selected={selectedFlight?._id?.toString() === flight._id?.toString()}
                                onPress={() => setSelectedFlight(flight)}
                                onDelete={() => confirmDelete(flight._id?.toString())}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            <FlightFormModal
                visible={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleCreateFlight}
            />
        </SafeAreaView>
    );
}

function Stat({label, value}: { label: string; value: string }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );
}

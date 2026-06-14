import React, {useEffect, useMemo, useState} from "react";
import {createFlight, deleteFlight, getFlights, getFlightStats} from "./src/api/flights";
import {FlightMap} from "./src/components/FlightMap";
import {FlightCard} from "./src/components/FlightCard";
import {FlightFormModal} from "./src/components/FlightFormModal";
import {IFlight, IFlightFilter, IFlightStats} from "./src/models/interfaces";
import {CreateFlightDTO} from "./src/models/types";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {styles} from "./src/styles/app.styles";

const StyledPicker = Picker as any;

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
    const [darkMode, setDarkMode] = useState(false);

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
            const message = e?.response?.data?.message ?? e.message ?? "Could not save flight";
            console.error("Error", message);
            Alert.alert("Error", "There was an error while saving the flight.");
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
    const filterSelectStyle = {
        width: "100%",
        height: 50,
        boxSizing: "border-box",
        border: "none",
        outline: "none",
        padding: "0 12px",
        backgroundColor: darkMode ? "#111827" : "#fff",
        color: darkMode ? "#f4f7fb" : "#102a43",
        fontSize: 14,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        colorScheme: darkMode ? "dark" : "light",
    } as any;
    const filterOptionStyle = {
        backgroundColor: darkMode ? "#111827" : "#fff",
        color: darkMode ? "#f4f7fb" : "#102a43",
    } as any;

    return (
        <SafeAreaView style={[styles.safe, darkMode && styles.safeDark]}>
            <View style={[styles.container, {flex: 1}]}>
                <View style={[styles.card, darkMode && styles.cardDark, {flex: 65, marginTop: -16, zIndex: 0}]}>
                    <FlightMap
                        flights={flights}
                        selectedFlight={selectedFlight}
                        darkMode={darkMode}
                        onSelectFlight={(flight) => setSelectedFlight(flight)}
                    />
                </View>

                <Text style={[styles.title, darkMode && styles.titleDark]}>Flight World Map</Text>

                {stats && (
                    <View style={[styles.sectionCard, darkMode && styles.sectionCardDark, styles.topLeftCard]}>
                        <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Stats</Text>

                        <View style={[styles.statsCard]}>
                            <Stat label="Flights" value={stats.totalFlights.toString()} darkMode={darkMode}/>
                            <Stat label="Distance" value={`${stats.totalDistanceKm.toFixed(0)} km`}
                                  darkMode={darkMode}/>
                            <Stat label="Duration" value={`${stats.totalDurationMinutes.toFixed(0)} min`}
                                  darkMode={darkMode}/>
                            <Stat label="Unique Airports" value={stats.uniqueAirports.toString()} darkMode={darkMode}/>
                            <Stat label="Top Country" value={stats.mostVisitedCountry || "-"} darkMode={darkMode}/>
                        </View>
                    </View>
                )}

                <View style={styles.topRightCard}>
                    <View style={[styles.sectionCard, darkMode && styles.sectionCardDark]}>
                        <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Filters</Text>

                        <TextInput
                            placeholder="Search airline, city, airport, ..."
                            placeholderTextColor={darkMode ? "#a8b3c7" : undefined}
                            value={filter.searchQuery}
                            onChangeText={(searchQuery) => setFilter((prev) => ({...prev, searchQuery}))}
                            style={[styles.input, darkMode && styles.inputDark]}
                        />

                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <TextInput
                                    placeholder="Year (e.g. 2026)"
                                    placeholderTextColor={darkMode ? "#a8b3c7" : undefined}
                                    value={yearInput}
                                    onChangeText={(v) => {
                                        setYearInput(v);
                                        const year = v.trim() ? Number(v) : null;
                                        setFilter((prev) => ({
                                            ...prev,
                                            year: Number.isFinite(year ?? NaN) ? year : null
                                        }));
                                    }}
                                    keyboardType="numeric"
                                    style={[styles.input, darkMode && styles.inputDark]}
                                />
                            </View>

                            <View style={styles.flex1}>
                                <View style={[styles.pickerWrap, darkMode && styles.pickerWrapDark]}>
                                    {Platform.OS === "web" ? (
                                        React.createElement(
                                            "select",
                                            {
                                                value: filter.seatClass,
                                                onChange: (event: any) =>
                                                    setFilter((prev) => ({...prev, seatClass: event.target.value})),
                                                style: filterSelectStyle,
                                            },
                                            [
                                                React.createElement("option", {
                                                    key: "All",
                                                    value: "All",
                                                    style: filterOptionStyle
                                                }, "All Classes"),
                                                React.createElement("option", {
                                                    key: "Economy",
                                                    value: "Economy",
                                                    style: filterOptionStyle
                                                }, "Economy"),
                                                React.createElement("option", {
                                                    key: "Business",
                                                    value: "Business",
                                                    style: filterOptionStyle
                                                }, "Business"),
                                                React.createElement("option", {
                                                    key: "First",
                                                    value: "First",
                                                    style: filterOptionStyle
                                                }, "First"),
                                            ]
                                        )
                                    ) : (
                                        <StyledPicker
                                            style={[styles.picker, darkMode && styles.pickerDark]}
                                            dropdownIconColor={darkMode ? "#f4f7fb" : undefined}
                                            selectedValue={filter.seatClass}
                                            onValueChange={(seatClass: any) => setFilter((prev) => ({
                                                ...prev,
                                                seatClass
                                            }))}
                                        >
                                            <StyledPicker.Item label="All Classes" value="All"
                                                               color={darkMode ? "#f4f7fb" : undefined}/>
                                            <StyledPicker.Item label="Economy" value="Economy"
                                                               color={darkMode ? "#f4f7fb" : undefined}/>
                                            <StyledPicker.Item label="Business" value="Business"
                                                               color={darkMode ? "#f4f7fb" : undefined}/>
                                            <StyledPicker.Item label="First" value="First"
                                                               color={darkMode ? "#f4f7fb" : undefined}/>
                                        </StyledPicker>
                                    )}
                                </View>
                            </View>
                        </View>

                        <View style={[styles.pickerWrap, darkMode && styles.pickerWrapDark]}>
                            {Platform.OS === "web" ? (
                                React.createElement(
                                    "select",
                                    {
                                        value: filter.country || "",
                                        onChange: (event: any) =>
                                            setFilter((prev) => ({...prev, country: event.target.value || null})),
                                        style: filterSelectStyle,
                                    },
                                    [
                                        React.createElement("option", {
                                            key: "",
                                            value: "",
                                            style: filterOptionStyle
                                        }, "All Countries"),
                                        ...countries.map((country) =>
                                            React.createElement("option", {
                                                key: country,
                                                value: country,
                                                style: filterOptionStyle,
                                            }, country)
                                        ),
                                    ]
                                )
                            ) : (
                                <StyledPicker
                                    style={[styles.picker, darkMode && styles.pickerDark]}
                                    dropdownIconColor={darkMode ? "#f4f7fb" : undefined}
                                    selectedValue={filter.country || ""}
                                    onValueChange={(country: any) => {
                                        setFilter((prev) => ({...prev, country: country || null}));
                                    }}
                                >
                                    <StyledPicker.Item label="All Countries" value=""
                                                       color={darkMode ? "#f4f7fb" : undefined}/>
                                    {countries.map((c) => (
                                        <StyledPicker.Item key={c} label={c} value={c}
                                                           color={darkMode ? "#f4f7fb" : undefined}/>
                                    ))}
                                </StyledPicker>
                            )}
                        </View>

                        <View style={styles.row}>
                            <Pressable style={styles.primaryButton} onPress={() => setShowForm(true)}>
                                <Text style={styles.primaryButtonText}>Flug hinzufügen</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.secondaryButton, darkMode && styles.secondaryButtonDark]}
                                onPress={() => {
                                    setFilter({searchQuery: "", seatClass: "All", year: null, country: null});
                                    setYearInput("");
                                }}
                            >
                                <Text
                                    style={[styles.secondaryButtonText, darkMode && styles.secondaryButtonTextDark]}>Reset</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={[styles.card, darkMode && styles.cardDark, {
                    flex: 35,
                    marginTop: 14,
                    overflow: 'hidden',
                    paddingBottom: 0
                }]}>
                    <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
                        Flights ({flightCountText})
                    </Text>

                    <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 16}}>
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
                                    darkMode={darkMode}
                                    onPress={() => setSelectedFlight(flight)}
                                    onDelete={() => confirmDelete(flight._id?.toString())}
                                />
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>

            <Pressable
                accessibilityLabel={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                onPress={() => setDarkMode((prev) => !prev)}
                style={[styles.themeToggle, darkMode && styles.themeToggleDark]}
            >
                <Text style={[styles.themeToggleText, darkMode && styles.themeToggleTextDark]}>
                    {darkMode ? "☀" : "☾"}
                </Text>
            </Pressable>

            <FlightFormModal
                visible={showForm}
                darkMode={darkMode}
                onClose={() => setShowForm(false)}
                onSubmit={handleCreateFlight}
            />
        </SafeAreaView>
    );
}

function Stat({label, value, darkMode}: { label: string; value: string; darkMode: boolean }) {
    return (
        <View style={[styles.statItem, darkMode && styles.statItemDark]}>
            <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>{label}</Text>
            <Text style={[styles.statValue, darkMode && styles.statValueDark]}>{value}</Text>
        </View>
    );
}

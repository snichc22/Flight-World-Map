import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
    },
    cardSelected: {
        backgroundColor: "#e8f2ff",
        borderColor: "#6aa9ff",
    },
    cardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardContent: {
        flex: 1,
        paddingRight: 12,
    },
    flightTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    routeText: {
        marginTop: 4,
        color: "#444",
    },
    detailText: {
        marginTop: 4,
        color: "#666",
    },
    notesText: {
        marginTop: 4,
        color: "#777",
    },
    deleteBtn: {
        alignSelf: "flex-start",
        backgroundColor: "#ffefef",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    deleteBtnText: {
        color: "#c62828",
        fontWeight: "700",
    },
});

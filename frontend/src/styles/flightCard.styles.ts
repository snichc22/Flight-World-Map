import {StyleSheet} from "react-native";
import {globalStyles} from "./global.styles";

export const styles = StyleSheet.create({
    card: {
        ...globalStyles.cardCompact,
        marginBottom: 12,
    },
    cardDark: {
        backgroundColor: "#202b40",
        borderColor: "#3a465d",
    },
    cardSelected: {
        backgroundColor: "#e8f2ff",
        borderColor: "#6aa9ff",
    },
    cardSelectedDark: {
        backgroundColor: "#17375f",
        borderColor: "#5d9cec",
    },
    cardContainer: globalStyles.rowBetween,
    cardContent: {
        flex: 1,
        paddingRight: 12,
    },
    flightTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    flightTitleDark: {
        color: "#f4f7fb",
    },
    routeText: {
        marginTop: 4,
        color: "#444",
    },
    routeTextDark: {
        color: "#cbd5e1",
    },
    detailText: {
        marginTop: 4,
        color: "#666",
    },
    detailTextDark: {
        color: "#a8b3c7",
    },
    notesText: {
        marginTop: 4,
        color: "#777",
    },
    notesTextDark: {
        color: "#94a3b8",
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

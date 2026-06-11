import {StyleSheet} from "react-native";
import {globalStyles} from "./global.styles";

export const flightMapStyles = StyleSheet.create({
    container: {
        ...globalStyles.card,
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
        flex: 1,
    },
    map: {
        width: "100%",
        height: "100%",
    },
    emptyOverlay: {
        ...globalStyles.centeredOverlay,
        ...globalStyles.mutedOverlay,
    },
    emptyText: {
        fontWeight: "700",
        color: "#444",
    },
});
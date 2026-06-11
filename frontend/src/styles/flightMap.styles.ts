import {StyleSheet} from "react-native";
import {globalStyles} from "./global.styles";

export const getDynamicMapHeight = (height: number) =>
    height * 0.6;

export const flightMapStyles = StyleSheet.create({
    container: {
        ...globalStyles.card,
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
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
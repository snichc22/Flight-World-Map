import {Dimensions, StyleSheet} from "react-native";
import {globalStyles} from "./global.styles";

const {width} = Dimensions.get("window");
export const mapHeight = Math.max(260, Math.min(420, width * 0.72));

export const flightMapStyles = StyleSheet.create({
    container: {
        ...globalStyles.card,
        height: mapHeight,
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
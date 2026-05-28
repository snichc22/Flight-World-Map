import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const mapHeight = Math.max(260, Math.min(420, width * 0.72));

export const flightMapStyles = StyleSheet.create({
    container: {
        width: "100%",
        height: mapHeight,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "#fff",
        position: "relative",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    emptyOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.55)",
        zIndex: 2,
    },
    emptyText: {
        fontWeight: "700",
        color: "#444",
    },
});

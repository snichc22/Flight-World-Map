import {StyleSheet} from "react-native";
import {globalStyles} from "./global.styles";

export const styles = StyleSheet.create({
    safe: globalStyles.screen,
    container: {
        padding: 16,
        marginTop: 20,
        paddingBottom: 32,
    },
    title: {
        ...globalStyles.title,
        backgroundColor: "#eee",
        paddingHorizontal: 24,
        paddingVertical: 8,
        paddingBottom: 12,
        borderRadius: 20,
        overflow: "hidden",
        position: "absolute",
        top: 35,
        alignSelf: "center",
        zIndex: 10,
    },
    card: globalStyles.card,
    cardDark: {
        backgroundColor: "#172033",
        shadowColor: "#000",
    },
    sectionCard: globalStyles.sectionCard,
    sectionCardDark: {
        backgroundColor: "#1f293d",
        shadowColor: "#000",
    },
    controlsCard: globalStyles.sectionCard,
    statsCard: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 14,
    },
    statItem: globalStyles.statItem,
    statItemDark: {
        backgroundColor: "#27344c",
    },
    statLabel: globalStyles.statLabel,
    statLabelDark: {
        color: "#a8b3c7",
    },
    statValue: globalStyles.statValue,
    statValueDark: {
        color: "#f4f7fb",
    },
    sectionTitle: globalStyles.sectionTitle,
    sectionTitleDark: {
        color: "#f4f7fb",
    },
    mapTitle: {
        alignSelf: "center",
        textAlign: "center",
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 10,
    },
    input: globalStyles.input,
    inputDark: {
        backgroundColor: "#111827",
        borderColor: "#3a465d",
        color: "#f4f7fb",
    },
    pickerWrap: globalStyles.pickerWrap,
    pickerWrapDark: {
        backgroundColor: "#111827",
        borderColor: "#3a465d",
    },
    picker: globalStyles.picker,
    pickerDark: {
        color: "#f4f7fb",
    },
    row: globalStyles.row,
    flex1: globalStyles.flex1,
    primaryButton: globalStyles.buttonPrimary,
    primaryButtonText: globalStyles.buttonPrimaryText,
    secondaryButton: globalStyles.buttonSecondary,
    secondaryButtonText: globalStyles.buttonSecondaryText,
    secondaryButtonDark: {
        backgroundColor: "#303c53",
    },
    secondaryButtonTextDark: {
        color: "#f4f7fb",
    },
    errorText: globalStyles.errorText,
    emptyText: globalStyles.emptyText,
    loadingWrapper: {paddingVertical: 24},
    topRightCard: {
        position: "absolute",
        top: 32,
        right: 48,
        width: "20%",
        zIndex: 1,
    },
    topLeftCard: {
        position: "absolute",
        top: 32,
        left: 48,
        width: "15%",
        zIndex: 1,
    },
    safeDark: {
        backgroundColor: "#0d1320",
    },
    titleDark: {
        backgroundColor: "#172033",
        color: "#f4f7fb",
    },
    themeToggle: {
        position: "absolute",
        right: 24,
        bottom: 24,
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#102a43",
        shadowColor: "#000",
        shadowOpacity: 0.22,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 4},
        elevation: 5,
        zIndex: 30,
    },
    themeToggleDark: {
        backgroundColor: "#f4f7fb",
    },
    themeToggleText: {
        color: "#fff",
        fontSize: 24,
        lineHeight: 28,
    },
    themeToggleTextDark: {
        color: "#102a43",
    },
});

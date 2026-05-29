import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    safe: {flex: 1, backgroundColor: "#f5f7fb"},
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#102a43",
    },
    subtitle: {
        marginTop: 6,
        marginBottom: 14,
        color: "#627d98",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 14,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 4},
        elevation: 2,
    },
    controlsCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 14,
        marginBottom: 14,
    },
    statsCard: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 14,
    },
    statItem: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
    },
    statLabel: {color: "#627d98", fontSize: 12, marginBottom: 4},
    statValue: {color: "#102a43", fontSize: 16, fontWeight: "800"},
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#102a43",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d9e2ec",
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 11,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    pickerWrap: {
        borderWidth: 1,
        borderColor: "#d9e2ec",
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: "100%",
        color: "#102a43",
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    flex1: {flex: 1},
    primaryButton: {
        flex: 1,
        backgroundColor: "#1976d2",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#fff",
        fontWeight: "800",
    },
    secondaryButton: {
        width: 100,
        backgroundColor: "#e9eef6",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    secondaryButtonText: {
        color: "#102a43",
        fontWeight: "700",
    },
    errorText: {
        color: "#b00020",
        fontWeight: "700",
        paddingVertical: 10,
    },
    emptyText: {
        color: "#627d98",
        paddingVertical: 10,
    },
});
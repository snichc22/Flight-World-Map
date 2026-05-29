import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    inputStyle: {
        borderWidth: 1,
        borderColor: "#d7d7d7",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#fff",
    },
    pickerWrap: {
        borderWidth: 1,
        borderColor: "#d7d7d7",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
    },
    buttonStyle: {
        flex: 1,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    scrollContainer: {
        padding: 18,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 14,
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    flex1: {
        flex: 1,
    },
    flex04: {
        flex: 0.4,
    },
    sectionTitle: {
        fontWeight: "700",
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        color: "#102a43",
    },
    dateInputWeb: {
        height: 46,
        width: '100%',
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: 1,
        borderColor: '#d9e2ec',
        borderRadius: 14,
        fontSize: 14,
        color: '#102a43',
        backgroundColor: '#fff',
        fontFamily: 'inherit',
    },
    datePressable: {
        justifyContent: "center",
        minHeight: 46,
    },
    pickerWrapCentered: {
        height: 46,
        justifyContent: "center",
    },
    pickerStyle: {
        height: 46,
        width: "100%",
        color: "#102a43",
    },
    notesInput: {
        minHeight: 90,
        textAlignVertical: "top",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: "#eee",
    },
    cancelButtonText: {
        fontWeight: "700",
    },
    saveButtonEnabled: {
        backgroundColor: "#1976d2",
    },
    saveButtonDisabled: {
        backgroundColor: "#9ebee0",
    },
    saveButtonText: {
        fontWeight: "700",
        color: "#fff",
    },
    fieldContainer: {
        marginBottom: 12,
    },
    fieldLabel: {
        fontWeight: "700",
        marginBottom: 6,
    },
});

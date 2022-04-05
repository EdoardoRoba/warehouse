// import axios from "axios";
import { axiosInstance } from "../config.js"
import * as React from "react";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import Typography from '@mui/material/Typography';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

function DDT(props) {

    const [customerSelected, setCustomerSelected] = React.useState(props.customer);

    // React.useEffect(() => {
    //     setCustomerSelected(props.customer)
    // }, [])

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {
                    (customerSelected === null || customerSelected === undefined) ? "" :
                        <Text variant="h4" component="div">
                            {customerSelected.nome_cognome}
                        </Text>
                }
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );
}

export default DDT;

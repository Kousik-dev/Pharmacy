// PDFReceipt.js
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
});

// Create PDFReceipt component
const PDFReceipt = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Order Receipt</Text>
        <Text style={styles.subtitle}>Order Details:</Text>
        <Text style={styles.text}>Order ID: {order._id}</Text>
        <Text style={styles.text}>Status: {order.status}</Text>
        <Text style={styles.text}>Buyer: {order.buyer.name}</Text>
        <Text style={styles.text}>
          Date: {new Date(order.createAt).toLocaleString()}
        </Text>
        <Text style={styles.text}>Payment: Success</Text>
        <Text style={styles.text}>Quantity: {order.products.length}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Products:</Text>
        {order.products.map((product) => (
          <View key={product._id} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold" }}>{product.name}</Text>
            <Text>{product.description}</Text>
            <Text>Price: {product.price}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFReceipt;

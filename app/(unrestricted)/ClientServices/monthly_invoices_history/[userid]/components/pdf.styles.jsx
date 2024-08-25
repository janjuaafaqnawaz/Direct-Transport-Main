import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFF",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    margin: "10px 0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "12%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f3f3f3",
    padding: 5,
  },
  tableCol: {
    width: "12%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 10,
  },
  image: {
    width: 200,
    height: 100,
  },

  heading: {
    fontSize: 15,
    fontWeight: "extrabold",

    margin: "10px 0",
  },

  para: {
    fontSize: 10,
    fontWeight: "hairline",
  },
});

export default styles;

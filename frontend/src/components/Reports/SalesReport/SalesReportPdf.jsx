import { Document, Page, View, Text } from "@react-pdf/renderer";
import { Table, TR, TableHeader, TableCell } from "@ag-media/react-pdf-table";
import styles from "./srf.styles";

function SalesReportPDF(props) {
  const { saleData, sDate, eDate } = props;
  let totalDiscounts = 0,
    totalBill = 0,
    totalPayables = 0;
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page_settings}>
        {/* the header part */}
        <View style={styles.header_settings}>
          {/* sales report no and details */}
          <View>
            <Text style={styles.invoice_heading}>Report</Text>
            <Text style={styles.sdate}>From:{sDate || "--/--/-----"}</Text>
            <Text style={styles.edate}>To:{eDate || "--/--/-----"}</Text>
          </View>

          {/* company details */}
          <View style={styles.comp_info}>
            <Text style={styles.main_info}>PHARMATRIX</Text>
            <Text style={styles.sub_info}>Demo(v1.0)</Text>
            <Text style={styles.sub_info}>Reports</Text>
          </View>
        </View>

        {/* the body part */}
        <View>
          <Text>Sales History</Text>
        </View>

        <Table style={styles.table_styles}>
          <TableHeader style={styles.theadings}>
            <TableCell weighting={0.2} style={[styles.fcell]}>
              No:
            </TableCell>
            <TableCell weighting={2} style={[styles.fcell]}>
              Invoice No
            </TableCell>
            <TableCell weighting={1.2} style={[styles.fcell]}>
              Customer
            </TableCell>
            <TableCell weighting={1} style={[styles.fcell]}>
              Payment Method
            </TableCell>
            <TableCell weighting={2} style={[styles.fcell]}>
              Total (LKR)
            </TableCell>
            <TableCell weighting={2} style={[styles.fcell]}>
              Discount (LKR)
            </TableCell>
            <TableCell weighting={2} style={[styles.fcell]}>
              Total Payable (LKR)
            </TableCell>
          </TableHeader>

          {saleData.map((item, index) => {
            totalDiscounts += item.discount;
            totalBill += item.sub_total;
            totalPayables += item.total_payable;

            return (
              <TR key={item._id || index} style={styles.trows}>
                <TableCell weighting={0.2} style={[styles.fcell]}>
                  {index + 1}
                </TableCell>
                <TableCell weighting={2} style={[styles.fcell]}>
                  {item.invoice_no || "N/A"}
                </TableCell>
                <TableCell weighting={1.2} style={[styles.fcell]}>
                  {item.customer_name || "N/A"}
                </TableCell>
                <TableCell weighting={1} style={[styles.fcell]}>
                  {item.payment_method || "N/A"}
                </TableCell>
                <TableCell weighting={2} style={[styles.fcell]}>
                  {item.sub_total.toFixed(2)}
                </TableCell>
                <TableCell weighting={2} style={[styles.fcell]}>
                  {item.discount.toFixed(2)}
                </TableCell>
                <TableCell weighting={2} style={[styles.fcell]}>
                  {item.total_payable.toFixed(2)}
                </TableCell>
              </TR>
            );
          })}
        </Table>

        {/* invoice final insights - checkout information */}
        <View style={styles.checkout_container}>
          {/* first col */}
          <View style={styles.checkout_cont_column}></View>

          {/* second col */}
          <View style={styles.checkout_cont_column}>
            <View style={styles.checkout_row}>
              <Text style={styles.text_bold}>Total Bill Worth (LKR):</Text>
              <Text>{(totalBill || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.checkout_row}>
              <Text style={styles.text_bold}>Total Discounts (LKR):</Text>
              <Text>{(totalDiscounts || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.checkout_row}>
              <Text style={styles.text_bold}>Total Received (LKR):</Text>
              <Text>{(totalPayables || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* the footer part */}
        <View style={styles.footer_styles}>
          <Text>Hope this data would be helpful to you!</Text>
          <Text>Developed & maintained by Devexus(Dileepa Lakshan)</Text>
          <Text>Version 1.0 • © 2025 Pharmatrix • All rights reserved</Text>
        </View>
      </Page>
    </Document>
  );
}

export default SalesReportPDF;

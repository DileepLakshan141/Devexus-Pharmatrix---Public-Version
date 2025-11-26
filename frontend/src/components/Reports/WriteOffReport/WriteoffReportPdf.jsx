import { Document, Page, View, Text } from "@react-pdf/renderer";
import { Table, TR, TableHeader, TableCell } from "@ag-media/react-pdf-table";
import styles from "./wrf.styles";

function WriteoffReportPDF(props) {
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
          <Text>Writeoff History</Text>
        </View>

        <Table style={styles.table_styles}>
          <TableHeader style={styles.theadings}>
            <TableCell weighting={0.2} style={[styles.fcell]}>
              No:
            </TableCell>
            <TableCell weighting={2} style={[styles.fcell]}>
              Batch No
            </TableCell>
            <TableCell weighting={1.2} style={[styles.fcell]}>
              Item Name
            </TableCell>
            <TableCell weighting={1} style={[styles.fcell]}>
              SKU
            </TableCell>
            <TableCell weighting={1} style={[styles.fcell]}>
              Cost Price
            </TableCell>
            <TableCell weighting={1} style={[styles.fcell]}>
              Disposed Qty
            </TableCell>
            <TableCell weighting={1} style={[styles.fcell]}>
              Total Loss
            </TableCell>
          </TableHeader>

          {saleData.map((item, index) => {
            return (
              <TR key={item._id || index} style={styles.trows}>
                <TableCell weighting={0.2} style={[styles.fcell]}>
                  {index + 1}
                </TableCell>
                <TableCell weighting={2} style={[styles.fcell]}>
                  {item.batch_id.batch_no || "N/A"}
                </TableCell>
                <TableCell weighting={1.2} style={[styles.fcell]}>
                  {item.batch_id.item_id.name || "N/A"}
                </TableCell>
                <TableCell weighting={1} style={[styles.fcell]}>
                  {item.batch_id.item_id.sku || "N/A"}
                </TableCell>
                <TableCell weighting={1} style={[styles.fcell]}>
                  {item.cost_price_per_base.toFixed(2)}
                </TableCell>
                <TableCell weighting={1} style={[styles.fcell]}>
                  {item.quantity.toFixed(2)}
                </TableCell>
                <TableCell weighting={1} style={[styles.fcell]}>
                  {(item.quantity * item.cost_price_per_base || 0).toFixed(2)}
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
          <View style={styles.checkout_cont_column}></View>
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

export default WriteoffReportPDF;

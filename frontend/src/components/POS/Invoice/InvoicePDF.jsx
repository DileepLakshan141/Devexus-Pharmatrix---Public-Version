import { Document, Page, View, Text } from "@react-pdf/renderer";
import {
  Table,
  TD,
  TH,
  TR,
  TableHeader,
  TableRow,
  TableCell,
} from "@ag-media/react-pdf-table";
import styles from "./InvoiceStyles";
import dayjs from "dayjs";

function InvoicePDF(props) {
  const { saleData } = props;
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page_settings}>
        {/* the header part */}
        <View style={styles.header_settings}>
          {/* invoice no and details */}
          <View>
            <Text style={styles.invoice_heading}>Invoice</Text>
            <Text style={styles.invoice_no}>
              Invoice ID:{saleData?.invoice_no || "#456-322-324"}
            </Text>
            <Text style={styles.bill_date}>
              Bill Date:{dayjs(saleData?.createdAt).format("DD MMM , YYYY")}
            </Text>
            <Text style={styles.cashier}>
              Cashier:{saleData?.cashier?.username}
            </Text>
          </View>

          {/* company details */}
          <View style={styles.comp_info}>
            <Text style={styles.main_info}>PHARMATRIX</Text>
            <Text style={styles.sub_info}>Demo(v1.0)</Text>
          </View>
        </View>

        {/* the body part */}
        <View>
          <Text>Purchased Items</Text>
        </View>

        <Table style={styles.table_styles}>
          <TableHeader style={styles.theadings}>
            <TableCell weighting={0.2} style={[styles.fcell]}>
              No:
            </TableCell>
            <TableCell weighting={2} style={[styles.fcell]}>
              Item Name
            </TableCell>
            <TableCell weighting={2} style={[styles.fcell]}>
              Unit Name
            </TableCell>
            <TableCell weighting={0.3} style={[styles.fcell]}>
              Qty
            </TableCell>
            <TableCell weighting={2} style={[styles.fcell]}>
              Total (LKR)
            </TableCell>
          </TableHeader>

          {saleData?.sold_items.map((item, index) => {
            return (
              <TR key={item._id || index} style={styles.trows}>
                <TableCell weighting={0.2} style={[styles.fcell]}>
                  {index + 1}
                </TableCell>
                <TableCell weighting={2} style={[styles.fcell]}>
                  {item.item_batch_id?.item_id?.name || "N/A"}
                </TableCell>
                <TableCell weighting={2} style={[styles.fcell]}>
                  {item.unit_name}
                </TableCell>
                <TableCell weighting={0.3} style={[styles.fcell]}>
                  {item.qty}
                </TableCell>
                <TableCell weighting={2} style={[styles.fcell]}>
                  {(item.qty * item.base_unit_price * item.unit_qty).toFixed(2)}
                </TableCell>
              </TR>
            );
          })}
        </Table>

        {/* invoice final insights - checkout information */}
        <View style={styles.checkout_container}>
          {/* first col */}
          <View style={styles.checkout_cont_column}>
            <View style={styles.checkout_row}>
              <Text style={styles.text_bold}>Customer:</Text>
              <Text>Walk-In</Text>
            </View>
            <View style={styles.checkout_row}>
              <Text style={styles.text_bold}>Payment Method:</Text>
              <Text>{(saleData?.payment_method || "cash").toUpperCase()}</Text>
            </View>
          </View>

          {/* second col */}
          <View style={styles.checkout_cont_column}>
            <View style={styles.checkout_row}>
              <Text style={styles.text_bold}>Sub Total (LKR):</Text>
              <Text>{(saleData?.sub_total || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.checkout_row}>
              <Text style={styles.text_bold}>Discount (LKR):</Text>
              <Text>{(saleData?.discount || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.checkout_row}>
              <Text style={styles.text_bold}>Total Payable (LKR):</Text>
              <Text>{(saleData?.total_payable || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* the footer part */}
        <View style={styles.footer_styles}>
          <Text>Thank you for trusting us as your medical partner!</Text>
          <Text>Developed & maintained by Devexus(Dileepa Lakshan)</Text>
          <Text>Version 1.0 • © 2025 Pharmatrix • All rights reserved</Text>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePDF;

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Order, Customer } from '../../types/pos';
import { formatCurrency } from '../../utils/formatters';

// Register fonts (you'll need to add actual font files)
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Inter',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  outletName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 5,
  },
  phone: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginVertical: 10,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  orderInfoText: {
    fontSize: 10,
  },
  customerInfo: {
    marginBottom: 15,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customerDetails: {
    fontSize: 10,
    color: '#666666',
  },
  itemsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 5,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 10,
    fontWeight: 'bold',
    flex: 3,
  },
  itemQty: {
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 10,
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  itemNameText: {
    fontSize: 10,
    flex: 3,
  },
  itemQtyText: {
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
  itemPriceText: {
    fontSize: 10,
    flex: 2,
    textAlign: 'right',
  },
  itemNotes: {
    fontSize: 8,
    color: '#666666',
    fontStyle: 'italic',
    marginLeft: 10,
  },
  totals: {
    marginTop: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 10,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  finalTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 5,
    marginTop: 5,
  },
  paymentInfo: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
  },
  paymentMethod: {
    fontSize: 10,
    marginBottom: 5,
  },
  loyaltyInfo: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 5,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  thankYou: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
  barcode: {
    fontSize: 8,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Courier',
  },
});

interface ReceiptPDFProps {
  order: Order;
  customer?: Customer;
}

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ order, customer }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateBarcode = (orderId: string) => {
    // Simple barcode representation - in production, use a proper barcode library
    return `*${orderId}*`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍽️ CoralServe</Text>
          <Text style={styles.outletName}>Downtown Restaurant</Text>
          <Text style={styles.address}>123 Main Street, Downtown</Text>
          <Text style={styles.address}>City, State 12345</Text>
          <Text style={styles.phone}>Phone: (555) 123-4567</Text>
        </View>

        <View style={styles.divider} />

        {/* Order Information */}
        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoText}>
            Order: #{order.id.slice(-6)}
          </Text>
          <Text style={styles.orderInfoText}>
            Date: {formatDate(order.createdAt)}
          </Text>
        </View>

        {/* Customer Information */}
        {customer && (
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerDetails}>
              Email: {customer.email}
              {customer.phone && ` | Phone: ${customer.phone}`}
            </Text>
            <Text style={styles.customerDetails}>
              Loyalty Points: {customer.loyaltyPoints}
            </Text>
          </View>
        )}

        {/* Items Header */}
        <View style={styles.itemsHeader}>
          <Text style={styles.itemName}>Item</Text>
          <Text style={styles.itemQty}>Qty</Text>
          <Text style={styles.itemPrice}>Price</Text>
        </View>

        {/* Items */}
        {order.items.map((item, index) => (
          <View key={index}>
            <View style={styles.item}>
              <Text style={styles.itemNameText}>{item.productName}</Text>
              <Text style={styles.itemQtyText}>{item.quantity}</Text>
              <Text style={styles.itemPriceText}>
                {formatCurrency(item.totalPrice)}
              </Text>
            </View>
            {item.notes && (
              <Text style={styles.itemNotes}>Note: {item.notes}</Text>
            )}
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.subtotal)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (8%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.tax)}</Text>
          </View>

          {order.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>-{formatCurrency(order.discount)}</Text>
            </View>
          )}

          {order.loyaltyPointsRedeemed && order.loyaltyPointsRedeemed > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Loyalty Points ({order.loyaltyPointsRedeemed} pts):
              </Text>
              <Text style={styles.totalValue}>
                -{formatCurrency(order.loyaltyPointsRedeemed * 0.1)}
              </Text>
            </View>
          )}

          {order.tip && order.tip > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tip:</Text>
              <Text style={styles.totalValue}>{formatCurrency(order.tip)}</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.finalTotal}>Total:</Text>
            <Text style={styles.finalTotal}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentMethod}>
            Payment Method: {order.paymentMethod}
          </Text>
          <Text style={styles.paymentMethod}>
            Status: {order.paymentStatus}
          </Text>
          
          {order.loyaltyPointsEarned && order.loyaltyPointsEarned > 0 && (
            <Text style={styles.loyaltyInfo}>
              Points Earned: {order.loyaltyPointsEarned}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>Thank you for your order!</Text>
          <Text style={styles.footerText}>
            Please keep this receipt for your records
          </Text>
          <Text style={styles.footerText}>
            For questions or concerns, please contact us
          </Text>
          <Text style={styles.barcode}>
            {generateBarcode(order.id)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
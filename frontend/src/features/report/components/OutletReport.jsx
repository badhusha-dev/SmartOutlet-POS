import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Font
} from '@react-pdf/renderer'
import { format } from 'date-fns'

// Register custom fonts (you can add your own fonts)
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Inter'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #ef4444',
    paddingBottom: 20
  },
  headerLeft: {
    flexDirection: 'column'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5
  },
  date: {
    fontSize: 12,
    color: '#9ca3af'
  },
  headerRight: {
    alignItems: 'flex-end'
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  companyInfo: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right'
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statCard: {
    width: '30%',
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
    border: '1px solid #e5e7eb'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 5
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  table: {
    marginTop: 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 5
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    padding: 10,
    minHeight: 40
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb'
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
    paddingVertical: 5
  },
  tableCellLeft: {
    textAlign: 'left'
  },
  statusBadge: {
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  statusActive: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  statusInactive: {
    backgroundColor: '#fef2f2',
    color: '#dc2626'
  },
  chartSection: {
    marginTop: 20
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10
  },
  chartContainer: {
    height: 200,
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chartPlaceholder: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 15
  },
  footerText: {
    fontSize: 10,
    color: '#9ca3af'
  },
  pageNumber: {
    fontSize: 10,
    color: '#9ca3af'
  }
})

// PDF Document Component
const OutletReportDocument = ({ 
  outlet, 
  performance, 
  staff, 
  expenses, 
  inventory, 
  notices,
  reportType = 'comprehensive',
  dateRange = null 
}) => {
  const currentDate = format(new Date(), 'MMMM dd, yyyy')
  const currentTime = format(new Date(), 'HH:mm')

  const getReportTitle = () => {
    switch (reportType) {
      case 'sales':
        return 'Sales Performance Report'
      case 'staff':
        return 'Staff Management Report'
      case 'inventory':
        return 'Inventory Status Report'
      case 'financial':
        return 'Financial Summary Report'
      default:
        return 'Comprehensive Outlet Report'
    }
  }

  const getStatusStyle = (status) => {
    return status === 'ACTIVE' ? styles.statusActive : styles.statusInactive
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{getReportTitle()}</Text>
            <Text style={styles.subtitle}>{outlet?.name || 'Outlet Management'}</Text>
            <Text style={styles.date}>
              Generated on {currentDate} at {currentTime}
            </Text>
            {dateRange && (
              <Text style={styles.date}>
                Period: {dateRange.start} - {dateRange.end}
              </Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.companyInfo}>SmartOutlet POS</Text>
            <Text style={styles.companyInfo}>Retail Management System</Text>
            <Text style={styles.companyInfo}>www.smartoutlet.com</Text>
          </View>
        </View>

        {/* Key Performance Indicators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                ${performance?.salesToday?.toLocaleString() || '0'}
              </Text>
              <Text style={styles.statLabel}>Today's Sales</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {performance?.wastePercentage || '0'}%
              </Text>
              <Text style={styles.statLabel}>Waste Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                ${performance?.profitToday?.toLocaleString() || '0'}
              </Text>
              <Text style={styles.statLabel}>Today's Profit</Text>
            </View>
          </View>
        </View>

        {/* Outlet Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outlet Information</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.tableCellLeft]}>Property</Text>
              <Text style={styles.tableHeaderCell}>Value</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellLeft]}>Outlet Name</Text>
              <Text style={styles.tableCell}>{outlet?.name || 'N/A'}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.tableCellLeft]}>Address</Text>
              <Text style={styles.tableCell}>{outlet?.address || 'N/A'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellLeft]}>Phone</Text>
              <Text style={styles.tableCell}>{outlet?.phone || 'N/A'}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.tableCellLeft]}>Email</Text>
              <Text style={styles.tableCell}>{outlet?.email || 'N/A'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellLeft]}>Manager</Text>
              <Text style={styles.tableCell}>{outlet?.manager || 'N/A'}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.tableCellLeft]}>Status</Text>
              <Text style={[styles.tableCell, getStatusStyle(outlet?.status)]}>
                {outlet?.status || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Staff Information */}
        {staff && staff.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Staff Information ({staff.length} members)</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.tableCellLeft]}>Name</Text>
                <Text style={styles.tableHeaderCell}>Role</Text>
                <Text style={styles.tableHeaderCell}>Email</Text>
                <Text style={styles.tableHeaderCell}>Status</Text>
              </View>
              {staff.slice(0, 10).map((member, index) => (
                <View key={member.id} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>{member.name}</Text>
                  <Text style={styles.tableCell}>{member.role}</Text>
                  <Text style={styles.tableCell}>{member.email}</Text>
                  <Text style={[styles.tableCell, getStatusStyle(member.status)]}>
                    {member.status}
                  </Text>
                </View>
              ))}
              {staff.length > 10 && (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    ... and {staff.length - 10} more staff members
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Financial Summary */}
        {expenses && expenses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Summary</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.tableCellLeft]}>Category</Text>
                <Text style={styles.tableHeaderCell}>Amount</Text>
                <Text style={styles.tableHeaderCell}>Date</Text>
              </View>
              {expenses.slice(0, 8).map((expense, index) => (
                <View key={expense.id} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>{expense.category}</Text>
                  <Text style={styles.tableCell}>${expense.amount?.toLocaleString()}</Text>
                  <Text style={styles.tableCell}>
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Notices */}
        {notices && notices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Notices ({notices.length})</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.tableCellLeft]}>Title</Text>
                <Text style={styles.tableHeaderCell}>Type</Text>
                <Text style={styles.tableHeaderCell}>Priority</Text>
                <Text style={styles.tableHeaderCell}>Date</Text>
              </View>
              {notices.slice(0, 5).map((notice, index) => (
                <View key={notice.id} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>{notice.title}</Text>
                  <Text style={styles.tableCell}>{notice.type}</Text>
                  <Text style={styles.tableCell}>{notice.priority}</Text>
                  <Text style={styles.tableCell}>
                    {format(new Date(notice.createdAt), 'MMM dd, yyyy')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This report was generated automatically by SmartOutlet POS System
          </Text>
          <Text style={styles.pageNumber}>
            Page 1 of 1
          </Text>
        </View>
      </Page>
    </Document>
  )
}

// Main Report Component
const OutletReport = ({ 
  outlet, 
  performance, 
  staff, 
  expenses, 
  inventory, 
  notices,
  reportType = 'comprehensive',
  dateRange = null,
  showPreview = true 
}) => {
  if (showPreview) {
    return (
      <div className="w-full h-screen">
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <OutletReportDocument
            outlet={outlet}
            performance={performance}
            staff={staff}
            expenses={expenses}
            inventory={inventory}
            notices={notices}
            reportType={reportType}
            dateRange={dateRange}
          />
        </PDFViewer>
      </div>
    )
  }

  return (
    <OutletReportDocument
      outlet={outlet}
      performance={performance}
      staff={staff}
      expenses={expenses}
      inventory={inventory}
      notices={notices}
      reportType={reportType}
      dateRange={dateRange}
    />
  )
}

export default OutletReport 
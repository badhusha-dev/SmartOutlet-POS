import React, { useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ChipField,
  ReferenceField,
  useRecordContext,
  useNotify,
  useRefresh,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { PDFDownloadLink } from 'react-to-pdf';
import { Order, Customer } from '../../types/pos';
import { formatCurrency } from '../../utils/formatters';
import { ReceiptPDF } from './ReceiptPDF';

// Custom field components
const OrderStatusField = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'OPEN': return 'success';
      case 'PREPARING': return 'warning';
      case 'READY': return 'error';
      case 'COMPLETED': return 'default';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'OPEN': return '🟢';
      case 'PREPARING': return '🟡';
      case 'READY': return '🔴';
      case 'COMPLETED': return '✅';
      case 'CANCELLED': return '❌';
      default: return '⚪';
    }
  };

  return (
    <ChipField
      source="status"
      label={`${getStatusIcon(record.status)} ${record.status}`}
      color={getStatusColor(record.status)}
    />
  );
};

const PaymentStatusField = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;

  const getPaymentColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  return (
    <ChipField
      source="paymentStatus"
      color={getPaymentColor(record.paymentStatus)}
    />
  );
};

const CustomerField = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <PersonIcon fontSize="small" />
      <Typography variant="body2">
        {record.customerName || 'Walk-in Customer'}
      </Typography>
    </Box>
  );
};

const TotalField = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;

  return (
    <Typography variant="body2" fontWeight="bold" color="primary">
      {formatCurrency(record.total)}
    </Typography>
  );
};

// Custom actions
const RefundButton = () => {
  const record = useRecordContext<Order>();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  if (!record) return null;

  const isRefundDisabled = 
    record.status === 'CANCELLED' || 
    record.paymentStatus !== 'PAID' ||
    new Date(record.createdAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days

  const handleRefund = async () => {
    try {
      const response = await fetch(`/api/orders/${record.id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        notify('Refund processed successfully', { type: 'success' });
        refresh();
        setOpen(false);
      } else {
        notify('Failed to process refund', { type: 'error' });
      }
    } catch (error) {
      notify('Error processing refund', { type: 'error' });
    }
  };

  return (
    <>
      <Tooltip title={isRefundDisabled ? 'Refund not available' : 'Process refund'}>
        <span>
          <IconButton
            onClick={() => setOpen(true)}
            disabled={isRefundDisabled}
            color="error"
            size="small"
          >
            <CancelIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Order #{record.id.slice(-6)} - {formatCurrency(record.total)}
          </Typography>
          <MuiTextField
            fullWidth
            multiline
            rows={3}
            label="Refund Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for refund..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleRefund} variant="contained" color="error">
            Process Refund
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const PrintReceiptButton = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;

  return (
    <PDFDownloadLink
      document={<ReceiptPDF order={record} />}
      fileName={`receipt_${record.id}.pdf`}
    >
      {({ loading }) => (
        <Tooltip title="Print receipt">
          <IconButton size="small" disabled={loading}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
      )}
    </PDFDownloadLink>
  );
};

// Custom filters
const OrderFilters = () => {
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: '',
    customerName: '',
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <FilterIcon />
        <Typography variant="h6">Filters</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="PREPARING">Preparing</MenuItem>
            <MenuItem value="READY">Ready</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Payment</InputLabel>
          <Select
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            label="Payment"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
          </Select>
        </FormControl>

        <MuiTextField
          size="small"
          label="From Date"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <MuiTextField
          size="small"
          label="To Date"
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <MuiTextField
          size="small"
          label="Customer Name"
          value={filters.customerName}
          onChange={(e) => handleFilterChange('customerName', e.target.value)}
          placeholder="Search customer..."
        />

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => setFilters({
            status: '',
            paymentStatus: '',
            dateFrom: '',
            dateTo: '',
            customerName: '',
          })}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export const OrderHistoryList: React.FC = () => {
  return (
    <List
      title="Order History"
      filters={<OrderFilters />}
      perPage={25}
      sort={{ field: 'createdAt', order: 'DESC' }}
    >
      <Datagrid
        bulkActionButtons={false}
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          },
        }}
      >
        <TextField source="id" label="Order ID" />
        <DateField source="createdAt" label="Date" showTime />
        <CustomerField label="Customer" />
        <NumberField source="items.length" label="Items" />
        <TotalField label="Total" />
        <OrderStatusField label="Status" />
        <PaymentStatusField label="Payment" />
        <TextField source="paymentMethod" label="Method" />
        
        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <RefundButton />
          <PrintReceiptButton />
        </Box>
      </Datagrid>
    </List>
  );
};
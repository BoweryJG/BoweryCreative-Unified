import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  TablePagination,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Receipt,
  Download,
  Visibility,
  MoreVert,
  Search,
  FilterList,
  CreditCard,
  Subscriptions,
  Work,
  AttachMoney,
  RefreshOutlined,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { PaymentHistory as PaymentHistoryType, PaymentHistoryProps } from './types';

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  clientId,
  limit = 10,
  showLoadMore = true,
}) => {
  const [payments, setPayments] = useState<PaymentHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(limit);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryType | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchPaymentHistory();
  }, [clientId, page, rowsPerPage, filterType]);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        clientId,
        offset: (page * rowsPerPage).toString(),
        limit: rowsPerPage.toString(),
        ...(filterType !== 'all' && { type: filterType }),
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/history?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const data = await response.json();
      setPayments(data.payments);
      setTotalCount(data.totalCount);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPaymentHistory();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, payment: PaymentHistoryType) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    handleMenuClose();
  };

  const handleDownloadReceipt = async () => {
    if (!selectedPayment?.receiptUrl) return;

    try {
      window.open(selectedPayment.receiptUrl, '_blank');
    } catch (err) {
      console.error('Error downloading receipt:', err);
    }
    handleMenuClose();
  };

  const handleDownloadInvoice = async () => {
    if (!selectedPayment?.invoiceUrl) return;

    try {
      window.open(selectedPayment.invoiceUrl, '_blank');
    } catch (err) {
      console.error('Error downloading invoice:', err);
    }
    handleMenuClose();
  };

  const getStatusColor = (status: PaymentHistoryType['status']) => {
    switch (status) {
      case 'succeeded':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPaymentIcon = (type: PaymentHistoryType['type']) => {
    switch (type) {
      case 'subscription':
        return <Subscriptions fontSize="small" />;
      case 'credits':
        return <AttachMoney fontSize="small" />;
      case 'service':
        return <Work fontSize="small" />;
      default:
        return <CreditCard fontSize="small" />;
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && payments.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={handleRefresh}>
          Retry
        </Button>
      }>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="div">
              Payment History
            </Typography>
            <Box display="flex" gap={1}>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} size="small">
                  <RefreshOutlined />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box display="flex" gap={2} mb={2}>
            <TextField
              size="small"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              select
              size="small"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ minWidth: 150 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="subscription">Subscriptions</MenuItem>
              <MenuItem value="credits">Credits</MenuItem>
              <MenuItem value="service">Services</MenuItem>
            </TextField>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No payment history found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(payment.date), 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(payment.date), 'HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getPaymentIcon(payment.type)}
                          <div>
                            <Typography variant="body2">
                              {payment.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {payment.id}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          size="small"
                          color={getStatusColor(payment.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, payment)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {showLoadMore && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {selectedPayment?.receiptUrl && (
          <MenuItem onClick={handleDownloadReceipt}>
            <Receipt fontSize="small" sx={{ mr: 1 }} />
            Download Receipt
          </MenuItem>
        )}
        {selectedPayment?.invoiceUrl && (
          <MenuItem onClick={handleDownloadInvoice}>
            <Download fontSize="small" sx={{ mr: 1 }} />
            Download Invoice
          </MenuItem>
        )}
      </Menu>

      {/* Payment Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Payment ID
                  </Typography>
                  <Typography variant="body2">{selectedPayment.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(selectedPayment.date), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body2">{selectedPayment.type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Box>
                    <Chip
                      label={selectedPayment.status}
                      size="small"
                      color={getStatusColor(selectedPayment.status)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body2">{selectedPayment.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="h6">
                    ${(selectedPayment.amount / 100).toFixed(2)} {selectedPayment.currency.toUpperCase()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          {selectedPayment?.receiptUrl && (
            <Button
              variant="contained"
              startIcon={<Receipt />}
              onClick={handleDownloadReceipt}
            >
              Download Receipt
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentHistory;
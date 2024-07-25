import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Snackbar, MenuItem, Select, InputLabel, FormControl, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const API_URL = "http://127.0.0.1:8000/api";

const TransactionHistory = () => {
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [clientBalance, setClientBalance] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_URL}/clients/`);
        setClients(response.data);
      } catch (error) {
        setMessage('Error fetching clients');
        setOpen(true);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const client = clients.find(c => c.email === clientName);
      if (!client) {
        setMessage('Client not found');
        setOpen(true);
        return;
      }
      const response = await axios.get(`${API_URL}/transactions/client/${client.id}`);
      const sortedTransactions = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sortedTransactions);

      const clientResponse = await axios.get(`${API_URL}/clients/${client.id}`);
      setClientBalance(clientResponse.data.balance);
    } catch (error) {
      setMessage('Error fetching transactions');
      setOpen(true);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Historial de Transacciones
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Cliente</InputLabel>
          <Select
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            label="Cliente"
          >
            {clients.map(client => (
              <MenuItem key={client.id} value={client.email}>{client.email}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          Consultar Historial
        </Button>
      </form>
      {clientBalance !== null && (
        <Typography variant="h6" gutterBottom>
          Saldo Actual del Cliente: {clientBalance}
        </Typography>
      )}
      {transactions.length > 0 && (
        <Paper style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID de Transacción</TableCell>
                <TableCell>ID del Cliente</TableCell>
                <TableCell>ID del Fondo</TableCell>
                <TableCell>Tipo de Transacción</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.client_id}</TableCell>
                  <TableCell>{transaction.fund_id}</TableCell>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </Container>
  );
};

export default TransactionHistory;
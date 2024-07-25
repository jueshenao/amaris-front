import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const API_URL = "http://127.0.0.1:8000/api";

const UnsubscribeFund = () => {
  const [clients, setClients] = useState([]);
  const [funds, setFunds] = useState([]);
  const [clientEmail, setClientEmail] = useState('');
  const [fundName, setFundName] = useState('');
  const [amount, setAmount] = useState('');
  const [clientBalance, setClientBalance] = useState(null);
  const [subscribedFunds, setSubscribedFunds] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, fundsRes] = await Promise.all([
          axios.get(`${API_URL}/clients/`),
          axios.get(`${API_URL}/funds/`)
        ]);
        setClients(clientsRes.data);
        setFunds(fundsRes.data);
      } catch (error) {
        setMessage('Error obteniendo datos');
        setOpen(true);
      }
    };
    fetchData();
  }, []);

  const handleClientChange = async (e) => {
    setClientEmail(e.target.value);
    const client = clients.find(c => c.email === e.target.value);
    if (client) {
      try {
        const response = await axios.get(`${API_URL}/transactions/client/${client.id}`);
        const filteredFunds = response.data.filter(transaction => transaction.transaction_type === 'apertura');
        setSubscribedFunds(filteredFunds.map(transaction => transaction.fund_id));
      } catch (error) {
        setMessage('Error obteniendo datos');
        setOpen(true);
      }
    }
  };

  const handleFundChange = (e) => {
    setFundName(e.target.value);
    const fund = funds.find(f => f.name === e.target.value);
    if (fund) {
      setAmount(fund.minimum_amount);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const client = clients.find(c => c.email === clientEmail);
      const fund = funds.find(f => f.name === fundName);
      const response = await axios.post(`${API_URL}/transactions/unsubscribe/`, {
        client_id: client.id,
        fund_id: fund.id,
        transaction_type: 'cancelacion',
        amount: parseInt(amount)
      });
      setMessage(response.data.message);
      setOpen(true);

      const clientResponse = await axios.get(`${API_URL}/clients/${client.id}`);
      setClientBalance(clientResponse.data.balance);
    } catch (error) {
      setMessage(error.response.data.detail);
      setOpen(true);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Cancelar Suscripción al Fondo
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Cliente</InputLabel>
          <Select
            value={clientEmail}
            onChange={handleClientChange}
            label="Cliente"
          >
            {clients.map(client => (
              <MenuItem key={client.id} value={client.email}>{client.email}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Fondo</InputLabel>
          <Select
            value={fundName}
            onChange={handleFundChange}
            label="Fondo"
          >
            {funds
              .filter(fund => subscribedFunds.includes(fund.id))
              .map(fund => (
                <MenuItem key={fund.id} value={fund.name}>{fund.name}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          label="Monto"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button variant="contained" color="secondary" type="submit">
          Cancelar Suscripción
        </Button>

        {clientBalance !== null && (
        <Typography variant="h3" gutterBottom>
          Saldo Actual del Cliente: {clientBalance}
        </Typography>
        )}
      </form>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </Container>
  );
};

export default UnsubscribeFund;
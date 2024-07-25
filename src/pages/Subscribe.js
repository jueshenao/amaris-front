import React, { useState, useEffect } from 'react';
import { subscribeToFund, getFunds, getClients } from '../services/api';

const Subscribe = () => {
  const [fundId, setFundId] = useState('');
  const [amount, setAmount] = useState('');
  const [clientId, setClientId] = useState('');
  const [funds, setFunds] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedFunds = await getFunds();
        const fetchedClients = await getClients();
        setFunds(fetchedFunds);
        setClients(fetchedClients);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { fund_id: fundId, amount: parseFloat(amount), client_id: clientId, transaction_type: 'aperturas' };
    const response = await subscribeToFund(data);
    alert(response.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={fundId} onChange={(e) => setFundId(e.target.value)}>
        <option value="">Seleccione un Fondo</option>
        {funds.map((fund) => (
          <option key={fund.id} value={fund.id}>{fund.name}</option>
        ))}
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
        <option value="">Seleccione un Cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>{client.email}</option>
        ))}
      </select>
      <button type="submit">Subscribe</button>
    </form>
  );
}

export default Subscribe;
import React, { useState, useEffect } from 'react';
import { getTransactions, getClientById, getFundById } from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        const transactionsWithNames = await Promise.all(data.map(async transaction => {
          const client = await getClientById(transaction.client_id);
          const fund = await getFundById(transaction.fund_id);
          return {
            ...transaction,
            client_email: client.email,
            fund_name: fund.name
          };
        }));
        setTransactions(transactionsWithNames);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions with names:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Historial de Transacciones</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fondo</th>
            <th>Tipo de Transacción</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.client_email}</td> {/* Nombre del cliente */}
              <td>{transaction.fund_name}</td> {/* Nombre del fondo */}
              <td>{transaction.transaction_type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
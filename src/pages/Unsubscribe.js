import React, { useState, useEffect } from 'react';
import { getClientById, getClientBalance, getTransactions, getFunds, unsubscribeFromFund, getClients } from '../services/api';

const Unsubscribe = () => {
  const [clientId, setClientId] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [funds, setFunds] = useState([]);
  const [clients, setClients] = useState([]); // Lista de clientes
  const [selectedClientEmail, setSelectedClientEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la lista de clientes y fondos
        const fetchedClients = await getClients();
        setClients(fetchedClients);
        const fetchedFunds = await getFunds();
        setFunds(fetchedFunds);

        if (clientId) {
          // Obtener las transacciones del cliente
          const fetchedTransactions = await getTransactions();
          const clientTransactions = fetchedTransactions.filter(tx => tx.client_id === clientId);
          setTransactions(clientTransactions);

          // Obtener balance del cliente
          const fetchedBalance = await getClientBalance(clientId);
          setBalance(fetchedBalance);

          // Obtener el email del cliente seleccionado
          const selectedClient = fetchedClients.find(client => client.id === clientId);
          setSelectedClientEmail(selectedClient?.email || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [clientId]);

  const handleUnsubscribe = async (fundId) => {
    try {
      // Obtener la transacción correspondiente al fondo seleccionado
      const transaction = transactions.find(tx => tx.fund_id === fundId);

      if (!transaction) {
        alert('No se encontró la transacción para este fondo.');
        return;
      }

      if (transaction.transaction_type === 'cancelaciones') {
        alert('La suscripción ya está cancelada.');
        return;
      }

      // Verificar el saldo actual
      const currentBalance = await getClientBalance(clientId);

      // Obtener el monto de la transacción para el fondo seleccionado
      const amountToUnsubscribe = transaction.amount;

      // Realizar la desubscripción
      const response = await unsubscribeFromFund({ fund_id: fundId, client_id: clientId, amount: amountToUnsubscribe, transaction_type: 'cancelaciones' });

      if (response.message.includes('realizada con éxito')) {
        // Actualizar el saldo después de la cancelación
        const updatedBalance = currentBalance - amountToUnsubscribe;

        if (updatedBalance < 0) {
          alert('Error: El saldo no puede ser negativo.');
          return;
        }

        setBalance(updatedBalance);
        setTransactions(transactions.filter(tx => tx.fund_id !== fundId));
      } else {
        alert('Error al cancelar la suscripción.');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  return (
    <div>
      <h2>Cancelar Suscripción</h2>
      <form>
        <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
          <option value="">Seleccione un Cliente</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.email}
            </option>
          ))}
        </select>

        {clientId && (
          <div>
            <h3>Email del Cliente: {selectedClientEmail}</h3>
            <h4>Saldo del Cliente: {balance}</h4>

            <table>
              <thead>
                <tr>
                  <th>Fondo</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const fund = funds.find(fund => fund.id === transaction.fund_id);

                  return (
                    <tr key={transaction.id}>
                      <td>{fund?.name}</td>
                      <td>{transaction.amount}</td>
                      <td>{transaction.transaction_type === 'aperturas' ? 'Activa' : 'Cancelada'}</td>
                      <td>
                        {transaction.transaction_type === 'aperturas' && (
                          <button onClick={() => handleUnsubscribe(transaction.fund_id)}>Cancelar</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </form>
    </div>
  );
}

export default Unsubscribe;
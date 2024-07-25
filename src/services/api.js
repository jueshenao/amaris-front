const API_URL = "http://127.0.0.1:8000/api"; // Ajusta esta URL según sea necesario

export const subscribeToFund = async (data) => {
  const response = await fetch(`${API_URL}/transactions/subscribe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

export const unsubscribeFromFund = async (data) => {
  const response = await fetch(`${API_URL}/transactions/unsubscribe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

export const getTransactions = async () => {
    try {
        const response = await fetch(`${API_URL}/transactions/`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const getFunds = async () => {
    try {
        const response = await fetch(`${API_URL}/funds/`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching funds:', error);
        throw error;
    }
};

export const getClients = async () => {
    try {
        const response = await fetch(`${API_URL}/clients/`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
};

export const getClientById = async (clientId) => {
    try {
        const response = await fetch(`${API_URL}/clients/${clientId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching client:', error);
        throw error;
    }
};

export const getFundById = async (fundId) => {
    try {
        const response = await fetch(`${API_URL}/funds/${fundId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching fund:', error);
        throw error;
    }
};

export const getClientSubscriptions = async (clientId) => {
    try {
        const response = await fetch(`${API_URL}/transactions/fund/${clientId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching client subscriptions:', error);
        throw error;
    }
};

export const getClientBalance = async (clientId) => {
    try {
        const response = await fetch(`${API_URL}/clients/${clientId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        return data.balance;
    } catch (error) {
        console.error('Error fetching client balance:', error);
        throw error;
    }
};

export const getClientTransactions = async (clientId) => {
  try {
    const response = await fetch(`${API_URL}/transactions/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client transactions:', error);
    throw error;
  }
};
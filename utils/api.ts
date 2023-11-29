const headers = {
  'Content-Type': 'application/json',
  // 'Content-Type': 'application/x-www-form-urlencoded',
}

async function POST<T>(url: string, data?: any): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const { message, cause } = await response.json()
    throw new Error(message, { cause })
  }

  return response.json()
}

async function GET<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const { message, cause } = await response.json()
    throw new Error(message, { cause })
  }

  return response.json()
}

export const api = {
  GET,
  POST,
}

export default api

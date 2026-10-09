export default async function handler(req, res) {
  // Configurar CORS para permitir que tu frontend consulte esta API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { sku } = req.query;
  if (!sku) {
    return res.status(400).json({ success: false, error: 'Falta el parámetro SKU' });
  }

  try {
    // Se conecta a tu API principal usando el token privado del servidor
    const apiResponse = await fetch(`https://xml-json-feed-magento-cda.vercel.app/api/feed?mode=graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_SECRET_TOKEN}` // <-- Token seguro del servidor
      },
      body: JSON.stringify({
        query: `query GetProduct($sku: String!) { product(sku: $sku) { sku nombre catalogo { descripcion descripcion_corta atributos } } }`,
        variables: { sku: sku }
      })
    });

    const data = await apiResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
import { NextResponse } from 'next/server';
import  { MercadoPagoConfig, Preference } from 'mercadopago';

// Configura el SDK de Mercado Pago con tu access token
const mercadopago = new MercadoPagoConfig({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

export async function POST(request) {
  const { title, price, quantity } = await request.json();

  // Crea un objeto de preferencia
  let preference = {
    items: [
      {
        title: title,
        unit_price: Number(price),
        quantity: Number(quantity),
      }
    ],
    back_urls: {
      "success": "http://localhost:3000/success",
      "failure": "http://localhost:3000/failure",
      "pending": "http://localhost:3000/pending"
    },
    auto_return: "approved",
  };

  try {
    const response = await await new Preference(mercadopago).create(preference);
    return NextResponse.json({ id: response.body.id });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error al crear la preferencia de pago' }, { status: 500 });
  }
}
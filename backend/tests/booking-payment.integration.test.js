const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/server');
const pool = require('../src/config/db');

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

test('booking to paid webhook flow', async (t) => {
  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(checkIn.getDate() + 5);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 2);

  const checkInDate = isoDate(checkIn);
  const checkOutDate = isoDate(checkOut);

  let availableRoomsResponse;
  try {
    availableRoomsResponse = await request(app)
      .get('/available-rooms')
      .query({
        check_in_date: checkInDate,
        check_out_date: checkOutDate
      });
  } catch (error) {
    t.skip(`Database likely unavailable for integration test: ${error.message}`);
    return;
  }

  assert.equal(availableRoomsResponse.status, 200);
  assert.ok(Array.isArray(availableRoomsResponse.body));

  if (!availableRoomsResponse.body.length) {
    t.skip('No available rooms found for integration test window');
    return;
  }

  const roomId = availableRoomsResponse.body[0].id;
  const random = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const holdResponse = await request(app)
    .post('/reservation-holds')
    .send({
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      room_ids: [roomId],
      guest_email: `integration-${random}@example.com`
    });

  assert.equal(holdResponse.status, 201);
  assert.ok(holdResponse.body.hold_token);

  const reservationResponse = await request(app)
    .post('/reservations')
    .send({
      first_name: 'Integration',
      last_name: 'Test',
      email: `integration-${random}@example.com`,
      phone: '09000000000',
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      adult_count: 2,
      child_count: 0,
      room_ids: [roomId],
      hold_token: holdResponse.body.hold_token
    });

  assert.equal(
    reservationResponse.status,
    201,
    `Reservation creation failed: ${JSON.stringify(reservationResponse.body)}`
  );
  assert.ok(reservationResponse.body.reservation_code);

  const reservationCode = reservationResponse.body.reservation_code;
  const reservationId = reservationResponse.body.reservation_id;

  const prePaymentLookup = await request(app)
    .get(`/reservations/code/${encodeURIComponent(reservationCode)}`);

  assert.equal(prePaymentLookup.status, 200);
  const fullAmount = Number(prePaymentLookup.body.total_amount || 0);
  assert.ok(Number.isFinite(fullAmount) && fullAmount > 0);

  const paymentResponse = await request(app)
    .post('/payments')
    .send({
      reservation_id: reservationId,
      payment_method: 'e_wallet',
      payment_channel: 'GCash',
      amount: fullAmount,
      payment_status: 'pending',
      reference_number: `TEST-${random}`
    });

  assert.equal(paymentResponse.status, 201);

  const webhookResponse = await request(app)
    .post('/payments/webhooks/generic')
    .send({
      provider: 'integration_test',
      event_id: `event-${random}`,
      reservation_id: reservationId,
      reservation_code: reservationCode,
      payment_method: 'e_wallet',
      payment_channel: 'GCash',
      payment_status: 'paid',
      amount: fullAmount,
      reference_number: `WEBHOOK-${random}`
    });

  assert.equal(webhookResponse.status, 200);

  const lookupResponse = await request(app)
    .get(`/reservations/code/${encodeURIComponent(reservationCode)}`);

  assert.equal(lookupResponse.status, 200);
  assert.equal(lookupResponse.body.payment_status, 'paid');
  assert.equal(lookupResponse.body.reservation_status, 'confirmed');
  assert.ok(lookupResponse.body.confirmation_code);
});

test.after(async () => {
  await pool.end();
});

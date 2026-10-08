/**
 * Firebase Cloud Functions for Z CAFÉ
 * Includes order status notification triggers and daily stock reset cron
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * Triggered whenever an order status changes.
 * Sends SMS/WhatsApp webhook alert when status becomes 'ready'
 */
exports.onOrderStatusChanged = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Check if status changed to 'ready'
    if (beforeData.status !== 'ready' && afterData.status === 'ready') {
      const { token, customerPhone, customerName } = afterData;
      console.log(`[Order Ready] Alert for ${customerName} (Phone: ${customerPhone}, Token: ${token})`);

      // WhatsApp / SMS API trigger integration point (e.g. Twilio or Gupshup)
      // Example payload:
      const payload = {
        to: customerPhone,
        message: `Hello ${customerName}! Your Z CAFÉ order #${token} is READY for pickup at the counter! ☕🥟`,
      };

      try {
        // Optional webhook POST to WhatsApp Business Provider:
        // await fetch('https://api.sms-provider.com/send', { method: 'POST', body: JSON.stringify(payload) });
      } catch (err) {
        console.error('Error dispatching SMS/WhatsApp alert:', err);
      }
    }

    return null;
  });

/**
 * Scheduled Cloud Function: Resets item daily stock every morning at 06:00 AM IST
 * Cron: "0 6 * * *" in Asia/Kolkata timezone
 */
exports.resetDailyMenuStock = functions.pubsub
  .schedule('0 6 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    console.log('[Daily Stock Reset] Resetting Z CAFÉ menu stock for new day...');

    const menuSnapshot = await db.collection('menu').get();
    const batch = db.batch();

    menuSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.dailyStock) {
        batch.update(doc.ref, {
          remainingStock: data.dailyStock,
          isAvailable: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });

    await batch.commit();
    console.log('[Daily Stock Reset] Successfully refreshed all counters.');
    return null;
  });

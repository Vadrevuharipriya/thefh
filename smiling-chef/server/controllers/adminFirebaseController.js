import 'dotenv/config';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function normalizeFirebasePrivateKey(key) {
  if (!key) return key;
  let normalizedKey = key.trim();
  if ((normalizedKey.startsWith('"') && normalizedKey.endsWith('"')) ||
      (normalizedKey.startsWith("'") && normalizedKey.endsWith("'"))) {
    normalizedKey = normalizedKey.slice(1, -1);
  }
  return normalizedKey.replace(/\\n/g, '\n').replace(/\r/g, '').trim();
}

function getFirebaseServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    try {
      const parsed = JSON.parse(serviceAccountJson);
      if (parsed.private_key) parsed.private_key = normalizeFirebasePrivateKey(parsed.private_key);
      return parsed;
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON', err.message);
      return null;
    }
    
  }

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    return null;
  }

  return {
    project_id: process.env.FIREBASE_PROJECT_ID.trim(),
    client_email: process.env.FIREBASE_CLIENT_EMAIL.trim(),
    private_key: normalizeFirebasePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
  };
}

function initFirebaseAdmin() {
  if (getApps().length) return;
  const svc = getFirebaseServiceAccount();
  if (!svc) throw new Error('Firebase credentials not configured');
  initializeApp({
    credential: cert({
      projectId: svc.project_id || svc.projectId,
      clientEmail: svc.client_email || svc.clientEmail,
      privateKey: svc.private_key || svc.privateKey,
    }),
  });
}

export async function getFirebaseChefs(req, res) {
  
  try {
    initFirebaseAdmin();
    const db = getFirestore();

    const snapshot = await db.collection('users').get();

    const chefs = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const d = doc.data();

        let bookingCount = 0;

        try {
          const bookings = await fetchChefBookingDocs(doc.id);
          bookingCount = bookings.length;
        } catch (err) {
          console.error(
            `Failed to count bookings for chef ${doc.id}:`,
            err.message
          );
        }
        

        return {
          firebaseId: doc.id,
          name: d.name || d.displayName || '',
          email: d.email || '',
          mobile: d.phone || d.mobile || d.contact || '',
          city: d.city || d.location || '',
          cuisines: d.cuisines || d.cuisine || [],
          serviceTypes: d.serviceTypes || [],
          rating: d.rating || 0,

          // FIXED
          events: bookingCount,

          earnings: d.earnings || null,
          displayStatus: d.displayStatus || d.status || 'Approved',
          image: d.image || '',
          bio: d.bio || '',
          raw: d,
        };
      })
    );

    res.json(chefs);
  } catch (err) {
    console.error(
      'Failed to fetch Firebase chefs:',
      err.message || err
    );

    res.status(500).json({
      error: 'Failed to fetch Firebase chefs',
    });
  }
}

function normalizeFirebaseChefDoc(id, data) {
  if (!data) return null;
  return {
    firebaseId: id,
    name: data.name || data.displayName || '',
    role: data.role || '',
    city: data.city || data.location || '',
    experience: data.experience != null ? Number(data.experience) : '',
    email: data.email || '',
    mobile: data.phone || data.mobile || data.contact || '',
    emergencyContact: data.emergencyContact || '',
    gender: data.gender || '',
    jobPreference: data.jobPreference || '',
    cuisines: Array.isArray(data.cuisines) ? data.cuisines : (data.cuisines ? [data.cuisines] : []),
    pincode: data.pincode || '',
    communicationAddress: data.communicationAddress || data.address || '',
    permanentAddress: data.permanentAddress || '',
    zone: data.zone || '',
    aadhaarNumber: data.aadhaarNumber || '',
    panNumber: data.panNumber || '',
    bankAccountNumber: data.bankAccountNumber || '',
    ifscCode: data.ifscCode || '',
    bankName: data.bankName || '',
    upiNumber: data.upiNumber || '',
    aadhaarFrontUrl: data.aadhaarFrontUrl || '',
    aadhaarBackUrl: data.aadhaarBackUrl || '',
    panDocumentUrl: data.panDocumentUrl || '',
    displayStatus: data.displayStatus || data.status || 'Approved',
    image: data.image || '',
    rating: data.rating ?? 0,
    events: data.events ?? 0,
    earnings: data.earnings || null,
    bio: data.bio || '',
    serviceTypes: Array.isArray(data.serviceTypes) ? data.serviceTypes : (data.serviceTypes ? [data.serviceTypes] : []),
    raw: data,
  };
}

function buildFirebaseUpdatePayload(body) {
  const flattened = { ...body, ...(body.profile || {}) };
  delete flattened.profile;

  const allowedKeys = [
    'name', 'role', 'city', 'experience', 'email', 'mobile', 'phone', 'contact',
    'emergencyContact', 'gender', 'jobPreference', 'cuisines', 'serviceTypes',
    'rating', 'events', 'earnings', 'displayStatus', 'image', 'bio', 'followers',
    'awards', 'pincode', 'communicationAddress', 'permanentAddress', 'zone',
    'aadhaarNumber', 'panNumber', 'bankAccountNumber', 'ifscCode', 'bankName',
    'upiNumber', 'aadhaarFrontUrl', 'aadhaarBackUrl', 'panDocumentUrl',
  ];

  const payload = {};
  allowedKeys.forEach((key) => {
    if (flattened[key] !== undefined) {
      payload[key] = flattened[key];
    }
  });

  if (payload.cuisines && typeof payload.cuisines === 'string') {
    payload.cuisines = payload.cuisines.split(',').map((item) => item.trim()).filter(Boolean);
  }

  if (payload.experience !== undefined && payload.experience !== null) {
    const numberValue = Number(payload.experience);
    if (!Number.isNaN(numberValue)) {
      payload.experience = numberValue;
    } else {
      delete payload.experience;
    }
  }

  if (payload.mobile && !payload.phone) {
    payload.phone = payload.mobile;
  }

  if (payload.phone && !payload.mobile) {
    payload.mobile = payload.phone;
  }

  return payload;
}

export async function getFirebaseChefById(id) {
  initFirebaseAdmin();
  const db = getFirestore();
  const doc = await db.collection('users').doc(id).get();
  if (!doc.exists) return null;
  
  return normalizeFirebaseChefDoc(doc.id, doc.data());
}

export async function updateFirebaseChefById(id, body) {
  initFirebaseAdmin();
  const db = getFirestore();
  const chefRef = db.collection('users').doc(id);
  const snapshot = await chefRef.get();
  if (!snapshot.exists) return null;
  const payload = buildFirebaseUpdatePayload(body);
  if (Object.keys(payload).length > 0) {
    await chefRef.set(payload, { merge: true });
  }
  const updated = await chefRef.get();
  return normalizeFirebaseChefDoc(updated.id, updated.data());
}

export async function deleteFirebaseChefById(id) {
  initFirebaseAdmin();
  const db = getFirestore();
  const chefRef = db.collection('users').doc(id);
  const snapshot = await chefRef.get();
  if (!snapshot.exists) return false;
  await chefRef.delete();
  return true;
}

function normalizeFirebaseBookingDoc(id, data) {
  const getDateValue = (value) => {
    if (!value) return '';
    if (typeof value.toDate === 'function') {
      return value.toDate().toISOString();
    }
    if (!isNaN(Date.parse(value))) {
      return new Date(value).toISOString();
    }
    return String(value);
  };

  return {
    id,
    client: data.client || data.customer || data.user || data.name || '',
    eventType: data.eventType || data.occasion || data.type || '',
    date: getDateValue(data.date || data.eventDate || data.eventDateTime || data.dateTime || data.datetime),
    time: data.time || data.eventTime || data.startTime || '',
    guest: data.guest || data.guests || data.guestCount || data.numberOfPeople || 0,
    amount: data.amount || data.price || data.total || 0,
    status: data.status || data.bookingStatus || data.orderStatus || '',
    raw: data,
  };
}

async function fetchChefBookingDocs(chefId) {
  const db = getFirestore();

  const collections = [
    'bookings',
    'orders',
    'orderInquiry',
    'inquiries',
  ];

  const results = [];

  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName).get();

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Only count bookings assigned to this chef
        if (data.partnerId === chefId) {
          results.push(
            normalizeFirebaseBookingDoc(
              doc.id,
              data
            )
          );
        }
      });
    } catch (err) {
      console.error(
        `Error reading ${collectionName}:`,
        err.message
      );
    }
  }

  return results;
}

export async function getFirebaseChefBookingsById(req, res) {
  try {
    initFirebaseAdmin();
    const { id } = req.params;
    const bookings = await fetchChefBookingDocs(id);
    res.json(bookings);
  } catch (err) {
    console.error('Failed to fetch Firebase chef bookings:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch Firebase chef bookings' });
  }
}

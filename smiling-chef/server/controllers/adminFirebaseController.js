import 'dotenv/config';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import Chef from '../models/Chef.js';

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
    await syncAllFirebaseChefsToMongo();
    const db = getFirestore();

    const snapshot = await db.collection('users').get();

    const chefs = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const d = doc.data();
        const kyc = d.kycDocuments || {};

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
          displayStatus: d.displayStatus || d.status || 'Pending',
          image: d.image || '',
          bio: d.bio || '',
          aadhaarNumber: d.aadhaarNumber || d.aadharNumber || kyc.aadharNumber || '',
          aadhaarFrontUrl: d.aadhaarFrontUrl || kyc.aadharFrontUrl || '',
          aadhaarBackUrl: d.aadhaarBackUrl || kyc.aadharBackUrl || '',
          panDocumentUrl: d.panDocumentUrl || kyc.panUrl || '',
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
  const kyc = data.kycDocuments || {};
  
  return {
    firebaseId: id,
    name: data.name || data.displayName || '',
    role: data.role || '',
    city: data.city || data.location || '',
    experience: data.experience != null ? Number(data.experience) : '',
    email: data.email || '',
    mobile: data.phone || data.mobile || data.contact || '',
    emergencyContact: data.emergencyContact || data.emergencyPhone || '',
    gender: data.gender || '',
    jobPreference: data.jobPreference || '',
    cuisines: Array.isArray(data.cuisines) ? data.cuisines : (data.cuisines ? [data.cuisines] : []),
    pincode: data.pincode || data.pinCode || '',
    communicationAddress: data.communicationAddress || data.address || kyc.communicationAddress || '',
    permanentAddress: data.permanentAddress || kyc.permanentAddress || '',
    zone: data.zone || '',
    aadhaarNumber: data.aadhaarNumber || data.aadharNumber || kyc.aadharNumber || '',
    panNumber: data.panNumber || kyc.panNumber || '',
    bankAccountNumber: data.bankAccountNumber || '',
    ifscCode: data.ifscCode || '',
    bankName: data.bankName || '',
    upiNumber: data.upiNumber || '',
    aadhaarFrontUrl: data.aadhaarFrontUrl || kyc.aadharFrontUrl || '',
    aadhaarBackUrl: data.aadhaarBackUrl || kyc.aadharBackUrl || '',
    panDocumentUrl: data.panDocumentUrl || kyc.panUrl || '',
    displayStatus: data.displayStatus || data.status || 'Pending',
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
  const flattened = {
    ...(body.kycDocuments || {}),
    ...(body.profile || {}),
    ...body,
  };
  delete flattened.profile;
  delete flattened.kycDocuments;

  const allowedKeys = [
    'name', 'role', 'city', 'experience', 'email', 'mobile', 'phone', 'contact',
    'emergencyContact', 'gender', 'jobPreference', 'cuisines', 'serviceTypes',
    'rating', 'events', 'earnings', 'displayStatus', 'status', 'image', 'bio', 'followers',
    'awards', 'pincode', 'communicationAddress', 'permanentAddress', 'zone',
    'aadhaarNumber', 'aadharNumber', 'panNumber', 'bankAccountNumber', 'ifscCode', 'bankName',
    'upiNumber', 'aadhaarFrontUrl', 'aadharFrontUrl', 'aadhaarBackUrl', 'aadharBackUrl', 'panDocumentUrl', 'panUrl',
  ];

  // Map normalized field names to Firebase field names
  const payload = {};
  allowedKeys.forEach((key) => {
    if (flattened[key] !== undefined) {
      payload[key] = flattened[key];
    }
  });

  // Handle field name mapping for Firebase (aadhaar -> aadhar)
  if (payload.aadhaarNumber && !payload.aadharNumber) {
    payload.aadharNumber = payload.aadhaarNumber;
    delete payload.aadhaarNumber;
  }
  if (payload.aadhaarFrontUrl && !payload.aadharFrontUrl) {
    payload.aadharFrontUrl = payload.aadhaarFrontUrl;
    delete payload.aadhaarFrontUrl;
  }
  if (payload.aadhaarBackUrl && !payload.aadharBackUrl) {
    payload.aadharBackUrl = payload.aadhaarBackUrl;
    delete payload.aadhaarBackUrl;
  }
  if (payload.panDocumentUrl && !payload.panUrl) {
    payload.panUrl = payload.panDocumentUrl;
    delete payload.panDocumentUrl;
  }
  if (payload.status && !payload.displayStatus) {
    payload.displayStatus = payload.status;
    delete payload.status;
  }

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

  if (payload.status && !payload.displayStatus) {
    payload.displayStatus = payload.status;
    delete payload.status;
  }

  return payload;
}

export async function syncAllFirebaseChefsToMongo() {
  initFirebaseAdmin();
  const db = getFirestore();
  const snapshot = await db.collection('users').get();

  for (const doc of snapshot.docs) {
    try {
      await syncFirebaseChefToMongo(doc.id);
    } catch (err) {
      console.error(`Failed to sync Firebase chef ${doc.id} to Mongo:`, err.message || err);
    }
  }
}

export async function syncUnlinkedMongoChefsToFirebase() {
  const unlinkedChefs = await Chef.find({
    $or: [
      { firebaseId: { $exists: false } },
      { firebaseId: null },
      { firebaseId: '' },
    ],
  });

  for (const chef of unlinkedChefs) {
    try {
      await syncChefToFirebase(chef);
    } catch (err) {
      console.error(`Failed to sync Mongo chef ${chef._id} to Firebase:`, err.message || err);
    }
  }
}

export async function syncChefToFirebase(chefDoc, changes = {}) {
  initFirebaseAdmin();
  if (!chefDoc) throw new Error('Chef document is required for Firebase sync');

  const source = chefDoc.toObject ? chefDoc.toObject() : chefDoc;
  const payload = buildFirebaseUpdatePayload({ ...source, ...changes });

  if (!chefDoc.firebaseId) {
    const firebaseChef = await createFirebaseChefById(payload);
    if (chefDoc.toObject && chefDoc.save) {
      chefDoc.firebaseId = firebaseChef.firebaseId;
      await chefDoc.save();
    }
    return firebaseChef;
  }

  const updatedFirebaseChef = await updateFirebaseChefById(chefDoc.firebaseId, payload);
  if (updatedFirebaseChef) {
    return updatedFirebaseChef;
  }

  const firebaseChef = await createFirebaseChefById(payload);
  if (chefDoc.toObject && chefDoc.save) {
    chefDoc.firebaseId = firebaseChef.firebaseId;
    await chefDoc.save();
  }
  return firebaseChef;
}

export async function syncFirebaseChefToMongo(firebaseId, overrides = {}) {
  initFirebaseAdmin();
  const firebaseChef = await getFirebaseChefById(firebaseId);
  if (!firebaseChef) return null;

  const existing = await Chef.findOne({ firebaseId });
  const chefData = {
    ...firebaseChef,
    ...overrides,
    firebaseId: firebaseChef.firebaseId,
  };

  if (!chefData.slug) {
    const baseSlug = firebaseChef.name
      ? firebaseChef.name.toString().trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
      : `chef-${firebaseId.slice(0, 5)}`;
    chefData.slug = `${baseSlug}-${firebaseId.slice(0, 5)}`;
  }

  if (existing) {
    return await Chef.findByIdAndUpdate(existing._id, chefData, {
      new: true,
      setDefaultsOnInsert: true,
    });
  }

  return await Chef.create(chefData);
}

export async function createFirebaseChefById(body) {
  initFirebaseAdmin();
  const db = getFirestore();
  const payload = buildFirebaseUpdatePayload(body);

  if (!payload.name) {
    throw new Error('Chef name is required');
  }

  payload.displayStatus = payload.displayStatus || 'Pending';
  payload.role = payload.role || 'Chef';

  const docRef = await db.collection('users').add(payload);
  const doc = await docRef.get();
  return normalizeFirebaseChefDoc(doc.id, doc.data());
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

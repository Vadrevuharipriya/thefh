# API Response Standardization Implementation

## Overview
All API endpoints now return standardized response formats for both success and error scenarios. This ensures consistent frontend integration, simplified error handling, and improved API maintainability.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**HTTP Status Codes:**
- `200 OK` - For successful GET, PUT requests
- `201 Created` - For successful POST requests
- `204 No Content` - For successful DELETE requests (optional)

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": null
}
```

**HTTP Status Codes:**
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication failures
- `403 Forbidden` - Authorization failures
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server errors

## Implementation Details

### Response Handler Utility
All responses are managed through `/utils/responseHandler.js` which provides the following functions:

#### Success Responses
```javascript
// Generic success response
sendSuccess(res, data, message = 'Operation successful', statusCode = 200)

// Example
return sendSuccess(res, { user: userData }, 'User created successfully', 201);
```

#### Error Responses
```javascript
// Generic error response
sendError(res, error, statusCode = 400, details = null)

// Validation error (422)
sendValidationError(res, message, details = null)

// Unauthorized (401)
sendUnauthorized(res, message = 'Unauthorized')

// Forbidden (403)
sendForbidden(res, message = 'Forbidden')

// Not found (404)
sendNotFound(res, message = 'Resource not found')

// Server error (500)
sendServerError(res, message = 'Internal server error', details = null)
```

## Updated Controllers

The following controllers have been updated to use the standardized response format:

### ✅ Completed
- `authController.js` - All authentication endpoints
- `servicesController.js` - All CRUD operations
- `blogsController.js` - All CRUD operations
- `requireUserAuth.js` - User authentication middleware
- `requireAdmin.js` - Admin authorization middleware

### 📋 Remaining (Follow the pattern below)
- `mealsController.js`
- `chefsController.js`
- `cuisinesController.js`
- `enquiryController.js`
- `orderInquiryController.js`
- `testimonialsController.js`
- And all other controllers in `/controllers` directory

## How to Update Remaining Controllers

### Step 1: Add Import
At the top of the controller file, add:
```javascript
import { 
  sendSuccess, 
  sendError, 
  sendValidationError, 
  sendUnauthorized, 
  sendForbidden,
  sendNotFound, 
  sendServerError 
} from '../utils/responseHandler.js';
```

### Step 2: Replace Response Patterns

**Before (Old Pattern):**
```javascript
export const getItems = async (req, res) => {
  try {
    const data = await Item.find();
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};
```

**After (New Pattern):**
```javascript
export const getItems = async (req, res) => {
  try {
    const data = await Item.find();
    return sendSuccess(res, data, 'Items retrieved successfully');
  } catch (err) {
    console.error('Error:', err);
    return sendServerError(res, 'Failed to fetch items');
  }
};
```

### Step 3: Handle Common Scenarios

**Validation Error:**
```javascript
if (!email || !password) {
  return sendValidationError(res, 'Email and password required');
}
```

**Not Found:**
```javascript
const item = await Item.findById(id);
if (!item) {
  return sendNotFound(res, 'Item not found');
}
return sendSuccess(res, item);
```

**Create (201 status):**
```javascript
const created = await Item.create(data);
return sendSuccess(res, created, 'Item created successfully', 201);
```

**Delete (with null data):**
```javascript
await Item.findByIdAndDelete(id);
return sendSuccess(res, null, 'Item deleted successfully');
```

**Error with Details:**
```javascript
catch (err) {
  console.error('Error:', err);
  return sendServerError(res, 'Failed to create item', err.message);
}
```

## Frontend Integration

### Axios Interceptors Example
```javascript
// Add response interceptor to handle standardized responses
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.success === false) {
      // Handle error responses
      throw new Error(response.data.error);
    }
    return response.data.data; // Return only the data
  },
  (error) => {
    // Handle network errors
    throw error;
  }
);
```

### Fetch API Example
```javascript
const response = await fetch('/api/endpoint');
const json = await response.json();

if (!json.success) {
  // Handle error
  console.error(json.error);
  return;
}

// Use json.data for the actual response data
const data = json.data;
```

## Benefits

✅ **Consistent API Contract** - All endpoints follow the same structure
✅ **Simplified Frontend Error Handling** - Predictable error structure
✅ **Better Debugging** - Error messages and details included
✅ **HTTP Status Codes** - Proper semantic status codes for different scenarios
✅ **Maintainability** - Centralized response handling logic
✅ **Security** - Reduced exposure to sensitive error details in production

## Testing

After updating a controller, test the endpoints to ensure:
1. Success responses include `{ success: true, data: {...}, message: "..." }`
2. Error responses include `{ success: false, error: "...", details: null }`
3. HTTP status codes are correct (200, 201, 400, 401, 403, 404, 500)
4. Error messages are user-friendly and non-technical

## Rollout Schedule

- Phase 1: ✅ Core authentication and service endpoints
- Phase 2: Blog and meal management endpoints
- Phase 3: Remaining CRUD controllers
- Phase 4: Update frontend clients to expect new format
- Phase 5: Deprecate old response format (if applicable)

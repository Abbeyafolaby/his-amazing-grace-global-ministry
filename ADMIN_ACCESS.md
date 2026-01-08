# Admin Access Guide

## How to Access the Admin Dashboard

The admin dashboard button has been removed from the landing page. Instead, admin access is now integrated into the main application for a better user experience.

### New Admin Access Flow

1. **Login normally** with your account credentials (email & password)
2. Once logged in, if your account has `isAdmin: true` in the database, you'll see an **Admin** button in the header next to the Logout button
3. Click the **Admin** button to access the admin dashboard
4. Click **Back to Home** to return to the main app

### Setting Up Admin Users

Admin privileges are controlled by the `isAdmin` flag in the MongoDB database:

#### Option 1: Using MongoDB Compass (GUI)
1. Open MongoDB Compass and connect to your database
2. Navigate to `his-amazing-grace` → `users` collection
3. Find the user you want to make an admin
4. Double-click on the document to edit
5. Add or modify the field: `isAdmin: true`
6. Click **Update**

#### Option 2: Using MongoDB Shell
```javascript
// Connect to your database
use his-amazing-grace

// Update a user to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)

// Verify the update
db.users.findOne({ email: "your-email@example.com" })
```

#### Option 3: Using a REST client (like Postman)
If you add a backend route for this in the future, you could create an endpoint like:
```
PUT /api/admin/users/:userId/promote
```

### Benefits of the New Approach

✅ **Cleaner landing page** - No confusing admin button for regular users  
✅ **Better security** - Admin status is tied to database records, not a simple code  
✅ **Better UX** - Admins just login normally and get admin features automatically  
✅ **Scalable** - Easy to add/remove admin privileges without code changes  
✅ **Role-based** - Can be extended to support multiple roles in the future

### Important Notes

- Users must **log out and log back in** after being granted admin privileges for the change to take effect
- The JWT token contains the `isAdmin` status from when they logged in
- Only users with `isAdmin: true` will see the Admin button in the header
- Admin routes are protected on the backend - even if someone tries to access admin endpoints without permission, they'll be rejected

### Testing Admin Access

1. Register a new user through the UI
2. Use MongoDB to set `isAdmin: true` for that user
3. Log out from the application
4. Log back in with the admin user
5. You should now see the **Admin** button next to the Logout button
6. Click it to access the admin dashboard

---

**Previous Method (Removed)**:  
~~Landing page had an "Admin Dashboard" button that prompted for a 5-digit code~~

**New Method**:  
Login normally → Automatic admin button appears if you have admin privileges in the database

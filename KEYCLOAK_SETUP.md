# Keycloak Setup Guide for Micro E-Commerce

This guide provides step-by-step instructions for configuring Keycloak OAuth 2.0 server for the Micro E-Commerce platform with proper RBAC (Role-Based Access Control).

## Prerequisites
- Docker and Docker Compose installed and running
- All services started via `docker-compose up`

---

## Step 1: Access Keycloak Admin Console

1. Open your browser and navigate to: **http://localhost:8080**
2. Click on **Administration Console**
3. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `admin`

---

## Step 2: Create Realm

1. Click the **dropdown** in the top-left corner (currently showing "master")
2. Click **Create Realm**
3. Enter Realm name: **`micro-e-com-realm`**
4. Click **Create**

> ⚠️ **Important**: Make sure the realm name is exactly `micro-e-com-realm` as configured in the services.

---

## Step 3: Create Realm Roles

Before creating users, we need to define roles with proper permissions.

### 3.1 Create CUSTOMER Role (Default for Signups)

1. Go to **Realm roles** → Click **Create role**
2. Fill in:
   - **Role name**: `CUSTOMER`
   - **Description**: `Default role for customer users with read permissions`
3. Click **Save**

### 3.2 Create ADMIN Role (Full Permissions)

1. Click **Create role** again
2. Fill in:
   - **Role name**: `ADMIN`
   - **Description**: `Administrator role with full CRUD permissions (create, read, update, delete)`
3. Click **Save**

> 📝 **Note**: 
> - **CUSTOMER**: Has read-only access (browse products, view orders)
> - **ADMIN**: Has full permissions (create/add, read, update, delete products, manage orders, access admin dashboard)

---

## Step 4: Create Client for Backend Services

This client is used by backend microservices to validate tokens and communicate with Keycloak.

1. Go to **Clients** → Click **Create client**

2. **General Settings:**
   - Client type: `OpenID Connect`
   - Client ID: **`micro-e-com-backend-client`**
   - Name: `Backend Microservices`
   - Click **Next**

3. **Capability config:**
   - ✅ **Client authentication**: `ON` (Confidential client)
   - ❌ **Authorization**: `OFF`
   - **Authentication flow**:
     - ✅ **Standard flow**: `ON`
     - ✅ **Direct access grants**: `ON` (enables password grant)
     - ✅ **Service accounts roles**: `ON`
     - ❌ **Implicit flow**: `OFF`
   - Click **Next**

4. **Login settings:**
   - Leave all fields empty (backend service doesn't need redirects)
   - Click **Save**

5. **Get Client Secret** (CRITICAL):
   - Go to **Credentials** tab
   - Copy the **Client secret** value
   - **Save this secret** - you'll need it in Step 10

---

## Step 5: Create Client for React Frontend

This client is used by the React application for user authentication.

1. Go to **Clients** → Click **Create client**

2. **General Settings:**
   - Client type: `OpenID Connect`
   - Client ID: **`micro-e-com-react-client`**
   - Name: `React Frontend Application`
   - Click **Next**

3. **Capability config:**
   - ❌ **Client authentication**: `OFF` (Public client - no secret)
   - ❌ **Authorization**: `OFF`
   - **Authentication flow**:
     - ✅ **Standard flow**: `ON` (Authorization Code Flow)
     - ✅ **Direct access grants**: `ON` (for username/password login)
     - ❌ **Implicit flow**: `OFF`
     - ❌ **Service accounts roles**: `OFF`
   - Click **Next**

4. **Login settings:**
   - **Root URL**: `http://localhost:5173`
   - **Home URL**: `http://localhost:5173`
   - **Valid redirect URIs**: 
     - `http://localhost:5173/*`
     - `http://localhost:3000/*`
   - **Valid post logout redirect URIs**:
     - `http://localhost:5173/*`
     - `http://localhost:3000/*`
   - **Web origins**: 
     - `http://localhost:5173`
     - `http://localhost:3000`
     - `+` (this allows all valid redirect URIs)
   - Click **Save**

---

## Step 6: Create Fixed Admin User 

Create the primary administrator account with full permissions.

1. Go to **Users** → Click **Add user**

2. Fill in user details:
   - **Username**: `admin1` (required)
   - **Email**: `admin1@yopmail.com`
   - **First name**: `Admin1`
   - **Last name**: `Administrator`
   - ✅ **Email verified**: `ON`
   - ✅ **Enabled**: `ON`
   - Click **Create**

3. **Set Password**:
   - Go to **Credentials** tab
   - Click **Set password**
   - **Password**: `admin123`
   - **Password confirmation**: `admin123`
   - ❌ **Temporary**: `OFF` (important - make it permanent)
   - Click **Save**
   - Confirm by clicking **Save password**

4. **Assign ADMIN Role**:
   - Go to **Role mappings** tab
   - Click **Assign role**
   - Filter: Select **"Filter by realm roles"**
   - Select: ✅ **ADMIN**
   - Click **Assign**

> ✅ **Admin user created**: Username: `admin`, Password: `admin#123`

---

## Step 7: Create Test Customer User (Optional)

Create a test customer account for testing.

1. Go to **Users** → Click **Add user**

2. Fill in user details:
   - **Username**: `customer`
   - **Email**: `customer@microecom.com`
   - **First name**: `Test`
   - **Last name**: `Customer`
   - ✅ **Email verified**: `ON`
   - ✅ **Enabled**: `ON`
   - Click **Create**

3. **Set Password**:
   - Go to **Credentials** tab
   - Click **Set password**
   - **Password**: `customer`
   - **Password confirmation**: `customer`
   - ❌ **Temporary**: `OFF`
   - Click **Save**
   - Confirm by clicking **Save password**

4. **Assign CUSTOMER Role**:
   - Go to **Role mappings** tab
   - Click **Assign role**
   - Filter: Select **"Filter by realm roles"**
   - Select: ✅ **CUSTOMER**
   - Click **Assign**

---

## Step 8: Configure Default Role for New Users

Set CUSTOMER as the default role for all new signups.

1. Go to **Realm settings** → **User registration** tab (or **Roles** tab in older versions)
2. Scroll to **Default roles**
3. Click **Assign role**
4. Select: ✅ **CUSTOMER**
5. Click **Assign**

> 🎯 **Result**: All users created via signup API will automatically get CUSTOMER role.

---

## Step 9: Configure Token Settings

Optimize token lifespans for security and usability.

1. Go to **Realm settings** → **Tokens** tab
2. Configure the following:
   - **Access Token Lifespan**: `15 minutes` (or `5 minutes` for high security)
   - **Refresh Token Lifespan**: `30 minutes`
   - **Access Token Lifespan For Implicit Flow**: `15 minutes`
   - **Client login timeout**: `5 minutes`
   - **Login timeout**: `30 minutes`
3. Click **Save**

---

## Step 10: Update Environment Configuration

Update the client secret in your docker-compose or environment.

1. Open your project root directory
2. Create a `.env` file (if it doesn't exist):

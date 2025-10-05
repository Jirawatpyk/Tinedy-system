# **Tinedy Solutions \- Architecture Document**

## **Epic 5: Customer Relationship Management (CRM)**

Version: 1.1  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document provides the technical architecture for **Epic 5: Customer Relationship Management (CRM)**. The architecture aims to create a centralized and efficient system for managing customer data, tracking their history, and recording preferences to enable personalized service.

## **2\. High-Level Architecture**

The CRM module will introduce a new customers collection in Firestore to act as the single source of truth for all customer information. This data will be linked to the bookings collection. The frontend will feature dedicated components for viewing, searching, and managing customer profiles.

### **2.1 Technology Stack Alignment**

The CRM module will be built using the existing project technology stack (Next.js, Firebase, shadcn/ui, Tailwind CSS). No new technologies are required.

### **2.2 Architectural Diagram**

graph TD  
    subgraph Client Layer  
        A\[Admin Dashboard \- Customers Page\]  
    end

    subgraph API Layer (Next.js API Routes)  
        B\[/api/customers\]  
        C\[/api/customers/{id}\]  
        D\[/api/customers/{id}/bookings\]  
    end

    subgraph Data & Services Layer  
        E\[fa:fa-database customers collection\]  
        F\[fa:fa-database bookings collection\]  
        G\[fa:fa-cloud Cloud Function for Sync\]  
    end

    A \-- "Create, List, Search" \--\> B  
    A \-- "Read, Update Profile" \--\> C  
    A \-- "View History" \--\> D

    B \-- "CRUD Ops" \--\> E  
    C \-- "CRUD Ops" \--\> E  
    D \-- "Queries by customer" \--\> F  
      
    E \-- "onUpdate trigger" \--\> G  
    G \-- "Updates denormalized data" \--\> F

## **3\. Database Schema (Firestore)**

### **3.1 customers Collection**

This new collection will store detailed customer profiles.

// Collection: customers  
interface Customer {  
  id: string; // Firestore Document ID  
    
  // E5-1: Core Information  
  personalInfo: {  
    name: string;  
    name\_lowercase: string; // For case-insensitive search  
    phone: string; // Indexed for search and duplicate detection  
    email?: string; // Indexed for search  
  };  
    
  // E5-1: Addresses  
  addresses: Array\<{  
    label: 'Home' | 'Office' | 'Other';  
    fullAddress: string;  
    isDefault: boolean;  
  }\>;  
    
  // E5-7: Segmentation  
  tags: string\[\]; // e.g., \["VIP", "Regular", "Corporate"\]  
    
  // E5-5: Preferences  
  preferences: {  
    preferredStaffIds?: string\[\];  
    specialRequirements?: string; // Allergies, access instructions, etc.  
  };

  // Denormalized stats for quick display  
  stats: {  
    totalBookings: number;  
    lifetimeValue: number;  
    lastBookingDate?: Timestamp;  
  };  
    
  // Metadata  
  createdAt: Timestamp;  
  updatedAt: Timestamp;  
}

### **3.2 bookings Collection Update**

To link bookings to customers, the booking.customer object will be updated to include the customer's ID.

// In bookings collection document  
customer: {  
  id: string; // Link to customers collection document ID  
  name: string; // Denormalized for display  
  phone: string; // Denormalized for display  
  email?: string;  
  address: string;  
};

### **3.3 Data Integrity & Indexes**

* **Indexes:**  
  * customers: (personalInfo.phone) \- Unique constraint enforced at application layer.  
  * customers: (name\_lowercase) \- For case-insensitive name search.  
  * bookings: (customer.id, schedule.date) \- To efficiently query a customer's booking history.  
* **Data Synchronization:** A Cloud Function will be triggered onUpdate of a document in the customers collection. This function will query all bookings associated with that customer.id and update the denormalized customer.name and customer.phone fields to ensure consistency across the application.

## **4\. API Specifications**

New endpoints will be created under /api/customers.

#### **GET /api/customers**

* **Description:** Get a paginated list of all customers.  
* **Query Params:** search (on name), tags, page, limit, sortBy.  
* **Response:** { customers: Customer\[\], pagination: {...} }

#### **POST /api/customers**

* **Description:** Create a new customer profile.  
* **Request Body:** Omit\<Customer, 'id' | 'createdAt' | ...\>  
* **Logic:** Performs a check for an existing customer with the same phone number before creating.  
* **Response:** { customer: Customer }

#### **GET /api/customers/{id}**

* **Description:** Get a single customer's full profile.  
* **Response:** { customer: Customer }

#### **PATCH /api/customers/{id}**

* **Description:** Update a customer's profile. Will trigger the data synchronization Cloud Function.  
* **Request Body:** Partial\<Customer\>  
* **Response:** { customer: Customer }

#### **GET /api/customers/{id}/bookings**

* **Description:** Get the booking history for a specific customer.  
* **Query Params:** status, page, limit.  
* **Response:** { bookings: Booking\[\], pagination: {...} }

## **5\. Component & Service Design**

* **CustomerService (Backend):** A service class to manage all business logic related to customers, including the Cloud Function for data synchronization.  
* **CustomerForm (Frontend):** A form for creating and editing customer profiles using React Hook Form and Zod.  
* **CustomersDataTable (Frontend):** A server-side paginated table using shadcn/ui to display, search, and filter all customers.  
* **CustomerProfilePage (Frontend):** A dedicated page (/dashboard/customers/{id}) to display a customer's full profile, including their details, preferences, and booking history.  
* **useCustomers (Frontend):** A custom React hook (using React Query) for fetching and managing customer data state.

## **6\. Security & Compliance**

### **6.1 Role-Based Access Control (RBAC)**

* **Admin:** Full CRUD access to all customer data (customers:\*).  
* **Operator:** Can create, read, and update customer profiles (customers:create, customers:read, customers:update). Cannot delete customers.  
* **Other Roles:** No access to the customer management module.

### **6.2 Firestore Security Rules**

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {  
      
    function getUserRole() {  
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;  
    }

    match /customers/{customerId} {  
      // Admins and Operators can read and create customers.  
      allow read, create: if request.auth \!= null &&   
                          (getUserRole() in \['admin', 'operator'\]);  
                            
      // Only Admins can delete customers.  
      allow delete: if request.auth \!= null && getUserRole() \== 'admin';  
        
      // Admins can update any field. Operators can update, but this can be restricted further  
      // at the API level if needed (e.g., cannot change lifetimeValue).  
      allow update: if request.auth \!= null &&   
                          (getUserRole() in \['admin', 'operator'\]);  
    }  
  }  
}

## **7\. Performance Requirements**

* **API Response Time (p95):**  
  * GET /api/customers (with search): **\< 400ms**  
  * GET /api/customers/{id}: **\< 250ms**  
  * GET /api/customers/{id}/bookings: **\< 500ms** (as it involves a query on another collection)  
* **Frontend Rendering:**  
  * Customer Data Table initial load: **\< 1.5s**  
  * Customer Profile Page load: **\< 2s**

## **8\. Integration Specifications**

### **8.1 Data Synchronization (Cloud Function)**

* **Trigger:** onUpdate of any document in the customers collection.  
* **Function Logic:**  
  1. Get the changed customer's ID and the updated fields (name, phone).  
  2. Query the bookings collection where customer.id matches the changed customer's ID.  
  3. Use a batched write to update the customer.name and customer.phone fields in all matching booking documents.  
  4. This ensures that even historical bookings reflect the most current customer information, preventing confusion.

### **8.2 Cross-Epic Integration**

* **Epic 1 (Booking Management):** When creating a new booking, the system will use the /api/customers?search= endpoint to check for existing customers before creating a new one. The customer.id from this epic is essential for linking bookings.  
* **Epic 4 (Staff Assignment):** The AssignmentService will read the customer.preferences.preferredStaffIds array to boost the match score for preferred staff, directly influencing the "Suggested Staff" feature.  
* **Epic 6 & 10 (Analytics):** Customer tags (VIP, Corporate) and stats (lifetimeValue) will be critical dimensions for building advanced analytics and reports.
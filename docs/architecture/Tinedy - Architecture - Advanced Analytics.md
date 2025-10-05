# **Tinedy Solutions \- Architecture Document**

## **Epic 10: Advanced Analytics & Reporting**

Version: 1.0  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document outlines the technical architecture for **Epic 10: Advanced Analytics & Reporting**. This epic introduces a Business Intelligence (BI) and data analytics layer on top of the operational data. The architecture is designed to handle complex queries, generate insights, and provide forecasting capabilities without impacting the performance of the core booking and staff management system.

## **2\. High-Level Architecture**

The core architectural decision for this epic is to separate the analytical data workload from the operational transactional workload. We will introduce **Google BigQuery** as our analytical data warehouse. A scheduled **Cloud Function** will perform an ETL (Extract, Transform, Load) process, moving and reshaping data from Firestore into BigQuery. New, dedicated API endpoints will then query BigQuery to power the analytics dashboards and custom reports.

### **2.1 Architectural Diagram**

graph TD  
    subgraph Operational System (Firestore)  
        A\[fa:fa-database bookings\]  
        B\[fa:fa-database staff\]  
        C\[fa:fa-database customers\]  
    end

    subgraph ETL Pipeline (Cloud Functions)  
        D{Scheduled Cloud Function (Nightly ETL)}  
    end

    subgraph Analytical Data Warehouse (BigQuery)  
        E\[fa:fa-table-list BigQuery Dataset\]  
        F\[denormalized\_bookings table\]  
        G\[staff\_performance\_summary table\]  
    end  
      
    subgraph Tinedy System (Next.js Backend)  
        H\[AnalyticsService\]  
        I\[API Endpoints: /api/analytics/\*\]  
    end

    subgraph Client Layer (Admin Dashboard)  
        J\[Analytics Dashboards\]  
        K\[Custom Report Builder\]  
    end

    A \--\> D  
    B \--\> D  
    C \--\> D  
    D \-- "Extract, Transform, Load" \--\> F  
    D \-- "Extract, Transform, Load" \--\> G  
      
    H \-- "Queries" \--\> E  
    I \-- "Uses" \--\> H  
      
    J \-- "Fetches data from" \--\> I  
    K \-- "Fetches data from" \--\> I

## **3\. Database Schema (Google BigQuery)**

We will create a new dataset in BigQuery named tinedy\_analytics. The schema will be optimized for analytical queries (denormalized).

### **3.1 denormalized\_bookings Table**

This table joins data from bookings, customers, and staff for efficient querying.

CREATE TABLE tinedy\_analytics.denormalized\_bookings (  
    booking\_id STRING,  
    booking\_status STRING,  
    service\_type STRING,  
    service\_category STRING,  
    booking\_date DATE,  
    booking\_time TIME,  
    duration\_minutes INT64,  
    revenue FLOAT64,  
      
    customer\_id STRING,  
    customer\_name STRING,  
    customer\_tags ARRAY\<STRING\>,  
      
    staff\_id STRING,  
    staff\_name STRING,  
    staff\_role STRING,  
      
    team\_id STRING,  
    team\_name STRING,  
      
    created\_at TIMESTAMP,  
    completed\_at TIMESTAMP,  
      
    \-- Partition by booking date for performance  
    PARTITION BY booking\_date  
);

### **3.2 staff\_performance\_summary Table**

A daily snapshot of each staff member's performance metrics.

CREATE TABLE tinedy\_analytics.staff\_performance\_summary (  
    summary\_date DATE,  
    staff\_id STRING,  
    staff\_name STRING,  
    jobs\_completed INT64,  
    hours\_worked FLOAT64,  
    utilization\_rate FLOAT64,  
    average\_rating FLOAT64,  
    on\_time\_percentage FLOAT64,  
      
    PARTITION BY summary\_date  
);

## **4\. API Specifications**

New endpoints will be created under the /api/analytics route. These will be secured and accessible only to 'admin' roles.

#### **GET /api/analytics/revenue**

* **Description:** Fetches data for the revenue analytics dashboard.  
* **Query Params:** startDate, endDate, groupBy ('day', 'week', 'month').  
* **Response:** { series: \[{ date: string, revenue: number }\], total: number, comparison: number }

#### **GET /api/analytics/demand-forecast**

* **Description:** Provides future booking demand forecast based on historical data.  
* **Query Params:** period ('next\_month', 'next\_quarter').  
* **Response:** { forecast: \[{ date: string, predictedBookings: number, confidenceInterval: \[number, number\] }\] }

#### **POST /api/analytics/custom-report (E10-5)**

* **Description:** A flexible endpoint for the custom report builder. It dynamically constructs a BigQuery SQL query.  
* **Request Body:**  
  interface CustomReportRequest {  
    dataset: 'bookings' | 'performance';  
    metrics: string\[\]; // e.g., \["SUM(revenue)", "COUNT(booking\_id)"\]  
    dimensions: string\[\]; // e.g., \["staff\_name", "service\_type"\]  
    filters: Array\<{ field: string; operator: string; value: any; }\>;  
    timeRange: { start: string; end: string; };  
  }

* **Response:** { columns: string\[\], rows: any\[\]\[\] }

## **5\. Backend Service Design**

### **5.1 ETLService (Scheduled Cloud Function)**

* **Trigger:** Cloud Scheduler (Cron Job) \- runs every night at 2:00 AM.  
* **Runtime:** Node.js  
* **Logic:**  
  1. **Extract:** Reads all new/updated documents from Firestore bookings, staff, customers since the last run.  
  2. **Transform:**  
     * Joins and flattens the data into the denormalized\_bookings schema.  
     * Calculates daily performance summaries for each staff member.  
     * Anonymizes or removes sensitive PII before loading.  
  3. **Load:** Streams the transformed data into the corresponding BigQuery tables.  
* **Libraries:** @google-cloud/firestore, @google-cloud/bigquery.

### **5.2 AnalyticsService (Backend)**

* **Description:** A new service to handle all queries to BigQuery.  
* **query(sql, params):** A generic method to execute parameterized SQL queries against BigQuery.  
* **getRevenueReport(startDate, endDate):** Constructs and executes the SQL for the revenue dashboard.  
* **generateCustomReport(request):**  
  1. Validates and sanitizes the incoming request to prevent SQL injection.  
  2. Dynamically builds a safe SQL SELECT statement based on the metrics, dimensions, and filters.  
  3. Executes the query using the query method.  
  4. Formats the results and returns them.

## **6\. Frontend Component Design**

* **DashboardWidget:** A reusable component for displaying a single KPI or chart.  
* **DateRangePicker:** A shared component for selecting time periods for reports.  
* **CustomReportBuilder:** A complex component with a drag-and-drop or multi-select interface for users to build their own reports by choosing metrics and dimensions.  
* **Charting Components:** Integration with a charting library like Recharts or Chart.js to visualize the data returned from the analytics API.

## **7\. Security & Compliance**

### **7.1 Role-Based Access Control (RBAC)**

* All /api/analytics/\* endpoints **MUST** be restricted to the admin role. The existing authentication middleware will be applied to this new route.

### **7.2 Data Security in BigQuery**

* **PII Masking:** During the ETL process, sensitive PII (e.g., full customer names, phone numbers) should be either excluded or pseudonymized before being loaded into BigQuery to reduce risk.  
* **Access Control:** IAM roles on Google Cloud will be configured to ensure only the backend service account has permission to query the tinedy\_analytics dataset.

## **8\. Performance Requirements**

* **ETL Process:** The nightly ETL job should complete within a 1-hour window.  
* **API Response Time (p95):**  
  * Standard Dashboard APIs: **\< 3 seconds**.  
  * Custom Report API: **\< 10 seconds** for typical queries. Performance will depend on the complexity of the user-generated query.  
* **BigQuery Performance:** Tables will be partitioned by date. All queries from the API **MUST** include a WHERE clause on the partition column (e.g., booking\_date) to optimize performance and minimize cost.
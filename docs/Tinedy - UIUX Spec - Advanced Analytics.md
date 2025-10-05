# **Tinedy Solutions \- UI/UX Specification**

## **Epic 10: Advanced Analytics & Reporting**

**Version:** 1.0

**Date:** October 4, 2025

**Author:** UX Expert (Sally)

**Status:** Draft for Review

## **1\. Introduction**

This document provides the User Experience (UX) and User Interface (UI) specifications for the **Advanced Analytics & Reporting (Epic 10\)** features. This epic is designed to transform operational data into strategic business intelligence, enabling data-driven decision-making for the business.

The design challenge is to present potentially complex data sets in a way that is intuitive, insightful, and actionable for a business owner, not a data analyst. The focus is on clarity, data storytelling, and user empowerment through custom reporting.

## **2\. User Persona & Goals**

**Persona:** "Tine" (Admin/Operations Manager)

* **Goal:** To understand her business's health at a glance, identify which services are most profitable, forecast demand for the upcoming high season, and create a custom report on staff performance for Q3 without needing to export data to Excel.  
* **Key Pain Points to Solve:**  
  * No high-level view of business performance; requires manual compilation.  
  * Difficult to spot trends or predict future demand.  
  * Answering specific business questions requires manual data crunching.  
  * No easy way to measure the success of strategic changes.

## **3\. User Flows**

### **3.1 Flow: From High-Level Insights to Custom Reports**

This flow demonstrates how an admin would use the analytics suite to explore data and answer a specific question.  
\[Image ของแผนภาพโฟลว์การวิเคราะห์ข้อมูล\]  
graph TD  
    A\[Start: Navigate to "Analytics" Tab\] \--\> B\[View Executive Summary Dashboard\];  
    B \--\> C{Notices revenue from "Deep Cleaning" is trending up};  
    C \--\> D\[Clicks on Revenue Card to Drill Down\];  
    D \--\> E\[Navigate to Revenue Analytics Page\];  
    E \--\> F{Analyzes revenue by service and customer segment};  
    F \--\> G{Wonders: "Which staff members are best at high-value 'Deep Cleaning' jobs?"};  
    G \--\> H\[Navigate to Custom Report Builder\];  
    H \--\> I\[Select Metrics: Avg. Rating, Jobs Completed\];  
    I \--\> J\[Select Dimension: Staff Name\];  
    J \--\> K\[Apply Filter: Service Type \= "Deep Cleaning"\];  
    K \--\> L\[View Generated Report\];  
    L \--\> M\[Saves report as "Top Deep Cleaning Staff"\];  
    M \--\> N\[End: Gains actionable insight\];

## **4\. Wireframes & Layout Concepts**

### **4.1 Executive Summary Dashboard (E10-7)**

Purpose: A single, scannable dashboard providing a real-time pulse of the business.  
\[Image ของ UI แดชบอร์ดสรุปสำหรับผู้บริหาร\]  
\+---------------------------------------------------------------------------------+  
| Analytics \> Executive Summary                         \[Last 30 Days ▼\] \[Share\]  |  
\+---------------------------------------------------------------------------------+  
| \+-------------+ \+-------------+ \+-------------+ \+---------------------------+ |  
| | \*\*Revenue\*\* | | \*\*Bookings\*\* | | \*\*Staff\*\* | | \*\*Avg. Customer Rating\*\* | |  
| | ฿350,000    | | 150         | | 85% Utilized  | | 4.8 / 5.0 ★ (120 reviews) | |  
| | ▲ 15%       | | ▲ 10%       | | ▼ 2%        | | ▲ 0.1                     | |  
| \+-------------+ \+-------------+ \+-------------+ \+---------------------------+ |  
\+---------------------------------------------------------------------------------+  
| \*\*Revenue Trend\*\* |  
| \[Line Chart showing revenue over the selected date range\]                       |  
\+---------------------------------------------------------------------------------+  
| \*\*Service Breakdown\*\* | \*\*Top Performing Staff\*\* |  
| \[Pie Chart showing revenue % by\]    | \[List of top 3 staff by rating\]           |  
| \[service type\]                      |                                           |  
\+---------------------------------------------------------------------------------+

* **KPI Cards:** Prominent, easy-to-read cards for the most critical metrics, including a comparison to the previous period.  
* **Main Chart:** A large line chart showing the primary business trend (e.g., Revenue).  
* **Widget-based Layout:** Smaller charts and lists provide insights into other key areas.

### **4.2 Detailed Analytics Pages (e.g., Revenue Analytics \- E10-1)**

**Purpose:** To allow for a deeper dive into a specific business area.

\+---------------------------------------------------------------------------------+  
| Analytics \> Revenue                                   \[Last 90 Days ▼\] \[Export\] |  
\+---------------------------------------------------------------------------------+  
| \*\*Revenue by Service Type\*\* |  
| \[Stacked Bar Chart showing revenue per service over time\]                       |  
\+---------------------------------------------------------------------------------+  
| \*\*Detailed Breakdown\*\* |  
| \+-----------------------------------------------------------------------------+ |  
| | Service         | Bookings | Revenue   | Avg. Value | % Change             | |  
| \+-----------------+----------+-----------+------------+----------------------+ |  
| | Deep Cleaning   | 50       | ฿150,000  | ฿3,000     | ▲ 25%                | |  
| | Regular Program | 80       | ฿160,000  | ฿2,000     | ▲ 5%                 | |  
| | ...             | ...      | ...       | ...        | ...                  | |  
| \+-----------------------------------------------------------------------------+ |  
\+---------------------------------------------------------------------------------+

* **Interactive Chart:** The main chart allows for hovering to see details and clicking legends to toggle data series.  
* **Data Table:** A detailed DataTable provides the raw numbers behind the chart and allows for sorting.

### **4.3 Custom Report Builder (E10-5)**

Purpose: An intuitive, flexible tool for users to create their own reports without needing technical skills.  
\[Image ของ UI เครื่องมือสร้างรายงานแบบกำหนดเอง\]  
\+---------------------------------------------------------------------------------+  
| Analytics \> Report Builder                                \[Save Report\] \[Export\]|  
\+---------------------------------------------------------------------------------+  
| \*\*Metrics\*\* (What to measure)     | \*\*Dimensions\*\* (How to group)     | \*\*Filters\*\* (Refine your data)  |  
| \[Avg. Rating          (x)\]     | \[Staff Name           (x)\]     | \[Date Range: Q3 2025    (x)\] |  
| \[Jobs Completed       (x)\]     | \[Service Type         (x)\]     | \[Service: Deep Cleaning (x)\] |  
| \[Add Metric...            ▼\]     | \[Add Dimension...       ▼\]     | \[Add Filter...          ▼\] |  
\+---------------------------------------------------------------------------------+  
| \*\*Preview: Top Staff for Deep Cleaning in Q3 2025\*\* |  
| \+-----------------------------------------------------------------------------+ |  
| | Staff Name      | Jobs Completed | Avg. Rating |                             | |  
| \+-----------------+----------------+-------------+                             | |  
| | Piti S.         | 25             | 4.9 ★       |                             | |  
| | Malee R.        | 22             | 4.8 ★       |                             | |  
| | ...             | ...            | ...         |                             | |  
| \+-----------------------------------------------------------------------------+ |  
\+---------------------------------------------------------------------------------+

* **Control Panel:** The top section contains multi-select inputs for Metrics, Dimensions, and Filters.  
* **Live Preview:** The bottom section updates in real-time as the user changes the parameters, providing immediate feedback.

## **5\. Component Breakdown & Interaction Design**

| Component (shadcn/ui based) | Usage in Analytics Module | Interaction Notes |
| :---- | :---- | :---- |
| **Charts (Recharts)** | The core of all dashboards. Used for line, bar, and pie charts. | Charts must be interactive with Tooltips on hover. Legends should be clickable to filter data series. Supports drill-down on click. |
| **Card** | For displaying main KPIs on the Executive Summary dashboard. |  |
| **Date Range Picker** | A crucial component for filtering all analytics data. | Will include presets like "Last 7 Days," "This Month," "Last Quarter." |
| **DataTable** | To display detailed tabular data in reports. | Will support sorting, filtering, and pagination for large data sets. |
| **Select / Command** | Used in the Custom Report Builder for selecting metrics, dimensions, and filters. | Must support multi-select and search capabilities. |
| **Skeleton** | To provide loading states for charts and KPI cards. | Essential for a good user experience, as data queries may take a few seconds. |

## **6\. Accessibility**

* **Chart Accessibility:** All charts will have aria-labels describing their content. Data will also be presented in an accessible DataTable nearby.  
* **Keyboard Navigation:** The custom report builder will be fully navigable via keyboard, allowing users to select metrics, dimensions, and filters.  
* **Data Visualization:** Color palettes used in charts will be checked for colorblind-friendliness and sufficient contrast.
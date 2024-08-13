# Functional Requirements Document for Resource Insight

## 1. Requirements

### 1.1. System Architecture

1. The system is built on top of Google Sheets, where all data is managed.
2. The charts and dashboard are visualized in the Next.js application.
3. Google Charts is used to visualize the data.

### 1.2. User Interface

#### Dashboard Screen

The dashboard is designed to provide managers and company leadership with a quick overview of various aspects of project resource management, including:

- Resource allocation by account, project, and skill.
- A list of under- or over-allocated teams.
- A list of employees with issues requiring attention, such as resignations, leave, maternity leave, project transfer requests, level changes, and skill training.

#### Org Chart Screen

The org chart provides a clear view of each account with multiple projects, where each project has multiple positions, and each position can have multiple individuals assigned to various roles (e.g., interface/doer, shadow) along with their allocation percentage.

#### Total Headcount in Projects

A bar chart displays a comparison of headcount by project between Billable, Allocated, and Shadow resources.

#### Resource Allocation Chart

This chart illustrates resource allocation for different activities within a project or task. For example, in the Aeris project:

- API Development takes up 30% of the total time or resources.
- REQ Clarification occupies 30%.
- Solution Design covers 20%.
- DB Query Optimization utilizes 10%.
- HTML/CSS Development takes up 10%.

Each segment in the chart represents an activity, and the size of each segment corresponds to the percentage of time or resources allocated to that activity. This chart is often used to easily visualize the distribution of work within a project.

### 1.3. Google Sheets

#### 1.3.1 Project Sheets

These sheets represent the resources allocated to projects as provided by HR, including:

- Account: The name of the client or business.
- Project: The name of the project under the account.
- Manager: The name of the project manager.
- Billable: The number of resources allocated, separated by commas (e.g., 1 PM, 2 FE, 3 BE).

#### 1.3.2 Employee Sheets

These sheets contain a list of all employees in the company, including:

- Employee ID: The employee's unique identifier.
- Employee Name: The employee's name.
- Line Manager: The name of the employee's manager.
- Core Skills: The employee's key skills, separated by commas (e.g., NodeJs, ReactJS, Project Management, Frontend). These skills will be grouped in the code for better visualization (e.g., ReactJS and JavaScript may be grouped under ReactJS).
- Domains: The project domains the employee has worked on (e.g., Edu, Fintech, Mobile, Web, IoT, AI/ML, eCommerce).
- Level: The employee's current level (e.g., Intern, Fresher, Middle, Senior, Lead, Manager, VP, CEO).
- Remarks: Additional notes.

#### 1.4. Weekly Manager Reports

Weekly effort reports are compiled by line managers, who are responsible for updating them at the end of each week for all the team members they manage. Each manager can only access the file they are authorized to. The system will read and consolidate all these individual sheets into a single master sheet. The reports include:

- Start of Week: The start date of the week.
- Employee ID: The employee's unique identifier.
- Employee Name: The employee's name.
- Project: The name of the project under the account.
- Effort: The percentage of effort allocated to each project. For example, if Employee A is involved in Project XX (50%) and Project YY (50%), there will be two corresponding rows for the two projects.

#### 1.5. Weekly Summary Report

The summary template is automatically generated based on all the `Weekly Manager Reports` from the PMs, consolidated into a single file within the system and used for visualization in the app. This file is automatically created using Google Apps Script, which reads all the Weekly Manager Reports in a specific folder on the drive, with the naming convention: "Weekly Reports - [Manager's Name]".

# Maintenance Request Tracking System

A web-based maintenance request tracking system developed for **The Angelus**, a nonprofit organization serving adults with developmental disabilities.

The application replaces a traditional pen-and-paper maintenance process with a centralized digital system where employees can submit maintenance issues and authorized staff can manage, assign, track, and analyze maintenance requests.

## Features

### Public Maintenance Requests
- Submit maintenance requests without creating an account
- Enter the department or location of the issue
- Describe the equipment or item requiring maintenance
- Provide a detailed problem description
- Select a priority level
- Categorize the maintenance issue
- Receive confirmation after submission

### Staff Dashboard
- Secure staff authentication
- View active maintenance requests
- Separate completed requests from active requests
- Search maintenance requests
- Filter requests by status and priority
- Sort requests by date or priority
- Assign maintenance workers
- Update request statuses
- View individual request details
- Record repair notes and costs
- Automatically record start and completion dates

### Worker Management
- Add maintenance workers
- Activate or deactivate workers
- Dynamically assign active workers to maintenance requests

### Analytics
- Track maintenance activity
- Monitor request statuses
- Analyze maintenance categories and priorities
- Review repair costs and completed work

## Technologies Used

**Frontend**
- Next.js
- React
- JavaScript
- Tailwind CSS

**Backend and Database**
- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

**Deployment**
- Vercel

**Version Control**
- Git
- GitHub

## Security

The application uses Supabase Row Level Security to separate public and staff access.

Public users can submit maintenance requests without being able to view or modify the maintenance database. Authenticated staff members can access the maintenance dashboard and manage requests.

## How It Works

1. An employee scans a QR code or opens the maintenance request website.
2. The employee submits a maintenance issue.
3. The request is stored in the Supabase PostgreSQL database.
4. Authorized maintenance staff sign in to the dashboard.
5. Staff assign the request to a maintenance worker.
6. The request status is updated as work progresses.
7. Repair notes, costs, and completion information can be recorded.
8. Completed requests are retained separately for future reference and analysis.

## Purpose

The project was developed to help modernize The Angelus's maintenance workflow. The previous process relied heavily on paper-based tracking, which made it more difficult to organize requests and analyze maintenance activity.

The digital system provides a centralized record of maintenance requests and creates structured data that can be used to identify recurring repairs, monitor completed work, and support future maintenance planning.

## Future Improvements

Potential future improvements include:

- Email notifications for new or updated requests
- Photo uploads for maintenance issues
- Preventive maintenance scheduling
- Additional reporting and analytics
- Role-based staff permissions
- Mobile interface improvements

## Project Status

The application is deployed and operational. The public maintenance request form and authenticated staff management system are connected to a cloud-hosted Supabase database.
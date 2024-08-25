Please Contact For Deployment and Customization for your own business.

Direct Transport Solutions Documentation
Overview
Welcome to the documentation for Direct Transport Solutions, developed by Team Direct Transport Solutions. This guide covers both client-side and admin-side functionalities, detailing the features available for efficient job management.

Client Side
The Client Services section offers several tools to streamline job management. Here's an outline of the various pages and features available to users:

1. Client Services Dashboard
The main dashboard provides quick access to all available services for the user.

2. Price The Job
Description:
Estimate the cost of a job by entering necessary details such as pickup and delivery information, service levels, and item specifics.

Features:

Account: Displays the user's account name (e.g., "John Doe").
Contact: Field for entering the contact information of the person responsible for the job.
Pickup Details: Enter or select pickup address, frequent addresses, and reference code.
Service Information: Select the level of service and specify the ready date and time.
Add Item: Enter item details including weight, dimensions, type, and quantity.
Drop Details: Enter or select delivery address and provide delivery instructions.
Calculation: System calculates and displays the total price, including GST.
3. Place a Booking
Description:
Finalize and confirm a job booking.

Features:

Confirm Details: Review all job details, including addresses, service level, and item specifics.
Confirm Booking: Finalize the booking with the provided details.
Back: Modify any details if necessary before finalizing.
4. Addresses
Description:
Manage frequent addresses for quicker access during job pricing and booking.

Features:

Add Address: Add new frequent addresses.
Edit Address: Modify existing frequent addresses.
Delete Address: Remove addresses no longer needed.
5. Job Inquiry
Description:
Enquire about specific bookings.

Features:

Enquire Booking: Enter job number or other identifiers to fetch booking details.
6. Track Booking
Description:
Track recent bookings over a specified date range or by job number.

Features:

From Date: Enter the start date for the search range.
To Date: Enter the end date for the search range.
Job Number: Enter a specific job number for tracking.
Run Query: Execute the search query based on the entered criteria.
View Results: Display booking details that match the search criteria.
7. Invoices
Description:
View and manage all invoices.

Features:

Job Type: The type of job associated with the invoice.
Date & Time: The date and time when the invoice was created.
Invoice: The invoice number or identifier.
Status: The current status of the invoice (e.g., Paid, Pending).
View: View the detailed invoice.
Download Invoice: Download the invoice as a PDF or other file format.
8. Logout
Description:
Securely log out of the system.

Features:

Sign Out: Ends the user's session and redirects to the sign-in page.
9. Sign In
Description:
Securely log into the system.

Features:

Username: Field to enter the username.
Password: Field to enter the password.
Sign In Button: Submits the login credentials.
Admin Side
1. Description
Provides access to various client services management functionalities.

2. Manage Bookings
Description:
Oversee and manage all bookings made within the system.

Features:

Table View: Displays bookings with details like job type, number, date & time, customer, invoice, service, status, user email, and payment status.
Actions: Edit, view proof of delivery (POD), and delete bookings.
3. Manage Users
Description:
Manage user accounts within the system.

Features:

Search by Email: Find users by email address.
Reset Password Link: Generate a password reset link.
Role: Assign roles (e.g., Admin, User).
Delete User: Remove users from the system.
4. Manage Services
Description:
Manage service-related settings and pricing.

Features:

Services Price: Edit prices.
Minimum Prices Editor: Set minimum prices.
GST Editor for Courier: Modify GST rates.
5. Dashboard
Description:
Provides a summarized view of key metrics and activities within the system.

Features:

Total Orders: Number of orders processed.
Company Status: Current status overview.
Customers: Number of registered customers.
Quick View: Rapid access to essential management sections.
Backend Functionality
Address and Distance Calculation
Description:
Fetches addresses and calculates distances and tolls for live pricing.

User Updates
Description:
Updates users via email regarding their bookings and other relevant information.

Payment Handling with Stripe
Description:
Utilizes Stripe for payments for non-logged-in users.

Pricing Calculation
Description:
Calculates prices using the provided script.

Helper Function: calculateWeightAndCubicCapacity

Description: Calculates weight and cubic capacity based on item details.
Main Function: calculatePrice

Description: Calculates the total price based on various factors such as distance, weight, service type, etc.
Input: Data including service type, distance, item details.
Output: Total price, pallet spaces, request for quote status, and return type.
Pricing Algorithm:

Uses fetched minimum service prices and per kilometer rates.
Considers factors such as distance, weight, item dimensions, and service type to determine the price.
Handles various scenarios including different service types and item types.
Adjusts the total price accordingly (e.g., for express or direct services).
This documentation outlines the key functionalities and processes implemented in the backend system. For further details or clarification on any aspect, please let me know!

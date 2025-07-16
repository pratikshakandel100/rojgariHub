# Admin Creation Script

## Overview
This script creates a one-time admin user in the database with predefined credentials.

## Usage

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Run the admin creation script:
   ```bash
   bun run create:admin
   ```

## Default Admin Credentials
- **Email**: admin@rojgarhub.com
- **Password**: admin123
- **Name**: System Administrator
- **Role**: admin

## Important Notes
- The script will check if an admin with the same email already exists
- If an admin exists, it will not create a duplicate
- The password is automatically hashed using bcrypt before storing
- Make sure your database is running and properly configured before running the script

## Security Recommendation
After running this script and logging in for the first time, please:
1. Change the default password
2. Update the email if needed
3. Consider deleting this script from production environments
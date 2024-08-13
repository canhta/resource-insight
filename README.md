# SETA Resource Insight

## Set Up Google Sheets API

1. Create a Google Cloud Project:

- Go to the Google Cloud Console.
- Create a new project.

2. Enable Google Sheets API:

- In your project, go to APIs & Services > Library
- Search for "Google Sheets API" and enable it.

3. Create Credentials:

- Go to APIs & Services > Credentials.
- Click Create Credentials and choose Service Account.
- Follow the prompts and save the JSON key file to your project directory.
- Update the `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID` and `GOOGLE_CLIENT_EMAIL` environment variables with the values from the JSON key file.

4. Share the Spreadsheet:

- Open the Google Sheets you want to interact with.
- Share the spreadsheet with the service account email (found in the JSON key file).

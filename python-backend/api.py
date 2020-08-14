from __future__ import print_function
import pickle
import os.path
import flask
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from flask import jsonify, request

app = flask.Flask(__name__)

@app.route('/', methods=['GET'])
def questions():

    # Ensure question number was included
    if 'question' not in request.args:
        return 'Error: No question field provided. Please specify a question number.'

    sheet_range = 'Form Responses 1!B' + str(int(request.args['question']) + 1) + ':C' + str(int(request.args['question']) + 1)

    # Ensure spreadsheet id was included
    if 'id' not in request.args:
        return 'Error: No id field provided. Please specify an id.'

    spreadsheet_id = request.args['id']

    # Get credentials or open authentication dialog if not present
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=spreadsheet_id,
                                range=sheet_range).execute()
    values = result.get('values', [])

    # Return error if no data was found
    if not values:
        return 'No data found.'

    # Return the values as a json
    response = jsonify({'values' : values})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

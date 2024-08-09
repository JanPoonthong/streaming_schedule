/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

interface IStreamingSchedule {
  title: string;
  start: Date;
  end: Date;
}

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(
  client: { credentials: { refresh_token: any; }; }
): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listEvents(
  auth: any
): Promise<IStreamingSchedule[]> {
  const timeMin = new Date();
  timeMin.setHours(0, 0, 0, 0);
  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 7);
  timeMax.setHours(23, 59, 59, 999);

  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: timeMin,
    timeMax: timeMax,
    maxResults: 500,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;

  console.log(events);

  const streamingSlot = events.filter(
    (event: { recurringEventId: string; }) => event.recurringEventId === "4c359d983f674dbb992cf8d0661320da"
  );

  const streamingSchedule: IStreamingSchedule[] = streamingSlot.map(
    (event: { start: { dateTime: string; }; end: { dateTime: string; }; }) => ({
      title: "Streaming",
      start: event.start.dateTime,
      end: event.end.dateTime,
    })
  );

  return streamingSchedule;
}

export async function GET() {
  try {
    const auth = await authorize();
    const streamingSchedule = await listEvents(auth);
    return new Response(JSON.stringify({ data: streamingSchedule }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to connect to Google API:", err);
  }
}

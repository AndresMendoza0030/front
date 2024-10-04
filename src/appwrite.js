import { Client, Account } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('66966dc4001998c933d7'); // Your project ID

const account = new Account(client);

export { client, account };

import 'server-only';
import { Client } from 'node-mailjet';
import { setEnvironmentVariables } from '../../util/config.mjs';

setEnvironmentVariables();

export const mailjet = new Client({
  apiKey: process.env.MJAPIKEYPUBLIC,
  apiSecret: process.env.MJAPIKEYPRIVATE,
});

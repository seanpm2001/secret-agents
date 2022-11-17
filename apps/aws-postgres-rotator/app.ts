import { JWKSOption, processRequest } from "agent-core";
import postgresHandler from "postgres-rotator";
import { fetchS3KeySet } from "aws-utils";

export async function handler(event: { body: string }) {
  let keySetOption: JWKSOption;
  if (process.env.OVERRIDE_KEY_SET) {
    keySetOption = { type: "local", keySet: JSON.parse(process.env.OVERRIDE_KEY_SET) };
  } else {
    keySetOption = { type: "local", keySet: await fetchS3KeySet(process.env.OVERRIDE_KEY_SET_S3_BUCKET) };
  }
  return await processRequest(event.body, postgresHandler, { overrideKeySet: keySetOption });
}
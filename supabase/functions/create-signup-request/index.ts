// @deno-types="fido2-lib-types"
import { Fido2Lib } from "fido2-lib";
import { serve } from "std/http/server.ts";
import { encode as base64Encode } from "std/encoding/base64.ts";
import { corsHeaders } from "../_shared/cors.ts";

type SignupRequest = {
  username: string;
};

const fido2 = new Fido2Lib({
  timeout: 60000,
  rpId: "localhost",
  rpName: "zeropassword",
  challengeSize: 128,
  attestation: "direct",
  cryptoParams: [-7, -257],
  authenticatorAttachment: "platform",
  authenticatorRequireResidentKey: false,
  authenticatorUserVerification: "required",
});

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const signupRequest: SignupRequest = await request.json();
  const user = {
    id: crypto.randomUUID(),
    name: signupRequest.username,
    displayName: signupRequest.username,
  };
  const attestationOptions = await fido2.attestationOptions();
  const challenge = base64Encode(attestationOptions.challenge);
  const signupOptions = {
    ...attestationOptions,
    challenge,
    user,
  };
  return new Response(
    JSON.stringify(signupOptions),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
});

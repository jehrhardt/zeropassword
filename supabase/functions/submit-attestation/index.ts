// @deno-types="fido2-lib-types"
import { AttestationResult, ExpectedAttestationResult, Fido2Lib } from "fido2-lib";
import { serve } from "std/http/server.ts";
import { decode as base64UrlDecode } from "std/encoding/base64url.ts";
import { corsHeaders } from "../_shared/cors.ts";

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
  const { id, attestationObject, clientDataJSON } = await request.json();

  const attestationResult: AttestationResult = {
    rawId: base64UrlDecode(id).buffer,
    response: {
      attestationObject,
      clientDataJSON
    },
  };

  const expectedAttestation: ExpectedAttestationResult = {
    challenge: "challenge",
    origin: "http://localhost:3000",
    factor: "either"
  };
  const result = await fido2.attestationResult(attestationResult, expectedAttestation);

  console.log(result);

  const data = {
    message: `Hello ${name}!`,
  };

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
});

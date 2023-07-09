// @deno-types="fido2-lib-types"
import { Fido2Lib } from "fido2-lib";
import { serve } from "std/http/server.ts";
import { encode as base64Encode } from "std/encoding/base64.ts";
import { createClient } from "supabase";
import { corsHeaders } from "../_shared/cors.ts";

type SignupRequest = {
  id?: string;
  username: string;
};

type User = {
  id: string;
};

const fido2 = fido2Lib();
const supabase = supabaseClient();

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const signupRequest: SignupRequest = await request.json();
  const newUser = await createUser();
  const user = {
    ...newUser,
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

function fido2Lib() {
  return new Fido2Lib({
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
}

function supabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  return createClient(supabaseUrl, supabaseAnonKey);
}

async function createUser() {
  const { data } = await supabase
    .from("users")
    .insert({})
    .select("id");
  const ids = data || [];
  return ids[0] as User;
}

'use client'

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SignupForm() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">

          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign up for a developer account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            signup(data['username'].toString());
          }}
            className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

async function signup(username: string) {
  const { data } = await supabase.functions.invoke('create-signup-request', { body: { username } });
  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    ...data,
    challenge: base64Decode(data.challenge),
    user: {
      ...data.user,
      id: decodeUUID(data.user.id),
    },
  }
  const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  });
  const { id, response } = credential as PublicKeyCredential;
  const { attestationObject, clientDataJSON } = response as AuthenticatorAttestationResponse;
  const attestation = {
    id,
    attestationObject: base64UrlEncode(attestationObject),
    clientDataJSON: base64UrlEncode(clientDataJSON)
  }

  const attestationResponse = await supabase.functions.invoke('submit-attestation', { body: attestation });
  console.log(attestationResponse.data);
}

function base64UrlEncode(data: ArrayBuffer) {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(data))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64Decode(str: string) {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

function decodeUUID(str: string) {
  const hex = str.replace(/-/g, '');
  const result = [];
  for (let i = 0; i < hex.length; i += 2) {
    result.push(parseInt(hex.substring(i, 2), 16));
  }
  return Uint8Array.from(result);
}

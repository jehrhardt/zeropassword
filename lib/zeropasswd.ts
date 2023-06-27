export async function signup(username: string) {
  const randomStringFromServer = "randomStringFromServer";
  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
    {
      challenge: Uint8Array.from(
        randomStringFromServer,
        (c) => c.charCodeAt(0),
      ),
      rp: {
        name: "zeropasswd",
        id: "localhost",
      },
      user: {
        id: Uint8Array.from(
          "UZSL85T9AFC",
          (c) => c.charCodeAt(0),
        ),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        { alg: -257, type: "public-key" },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "cross-platform",
      },
      timeout: 60000,
      attestation: "direct",
    };

  const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  });

  console.log(credential);
}

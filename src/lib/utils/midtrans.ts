import midtransClient from "midtrans-client";

export function createMidtransClient() {
  //   return new midtransClient.CoreApi({
  //     isProduction: false, // change to true on production
  //     serverKey: process.env.MIDTRANS_SERVER_KEY!,
  //     clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  //   });

  return new midtransClient.Snap({
    isProduction: false, // change to true on production
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
  });
}

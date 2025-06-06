

import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "../.././../../utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    const uploadData = await pinata.upload
      .file(file)
      .addMetadata({
        name: file.name,    
      })
      .group("2c83451b-83a7-416c-b21b-7ba3fa3547d7");

    const url = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${uploadData.IpfsHash}`;
    console.log(url);

    const pinjob = await pinata
      .pinJobs()
      .cid(`${uploadData.IpfsHash}`)
      console.log(pinjob);


    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

} 



// export async function GET(request: NextRequest) {
//   console.log(process.env.PINATA_GATEWAY_URL);
//   return NextResponse.json({ message: "Hello World" });
// }
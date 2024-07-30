import axios from 'axios';
import {NextRequest, NextResponse} from "next/server";
import xml2js, {parseStringPromise} from 'xml2js';

export async function POST(req: NextRequest){
    const body = await req.json();

    const { transactionToken, phoneNumber, mno, mnoCountry } = body;

    // DPO endpoint and company token
    const endpoint = "https://secure.3gdirectpay.com/API/v6/";
    const companyToken = "8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3";

    // Prepare the XML payload
    const xmlData = `
    <?xml version="1.0" encoding="UTF-8"?>
    <API3G>
      <CompanyToken>${companyToken}</CompanyToken>
      <Request>ChargeTokenMobile</Request>
      <TransactionToken>${transactionToken}</TransactionToken>
      <PhoneNumber>${phoneNumber}</PhoneNumber>
      <MNO>${mno}</MNO>
      <MNOcountry>${mnoCountry}</MNOcountry>
    </API3G>
  `;

    try {
        // Send the POST request to DPO
        const response = await axios.post(endpoint, xmlData, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });

        // Parse the XML response
        const result = await parseStringPromise(response.data);

        console.log(result)

        // Handle the parsed response
        if (result.API3G.Result[0] === '000') {
            return NextResponse.json({
                message: 'Mobile transaction initiated successfully',
                status: result.API3G.Result[0],
                explanation: result.API3G.ResultExplanation[0],
            });
        } else {
            return NextResponse.json({
                message: result.API3G.ResultExplanation[0],
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}
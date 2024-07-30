import {NextApiRequest} from "next";
import axios from 'axios';
import {NextRequest, NextResponse} from "next/server";
import xml2js from 'xml2js';




export async function POST(req: NextRequest) {
    // const { amount, currency, description, customerEmail } = req.body;

    const body = await req.json();

    console.log(body)

    const {
        paymentAmount,
        paymentCurrency,

    } =  body;

    // DPO endpoint and company token
    const endpoint = "https://secure.3gdirectpay.com/API/v6/";
    const companyToken = "8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3";

    // Prepare the XML payload
    const xmlData = `
    <?xml version="1.0" encoding="utf-8"?>
    <API3G>
      <CompanyToken>${companyToken}</CompanyToken>
      <Request>createToken</Request>
      <Transaction>
        <PaymentAmount>${paymentAmount}</PaymentAmount>
        <PaymentCurrency>${paymentCurrency}</PaymentCurrency>
        <CompanyRef>49FKEOA</CompanyRef>
        <RedirectURL>https://tiyenda.online/payment</RedirectURL>
        <BackURL>https://tiyenda.online/back</BackURL>
        <CompanyRefUnique>0</CompanyRefUnique>
        <PTL>5</PTL>
      </Transaction>
      <Services>
        <Service>
          <ServiceType>69836</ServiceType>
          <ServiceDescription>Flight from Nairobi to Diani</ServiceDescription>
          <ServiceDate>2013/12/20 19:00</ServiceDate>
        </Service>
      </Services>
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
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);

        console.log(result)

        // Handle the parsed response
        if (result.API3G.Response[0].Result[0] === '000') {
            return NextResponse.json({
                message: 'Token created successfully',
                token: result.API3G.TransToken[0],
                paymentURL: result.API3G.PaymentPage[0],
            });
        } else {
            return NextResponse.json({ message: result.API3G.Response[0].ResultExplanation[0] });
        }
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal server error', error: error.message });
    }
}
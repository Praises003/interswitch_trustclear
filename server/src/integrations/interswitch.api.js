
import axios from "axios";

const BASE_URL = process.env.INTERSWITCH_BASE_URL;
const CLIENT_ID = process.env.INTERSWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.INTERSWITCH_CLIENT_SECRET;
const MERCHANT_CODE = process.env.INTERSWITCH_MERCHANT_CODE;

/**
 * 🔐 Get OAuth Token
 */
const getAccessToken = async () => {
  const authString = Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    `${BASE_URL}/passport/oauth/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

/**
 * 🔍 Query Transaction (Reconciliation)
 */
export const queryTransaction = async (transactionRef, amount) => {
  try {
    const token = await getAccessToken();

    const url = `${BASE_URL}/collections/api/v1/gettransaction.json?merchantcode=${MERCHANT_CODE}&transactionreference=${transactionRef}&amount=${amount}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    return {
      status: data.ResponseCode === "00" ? "SUCCESS" : "FAILED",
      raw: data,
    };
  } catch (error) {
    console.error("❌ Query Error:", error.response?.data || error.message);

    return { status: "PENDING" };
  }
};
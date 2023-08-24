require("dotenv").config();
const axios = require("axios");

const GITHUB_CLIENT_ID = "4452cbc036fa3f8593d2";
const GITHUB_SECRET_KEY = "7cd19d53551d36daa5020df2f46e2e89be0d96b9";

const GetGithubCredentials = async (req, res) => {
  const { code } = req.body;
  
  try {
    const access_token_response = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_SECRET_KEY,
          code: code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (access_token_response.data.access_token) {
      const accessToken = access_token_response.data.access_token;

      const user_response = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.status(200).json(user_response.data);
    } else {
      return res.status(500).json({ message: "No access token received from GitHub" });
    }
  } catch (error) {
    console.error("Error in GitHub authentication:", error);
    return res.status(500).json({ message: "Error in GitHub authentication", error });
  }
};

module.exports = GetGithubCredentials;

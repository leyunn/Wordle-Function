import {onRequest} from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";

const apiKey = defineString("APIKEY");

export const verifyWord = onRequest(async (req, res) => {
  try {
    // // Set the allowed origin
    const allowedOrigin = "https://wordle-prac.vercel.app";

    // // Check if the request's origin matches the allowed origin
    if (req.headers.origin !== allowedOrigin) {
      res.status(403).send("Forbidden");
    }
    const word: string | undefined = req.query.word as string;
    if (!word) {
      res.status(400).send("Missing word");
    }
    const url = `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=${apiKey.value()}`;
    console.log(url);
    const response = await fetch(url);
    // // Set CORS headers to allow the specific origin
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    if (response.status == 404) {
      res.status(404).send("Word not found");
    } else {
      const json = await response.json();
      // check if word is found
      if (
        json.length > 0 &&
        Object.prototype.hasOwnProperty.call(json[0], "id")
      ) {
        res.status(200).send("ok");
      } else {
        res.status(404).send("Word not found");
      }
    }
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

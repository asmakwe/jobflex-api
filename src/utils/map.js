import axios from "axios";
import { ENV_GOOGLE_API_KEY } from "../config/index.js";

export async function getMapPreview(latitude, longitude) {
  return axios.get(
    `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${ENV_GOOGLE_API_KEY}`
  );
}

import {Settings} from "./settings"
import Cookies from "js-cookie";
//import * as Cookies from "js-cookie";

export function loadSettings(): Settings {

  console.log("in loadSettings")
  try {
/*	with js-cookie 2.2.1  */
   //const options = Cookies.getJSON("options") || {};
/*	with js-cookie 3.0.2 */
/* */
    const readOptions = Cookies.get("options");
    let options
    if (typeof readOptions === "string" || typeof readOptions ==="undefined" ) {
      options = {};
    } else {
      options = JSON.parse(readOptions);
    }

/* */
  console.log(options)
	//const options = JSON.parse(Cookie.get("options")) || {};
    return Settings.createFromObject(options);
  } catch (e) {
    console.error("Failed to load settings: ", e);
    return Settings.createFromObject({});
  }
}

export function saveSettings(settings: Settings) {
  console.log("in saveSettings")
  if (location.hostname.indexOf("localhost") == -1) {
    Cookies.set("options", 
    /*	with js-cookie 2.2.1 */
    // settings, {
    /*	with js-cookie 3.0.2 */
    JSON.stringify(settings), {
      expires: 365, 
      sameSite: "none",
      secure: true
    });
  } else {
  Cookies.set("options", 
    /*	with js-cookie 2.2.1 */
    // settings, {
    /*	with js-cookie 3.0.2 */
    JSON.stringify(settings), {
      expires: 365, 
      sameSite: "strict",
      secure: false
    });
  }
}

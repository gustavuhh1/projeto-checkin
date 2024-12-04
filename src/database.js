import Parse from "parse/node.js";
import env from "./env.js";


// Inicializando parse
Parse.serverURL = "https://parseapi.back4app.com";
Parse.initialize(env.APP_ID, env.JS_KEY);

export default Parse

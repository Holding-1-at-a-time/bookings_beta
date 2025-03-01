/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 28/02/2025 - 13:58:54
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 28/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
// http.ts
import { twilio } from "./example";
import { httpRouter } from "convex/server";

const http = httpRouter();
// this call registers the routes necessary for the component
twilio.registerRoutes(http);
export default http;

/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 28/02/2025 - 13:53:27
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 28/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
// convex/convex.config.ts
import { defineApp } from "convex/server";
import twilio from "@convex-dev/twilio/convex.config";

const app = defineApp();
app.use(twilio);

export default app;

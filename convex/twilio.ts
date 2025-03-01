/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 28/02/2025 - 13:58:17
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 28/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
// convex/example.ts
import { Twilio } from "@convex-dev/twilio";
import { components } from "./_generated/api";

export const twilio = new Twilio(components.twilio, {
    // optionally pass in the default "from" phone number you'll be using
    // this must be a phone number you've created with Twilio
    defaultFrom: process.env.TWILIO_PHONE_NUMBER!,
});

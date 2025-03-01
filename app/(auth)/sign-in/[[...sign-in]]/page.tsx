/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 01/03/2025 - 04:15:45
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/03/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { SignIn } from "@clerk/nextjs"

/**
 * Renders the SignIn page with a centered layout and custom appearance.
 * 
 * @returns JSX.Element - The rendered SignIn component wrapped in a div.
 * @throws No exceptions are thrown.
 */
export default function SignInPage() {
    return (
        <div className="flex justify-center items-center min-h-screen py-12">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "glow-shadow-lg rounded-lg border border-border",
                    },
                }}
            />
        </div>
    )
}


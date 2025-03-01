/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 01/03/2025 - 04:16:12
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/03/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center min-h-screen py-12">
            <SignUp
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "shadow-lg rounded-lg border border-border",
                    },
                }}
            />
        </div>
    )
}


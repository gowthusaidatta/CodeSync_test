// amplify_config.js
import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_RMhlKuGHS', // Your User Pool ID
            userPoolClientId: '4g0bo9ac68vq4g817v1je4e5sf', // Your App Client ID
            region: 'us-east-1', // Your AWS Region
            signUpVerificationMethod: 'code', // or 'link' depending on your Cognito setup
            loginWith: {
                username: 'true',
                email: 'true',
            }
        }
    }
});

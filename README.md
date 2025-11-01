1# CodeSync - The Competitive Programmer's Dashboard

CodeSync is a modern web application designed for competitive programmers to consolidate, track, and visualize their progress across multiple coding platforms. It securely aggregates user statistics from LeetCode, CodeChef, GeeksforGeeks, and HackerRank into a single, personalized dashboard.

**[View the Live Demo](https://codesync-praveen.example.com/)**
*(Replace with your actual AWS-hosted domain or CloudFront distribution URL)*

---

## ✨ Key Features

* **Secure User Authentication:** Users can sign up, log in, and reset their passwords. New accounts require email verification, ensuring that all users are legitimate and preventing unauthorized access.

* **Personalized Dashboard:** After logging in, users are greeted with a dashboard that displays their latest saved statistics from all linked coding platforms, providing an at-a-glance overview of their progress.

* **Profile Management:** A dedicated page allows users to add or update their usernames for LeetCode, CodeChef, GeeksforGeeks, and HackerRank at any time, ensuring their stats remain up-to-date.

* **Live Stats Refresh:** A "Refresh Stats" button securely calls the backend to scrape the user's latest data, saves it to the database, and updates the view in real-time.

* **Automated Daily Leaderboard:** A public leaderboard showcases the total problem counts of all users, automatically updated every day at midnight (UTC) via an AWS **EventBridge scheduled job**.

---

## 🚀 Technology Stack

This project leverages a **serverless AWS architecture** for scalability, security, and maintainability.

| Category            | Technologies                                                                                                                                                                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**        | ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge\&logo=html5\&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge\&logo=tailwind-css\&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge\&logo=javascript\&logoColor=%23F7DF1E) |
| **Backend**         | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge\&logo=node.js\&logoColor=white) ![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge\&logo=awslambda\&logoColor=white) ![API Gateway](https://img.shields.io/badge/AWS%20API%20Gateway-FF4F8B?style=for-the-badge\&logo=amazonapigateway\&logoColor=white)        |
| **Database & Auth** | ![DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge\&logo=amazondynamodb\&logoColor=white) ![Cognito](https://img.shields.io/badge/Amazon%20Cognito-DD344C?style=for-the-badge\&logo=amazoncognito\&logoColor=white)                                                                                                                    |

* **Frontend:** Built with plain HTML, styled with **Tailwind CSS**, and powered by **Vanilla JavaScript (ESM)**. Hosted via **AWS S3 + CloudFront** for global delivery.
* **Backend:** Implemented in **Node.js** and deployed as **AWS Lambda functions** behind **API Gateway**, providing scalable and secure APIs.
* **Database:** **Amazon DynamoDB** is used as a fully managed NoSQL database to store user data, coding platform statistics, and leaderboard scores.
* **Authentication:** **Amazon Cognito** manages sign-up, login, email verification, password reset, and secure token-based authentication.
* **Hosting:** **AWS S3** for static assets, distributed globally through **CloudFront**.
* **Automation:** **Amazon EventBridge (CloudWatch Scheduler)** triggers the daily leaderboard update cron job.
* **Scraping:** **`axios`** for HTTP requests and **`cheerio`** for parsing HTML to extract competitive programming statistics.

---

## 🏗️ Architecture Overview

The project follows a decoupled client-server design:

* **`CodeSync_test` (Public Repository):** Contains static files (HTML, CSS, JS). Safe for public exposure since no sensitive logic or credentials are included.
* **`CodeSync-Backend` (Private Repository):** Contains all server-side logic, including authentication, scraping, and scheduled tasks. Deployed securely to AWS Lambda and API Gateway.

This separation ensures security, scalability, and independent deployment.

---

## 🔐 Security Best Practices

* **Secrets Management:** AWS **Secrets Manager** securely stores API keys and credentials instead of committing them to source control.
* **IAM Policies:** Lambda functions and Cognito are configured with **least privilege IAM roles**.
* **Input Validation:** All user input is validated and sanitized server-side.
* **HTTPS Everywhere:** All frontend-backend communication occurs over TLS via **CloudFront and API Gateway**.
* **Error Handling & Logging:** Centralized logging via **Amazon CloudWatch Logs** for monitoring and troubleshooting.

---

## 🛠️ Local Development Setup

### Prerequisites

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [AWS CLI](https://aws.amazon.com/cli/) configured with your AWS account
* [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) or [Serverless Framework](https://www.serverless.com/)

### 1. Clone the Repositories

```bash
# Clone the public frontend repository
git clone https://github.com/YourUsername/CodeSync_test.git

# Clone the private backend repository
git clone https://github.com/YourUsername/CodeSync_Backend.git
```

### 2. Backend Setup

1. Navigate to `CodeSync`:

   ```bash
   cd CodeSync_Backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Configure environment variables in AWS **Secrets Manager**, e.g.:

   ```
   DYNAMODB_TABLE=CodeSyncUsers
   CRON_SECRET=MySecureSecretForTesting123
   ```
4. Deploy using AWS SAM or Serverless:

   ```bash
   sam deploy --guided
   ```

### 3. Frontend Setup

1. Navigate to `CodeSync_test`:

   ```bash
   cd CodeSync_test
   ```
2. Create `js/cognito_config.js` with your Cognito app settings:

   ```javascript
   export const cognitoConfig = {
     userPoolId: "us-east-1_XXXXXXX",
     clientId: "XXXXXXXXXXXX",
     region: "us-east-1"
   };
   ```
3. Create `js/api_config.js` to point to your API Gateway endpoint:

   ```javascript
   export const API_BASE_URL = "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod";
   ```

### 4. Running Locally

* Use **SAM local** to run the backend:

  ```bash
  sam local start-api
  ```
* Serve frontend locally (e.g., `npx serve`).

---

## 🚀 Deployment

* **Frontend:** Deploy to **AWS S3** → Distribute via **CloudFront**.
* **Backend:** Deploy via **AWS SAM** or **Serverless Framework**.
* **Automated Leaderboard:** Scheduled with **Amazon EventBridge** (daily UTC).

---

## 📄 License

This project is licensed under the MIT License.


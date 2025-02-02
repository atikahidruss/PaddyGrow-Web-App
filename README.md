# PaddyGrow Web Application

PaddyGrow is a web-based plant monitoring application that enables users to track plant health in real-time. It utilizes Firebase for data storage, notifications, and Telegram for message alerts, ensuring timely updates on plant conditions.

## Features

- **Dashboard:** Displays real-time plant data including health status, growth stage, and images.
- **Plants Management:** Add, edit, and delete plant profiles.
- **Notifications:** Receive alerts for plant infections and motion detections.
- **Firebase Integration:** Stores plant data and notifications.
- **Telegram:** Sends critical plant condition alerts via messages.

## Tech Stack

- **Frontend:** React
- **Database:** Firebase Realtime Database and Firebase Storage
- **Notifications:** Telegram
- **Hosting:** Firebase Hosting

## Installation

### Prerequisites
- Node.js and npm installed
- Firebase project set up
- Firebase Hosting configured

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/atikahidruss/PaddyGrow-Web-App.git
   cd PaddyGrow-Web-App
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up Firebase configuration in `firebase.js`.
5. Run the backend server:
   ```bash
   python manage.py runserver
   ```
6. Run the frontend application:
   ```bash
   npm start
   ```

## Usage
- Access the web app through the browser.
- Add and manage plant profiles.
- View real-time plant updates on the Dashboard.
- Receive notifications for detected diseases or motion alerts.

## Deployment
- The web application is hosted on **Firebase Hosting**.
- Ensure all environment variables and Firebase configurations are correctly set up before deployment.

## Contribution
Contributions are welcome! To contribute:
- Fork the repository.
- Create a new branch.
- Make your changes and commit them.
- Submit a pull request.

## Contact
For any inquiries or support, please contact [Atikah](mailto:atikahidrus72@gmail.com).


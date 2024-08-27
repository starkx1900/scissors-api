# Scissor - The Ultimate URL Shortening Tool

## Overview

**Scissor** is a sleek and intuitive platform that enables users to shorten, customize, and track URLs effortlessly. In a world where brevity is the new black, Scissor offers a simple yet powerful tool to make your URLs as concise as possible. Whether you're sharing links on social media, creating branded links for your business, or tracking link performance, Scissor has got you covered.

## Features

### 1. URL Shortening

Scissor allows users to shorten long URLs with ease. Simply paste a long URL into the platform, and a shortened URL will be automatically generated. The shortened URLs are designed to be as short as possible, making them perfect for sharing on social media or other channels.

### 2. Custom URLs

Customize your shortened URLs to reflect your brand or content. Scissor allows users to choose their own custom domain name and tailor the URL to suit their needs. This feature is particularly useful for individuals or small businesses looking to create branded links.

### 3. QR Code Generation

Scissor provides an option to generate QR codes for your shortened URLs. You can download the QR code image and use it in your promotional materials or on your website. This feature is powered by a third-party QR code generator API integrated into the Scissor platform.

### 4. Analytics

Track the performance of your shortened URLs with Scissor's built-in analytics. See how many clicks your links have received, and gain insights into where the clicks are coming from. This feature allows you to monitor the effectiveness of your links in real-time.

### 5. Link History

Easily manage and reuse your links with Scissor's link history feature. View a list of all the links you have created, making it simple to find and reuse previously shortened URLs.

## Getting Started

### Prerequisites

- **Node.js** (version 14.x or higher)
- **NPM** or **Yarn**
- **MongoDB** for storing user data, URLs, and analytics
- An account with a third-party QR code generator API (e.g., QRCode Monkey, GoQR)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/scissor.git
   cd scissor
   ```

````

2. **Install dependencies:**
 ```bash
 npm install
````

3. **Set up environment variables:**
   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```bash
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/scissor
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Start the development server:**

   ```bash
   npm run start:dev
   ```

5. **Access the application:**
   Open your browser and go to `http://localhost:3300` to access the Scissor application.

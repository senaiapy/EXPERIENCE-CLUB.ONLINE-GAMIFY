# EnviosYa - Complete Manual and Documentation

## Introduction

**EnviosYa** is your ultimate taxi booking solution, offering fast rides, real-time tracking, and secure payments for a seamless experience. EnviosYa is a feature-rich ride-hailing platform designed to offer **fast, secure, and seamless** transportation experiences. Whether you need a quick ride, scheduled trip, rental vehicle, parcel delivery, or freight transport, **EnviosYa** has you covered.

Built with React Native for the frontend and Laravel for the backend, EnviosYa ensures a high-performance, real-time experience. With seamless API integration, users enjoy smooth ride booking, secure payments, and real-time tracking. The admin panel provides complete control over bookings, drivers, payments.

## Laravel Configuration

### Prerequisites

> **Disclaimer:** Before proceeding, ensure that your system meets all the requirements listed below. Missing any prerequisites may cause installation or runtime issues.

#### XAMPP/MAMP/LAMP Server

A XAMPP/MAMP/LAMP server is necessary for running PHP Laravel on a local server. If a web server is not installed on your computer, refer to the following links for installation guides on various operating systems.

To run the application, you need to download a web server:

- For Mac systems, download **MAMP** or **XAMPP** Server.
- For Windows systems, download **MAMP** or **XAMPP** Server.
- For Linux systems, download **LAMP** or **XAMPP** Server.

**MAMP** Server can be downloaded from https://www.mamp.info/en/mamp/ for Windows/Mac.

**XAMPP** Server can be downloaded from https://www.apachefriends.org/download.html for Windows/Linux/Mac.

#### PHP Version

PHP Version >= 8.2 is required.

To verify the PHP version installed on your server, enter the following command into your terminal or command line:

```bash
php -v
```

> **Warning:** If PHP is not installed or the version is lower than 8.2, you must upgrade or install PHP first. Refer to the [official PHP installation guide](https://www.php.net/manual/en/install.php).

#### PHP Extensions

The following PHP extensions are required for Laravel to function properly:

- gd PHP Extension
- ctype PHP Extension
- curl PHP Extension
- fileinfo PHP Extension
- json PHP Extension
- mbstring PHP Extension
- OpenSSL PHP Extension
- pcre PHP Extension
- pdo PHP Extension
- tokenizer PHP Extension
- pdo_mysql PHP Extension
- pdo_sqlite PHP Extension
- xml PHP Extension
- zip PHP Extension

> **Info:** To enable these extensions, edit your `php.ini` file and uncomment the respective lines. Restart your server after making changes.

#### Composer

Composer is essential for managing Laravel dependencies. If Composer is not installed on your computer, refer to the following links for installation guides:

- [Install Composer on Mac](https://medium.com/@rodolfovmartins/how-to-install-composer-on-mac-219b6bf28eeb)
- [Install Composer on Windows](https://medium.com/@rodolfovmartins/how-to-install-composer-on-windows-398183cea8f3)
- [Install Composer on Linux](https://medium.com/@rodolfovmartins/how-to-install-composer-on-linux-2da90ff11f2d)

> **Warning:** Ensure Composer is installed globally and accessible via the command line. Verify by running `composer --version`.

#### For EnviosYa Admin

Node.js is required for frontend asset compilation in Laravel applications. Follow the steps below to install Node.js and npm:

1. Visit the official Node.js website https://nodejs.org/en and download the recommended version for your operating system.
2. Open a command prompt or terminal and run the following commands to verify the installation:

```bash
node -v
```

> **Info:** Node.js version **20.x.x** is recommended for compatibility with EnviosYa Admin.

### Common Issues & Solutions

#### PHP Extensions Not Enabled

**Issue:** Laravel throws errors related to missing PHP extensions (e.g., `gd`, `mbstring`, `curl`).

**Solution:** Enable the required PHP extensions in your `php.ini` file. For example:

```
extension=gd
extension=mbstring
extension=curl
```

Restart your server after making changes. For more details:
- Install or enable PHP Extension Ubuntu: [click here](https://stackoverflow.com/questions/40815984/how-to-install-all-required-php-extensions-for-laravel)
- Install or enable PHP Extension XAMPP: [click here](https://stackoverflow.com/questions/33869521/how-can-i-enable-php-extension-intl)
- Install or enable PHP Extension MAMP: [click here](https://documentation.mamp.info/en/MAMP-PRO-Mac/FAQ/PHP/Install-a-PHP-extension-using-PECL/)

## Payment Gateways Configuration

### How to setup payment gateways?

#### CASH Payment Gateway

**Status:** This field determines whether the CASH payment option will be visible to customers on the frontend checkout page.

#### PayPal Payment Gateway

##### Create a PayPal Business Account:
1. If you don't already have a PayPal Business account, go to [PayPal's website](https://www.paypal.com/in/business) and sign up for one.
2. You'll need to provide some basic information about your business.

##### Log In to Your PayPal Business Account:
Once you have a PayPal Business account, log in to your account's dashboard.

##### Access Your PayPal API Credentials:
1. In your PayPal Business account dashboard, click on the "Tools" menu and select "All Tools."
2. Under the "Integrate PayPal" section, click on "Open" next to "REST API apps."
3. Click on the "Create App" button to create a new REST API application.
4. Fill in the required information for your application, such as the name and the sandbox developer account you want to associate with your app. Make sure to choose the "Business" account type for the app.
5. Click the "Create App" button.
6. Once the app is created, you'll be able to see your "Client ID" and "Secret" on the app details page.
7. These are the credentials you'll need for integration. Keep them secure and don't share them publicly.

**Configuration Fields:**
- **Status:** This field determines whether the PayPal payment option will be visible to customers on the frontend checkout page.
- **Sandbox Mode:** Set this to true if you're testing in the PayPal sandbox environment. Use false for live transactions.
- **Client Id:** Integrate your Client ID from step 1 to authenticate your application with PayPal.
- **Secret:** For security reasons, never expose your Secret Id on the front-end. Store it securely on your server-side code to interact with PayPal's APIs.

#### Stripe Payment Gateway

##### Create a Stripe Account:
1. If you don't already have a Stripe account, go to [Stripe's website](https://stripe.com/in) and sign up for an account.
2. You'll need to provide some basic information about your business.

##### Log in to Your Stripe Dashboard:
Once you have your Stripe account, log in to your Stripe dashboard.

##### Access Your API Keys:
1. In your Stripe dashboard, navigate to the "Developers" section.
2. You can usually find this by clicking on your account name or logo in the upper-right corner of the dashboard and selecting "Developers" or "API keys."

##### Get Your Secret Key:
1. In the "API keys" section, you'll see two types of keys: "Publishable key" and "Secret key."
2. You need the "Secret key" to make server-side API requests and securely handle payment processing.
3. Click on the "Reveal live key token" button next to the "Secret key" to display your key.
4. Copy and paste key and secret.

**Configuration Fields:**
- **Status:** This field determines whether the Stripe payment option will be visible to customers on the frontend checkout page.
- **Key:** [Your Stripe publishable key]
- **Secret:** For security reasons, never expose your Secret Id on the front-end. Store it securely on your server-side code to interact with Stripe's APIs.

#### Razorpay Payment Gateway

##### Create a Razorpay Account:
1. If you don't already have a Razorpay account, go to [Razorpay's website](https://razorpay.com/) and sign up for an account.
2. You'll need to provide some basic information about your business.

##### Log In to Your Razorpay Dashboard:
Once you have a Razorpay account, log in to your Razorpay dashboard.

##### Access Your API Credentials:
To obtain your API credentials (Client ID and Secret ID), you'll need to create a new API key from your Razorpay dashboard. Here's how to do it:

1. In your Razorpay dashboard, navigate to the "Settings" section.
2. In the settings menu, click on "API Keys."
3. Click the "Generate Key" button to create a new API key.
4. Give your key a name for reference (e.g., "My Laravel App").
5. After you've generated the key, you'll see your "key_id" (Client ID) and "key_secret" (Secret ID).
6. These are the credentials you'll need for integration. Keep them secure and don't share them publicly.

**Configuration Fields:**
- **Status:** This field determines whether the Razorpay payment option will be visible to customers on the frontend checkout page.
- **Key:** [Your Razorpay key_id]
- **Secret:** For security reasons, never expose your Secret Id on the front-end. Store it securely on your server-side code to interact with Razorpay's APIs.

#### Additional Payment Gateways

The platform also supports the following payment gateways with similar setup processes:

- **Mollie Payment Gateway**
- **PhonePe Payment Gateway**
- **InstaMojo Payment Gateway**
- **CCAvenue Payment Gateway**
- **Bkash**
- **FlutterWave**
- **Paystack**
- **SSLCommerz**

Each gateway requires specific API credentials and configuration. Refer to the respective provider's documentation for detailed setup instructions.

## Firebase Configuration

### Overview

Configuration steps for Firebase integration:

1. Make sure to install all three parts of the EnviosYa system: User App, Driver App, Admin Panel, and Backend API.

Firebase setup includes:
- Firebase Create Project
- Firebase Rules
- SHA Key
- Connect With Admin
- Firebase Messaging
- Firebase Social Login
- Firebase Billing
- Firebase Cloud Functions
- Firebase Collections

## 🚀 Why Choose EnviosYa?

- ✔ **Comprehensive Booking System** – Ride, Rental, Bidding, Parcel & Freight
- ✔ **Real-Time Tracking** – Stay updated on your ride's location
- ✔ **Secure Payments** – Multiple payment gateways with wallet support
- ✔ **Multi-Language & Currency Support** – Expand your business globally
- ✔ **Google Maps & OpenStreetMap (OSM) Integration** – Accurate navigation & tracking

## Important Warnings and Notes

> **Warning:** Ensure that all users (riders, drivers, and admins) comply with local regulations and safety guidelines. Unauthorized use or misuse of the platform may result in account suspension.

> **Info Note:** EnviosYa supports multi-language and multi-currency features, making it ideal for global operations. Customize the platform to suit your region-specific requirements.

> **Pro Tip:** Leverage EnviosYa's bidding feature to offer competitive pricing and attract more riders. Use the admin panel to monitor performance and optimize your services.

## Installation Guide

Follow the provided installation guide step by step to set up your project smoothly:

1. Missing any steps during project creation may require starting over
2. Familiarize yourself with our theme's folder structure for easier modifications
3. You can use our theme's folder structure in your project for reference if you run into any issues during your project

## App Common Errors

### Important Setup Note

> **NOTE:** Before launching the app, ensure you have correctly set up the ADMIN LARAVEL and have added all necessary data through the admin panel.

The Common Errors section is divided into three main categories:

1. **Common Errors in Running a Project (React-Native)**
2. **Common Errors in APK Generation (Android Build Issues)**
3. **Common Errors in IPA Generation (iOS Build Issues)**

## Admin Common Errors

### Solving Image and Asset Loading Issues in Laravel on cPanel

If images and assets are not loading properly in your Laravel application, ensure that the storage folder is properly linked, and the assets are built correctly. Below are the steps to check and fix the issue:

#### Steps to Fix Image and Asset Loading Problems:

1. **Update the .env File:**
   - Open the `.env` file in your Laravel project and set your primary domain URL:
   ```
   APP_URL=https://yourdomain.com
   ASSET_URL=https://yourdomain.com/
   ```

2. **Install Dependencies and Build Assets:**
   Run the following commands in your terminal to install dependencies and compile assets:
   ```bash
   npm i
   npm run build
   ```
   This will generate a new `build` folder in the `public` directory.

3. **Upload the Build Folder to the Server:**
   After generating the `build` folder, upload or replace the existing one on your server inside the `public` directory.

4. **Download and Upload Missing Image Assets:**
   If images are missing, download the `media.zip` file from:
   ```
   https://laravel.pyfoundation.net/EnviosYa/admin/assets/media.zip
   ```
   Then, navigate to the `storage/app` folder and replace the existing `public` folder with the extracted contents of `media.zip`.

5. **Delete and Recreate Storage Link:**
   Run the following command to properly link the storage folder:
   ```bash
   php artisan storage:link
   ```

6. **Verify Image and Asset Loading:**
   Refresh your application and check if the images and assets are now loading correctly.

Following these steps should resolve any image and asset loading issues in your Laravel project hosted on cPanel.

## How to Upgrade Database

### Follow these steps to update your database:

1. EnviosYa uses a **version-controlled system** to manage database changes. Each new version may include specific SQL queries to keep your database in sync with the latest codebase.

2. After downloading the latest version from PYFoundationGroup, make sure to **execute the corresponding SQL file(s)** in your database to avoid any functionality issues or mismatches.

3. All version-wise SQL update files are located in the following directory: `public/db`

4. Run only the SQL files that correspond to the versions you are upgrading through. For example, if you are updating from v1.0.1 to v1.0.3, you must run both `v1.0.2.sql` and `v1.0.3.sql`.

> **Note:** Before running any SQL queries, **please take a full backup of your database**. Executing these queries may result in data loss if not done carefully. These update guidelines are provided to help you integrate new versions with your existing source code smoothly. **Please do not raise support tickets for issues that occur during this update process**, as we are unable to provide assistance for manual update errors.

## How to maintain future Updates with Old Version

If you want which file changes are on the latest updated version then you have to manage the git repository by yourself. You can give same name as we have given EnviosYa_laravel or give your name like demoTest.

### Important Notes:

- Before proceeding, ensure you create a backup, as we are not responsible for any potential loss.
- Please ensure you follow the same steps separately for each of the three folders: EnviosYa_laravel, EnviosYa_user, and EnviosYa_driver.
- Do not directly change in your real project it will show errors Regards package name, version and etc.

> **Warning:** Manual updates to **EnviosYa** require technical expertise in **React Native**, **Laravel**, **Node.js**, and **Firebase**. Always back up your project and test changes in a staging environment before applying them to production. We are not responsible for any issues or data loss caused by manual updates. Refer to the official documentation for guidance.

> **Note:** As per PYFoundationGroup's policy, installation, setup, configuration, upgrades, or modifications are not included in free support. Free support only covers bugs or errors in the original code. Installation and customization assistance are not provided as part of free support. However, we are providing guidelines on how to update future releases with your existing source code for informational purposes. **Please do not create support tickets for issues encountered during the update process, as we will not be able to provide support for them.**

### Follow below steps on how to update existing source code:

1. Download **Github Desktop** from url as per your system like MacOs or Windows: https://desktop.github.com/
2. Now Login in Github Desktop and configure the setup with your github.
3. You have already create your project in Visual Studio.
4. Open Github Desktop, on left hand panel top click on Current Repository
5. One side menu open in that click on **Add** button
6. On click add button dropdown menu will open in that click on **Create New Repository...**
7. After click create new repository one pop-up will appear in the form add your project name your project path where it is located and click on **Create repository** button
8. After above process you can check in your project there is another folder created with same project name just remove that folder.
9. After above process complete click on **Publish repository**, one confirmation pop-up will appear in that again click on **Publish repository** button
10. Now download project your project PYFoundationGroup, unzip the folder, click on EnviosYa_laravel folder, now copy all the files and paste it in your project
11. Now Again go to **Github Desktop** give comment and click on commint on main button.
12. Now click on **Push origin**
13. Click right click on your project name from list and click on **View on Github**.
14. For check open github in google chrome login in your git and check
15. Now click on **Changes** for check total number for file changes and which files has been changed.
16. You can see total number of changes and which file has been changed.
17. Every time when ever new update came in project do same process download code unzip folder and paste in your dumy project and push it and go to github and click on changes you can see the in all the files where ever changes happens.
18. Copy the changes one by one and paste it your real project.

## Change Log

### Indexing Symbols

- **!** Info/Warning → Important notices, warnings, or informational updates.
- **=** Improved → Enhancements or optimizations made.
- **+** Added → New features or functionalities introduced.
- ***** Fixed → Bugs or issues resolved.
- **-** Removed → Features or elements that have been taken out.

### Version - v1.0.5 (31-07-2025)

#### Admin Panel
- **+** Airport added
- **+** Surge price functionality added
- **=** Changes added in rental vehicle module
- **+** Vehicle type zone-wise price
- **+** Vehicle type zone-wise surge price
- **+** Ride status activity tracking added
- **+** Driver location tracking using Firebase
- **=** SOS alerts modified
- ***** Validation for country code in Auth
- **+** Firebase configuration changes added

#### User App
- **+** Airport added
- **-** Remove Models
- **+** Bottom Sheet Add
- **=** Map optimization
- **=** UI Update
- **=** Dark Mode Update
- **=** Validation Update
- **=** Wallet Update

#### Driver App
- **+** Add Multipal Map Option(google,waze,bing)
- **=** Map optimized
- **+** New Home Screen Add
- **+** Driver DashBoard Add
- **=** Wallet Update
- **=** Ui Update
- **=** Dark Mode Update
- **=** Profile Screen validation Update
- **=** Document Upload Flow Update
- **=** Bottom Sheet Added
- **-** Remove Models
- ***** KM/Miles Issue Fix

### Version - v1.0.1 (14-06-2025)

#### Admin Panel
- **+** Admin ride booking using Firebase
- **+** Support chat from admin to driver/rider
- ***** Notification improve
- **+** Driver verification process
- **+** Frontend (Web Booking)
- **+** Web booking integration using Firebase
- **+** Dynamic preloader support
- **+** Web support chat with admin

#### User App
- **+** Google Login
- **=** UI Update
- **+** Push Notification
- **+** Chat with Staff
- **=** Recent location Update
- **=** Wallet screen UI Change
- ***** MyRide screen for starting, cancelling, paying, and reviewing a ride.
- **+** Invoice Preview
- ***** Rental Vehicle Add
- ***** Rental Request
- **=** Country Picker change
- **+** Minimum Wallet Balance
- **=** Profile screen UI Update
- **+** All Service Manage from firebase
- ***** Payment by Cash

#### Driver App
- **=** UI Update
- **=** Wallet screen UI Change
- **+** Push Notification
- **+** Chat with Staff
- **-** Bank Details from Registaration
- **+** Driver Verification
- **=** Registaration flow Update
- **=** Country Picker change
- **+** Minimum wallet Balance
- **+** Withdraw Limit
- **=** Profile screen UI Update
- **=** Document Registaration improve.
- ***** Vehicle Registaration Details not show
- ***** MyRide screen for starting, received amount, and reviewing a ride.
- **+** All Service from firebase
- ***** Cash Payment

### Version - v1.0.3 (30-04-2025)

#### Admin Panel
- **+** Fleet Management module
- **+** SOS Alert feature
- **+** Ambulance service option
- **+** App version setting
- **+** Zone-wise payment method
- **+** Dynamic social links in landing page
- **+** Google Maps API key test feature
- **+** Driver location and online toggle from admin
- **+** Currency flag icon support
- **+** States for United Kingdom
- ***** 2-Factor SMS gateway
- ***** Language translation issue
- ***** Onboarding translation issue
- ***** Vehicle type key mapping across zones
- ***** Reset password and profile update
- ***** Fixed language translation issue
- ***** Fixed dashboard sorting issue
- ***** Fixed permission issue in role
- ***** Custom role user does not show in user table
- ***** Role delete and create issue fixed
- **=** Sidebar Serching functionality
- **=** Create Ride
- **=** API optimization
- **=** Replaced Mobiscroll with Flatpickr
- **=** Commission History table
- **=** Rider, driver, and ride details page
- **=** Authentication flow
- **+** Service-wise, service category-wise chart on the dashboard

#### User App
- **+** Ambulance service add
- **+** Zone wise currency add
- **=** Home screen Update
- **=** Auth Update
- **=** Without biding flow Update
- **=** App Perfomance
- **-** Remove Multi currency
- ***** Rental Vehicle Add issue solve
- **=** Top Up Amount Flow Update
- **=** Update Validation
- **=** Force App Update add
- **+** Dynamic Splash screen
- **+** Dynamic OnBoarding screen

#### Driver App
- **+** Ambulance service add
- **+** Zone wise currency add
- **=** Without biding flow Update
- **=** Auth Update
- **+** Fleet Manager Add
- **=** App Perfomance
- **-** Remove Multi currency
- ***** Rental Vehicle Add issue solve
- **=** Subscription UI Update
- **=** Update Validation
- **=** Force App Update add
- ***** Registaration Details Issue solve.
- **+** Dynamic Splash screen
- **+** Dynamic OnBoarding screen

### Version - v1.0.2 (17-03-2025)

#### Admin Panel
- **+** HeatMap
- **+** Dispatcher
- **=** Fixed user role and permissions
- **=** User landing page - Change Primary Color & Font-family
- **+** Improve status update without refresh

#### User APP
- ***** Fixed UI issues
- ***** Fixed missing words in multi-language support
- ***** Fixed multi-currency issues
- **-** Removed ToastAndroid
- **+** Added custom toast
- ***** Fixed top-up issues
- **=** Updated permissions
- **+** Validation in the authentication flow
- **=** Updated keyboard type for input fields
- **=** Improved app performance
- **=** Fixed iOS build issues
- **=** Updated UI according to iOS
- **=** Upgraded React Native to version 0.77.1 for iOS
- **+** Added a loader in buttons

#### Driver APP
- ***** Fixed UI issues
- ***** Fixed missing words in multi-language support
- ***** Fixed multi-currency issues
- **+** Added validation in the authentication flow
- **=** Updated keyboard type for input fields
- ***** Fixed iOS build issues
- **=** Updated UI according to iOS
- **=** Upgraded React Native to version 0.77.1 for iOS
- **+** Added a loader in buttons
- **+** Add Confirmation Model for Logout/Delete Account
- **-** Removed ToastAndroid

### Version - v1.0.1 (07-03-2025)

#### Admin Panel
- **+** Dynamic Preloader
- **+** Role Dropdown in User Management
- **+** Weekly & Daily Subscription
- ***** SMS Gateway Issue Fix
- **+** Banner Display by Service
- **=** UI Improvements
- **+** Sidebar Color, Font & Primary Color Settings
- **+** Configurable Landing Page Favicon
- **+** Email Authentication
- ***** Dashboard & Login optimization

#### User APP
- **=** Dark Mode
- **=** RTL
- **=** UI
- **+** Login Using Mail Id
- **=** Multi-Language update
- **=** Category Screen
- **+** Shimmer Add
- **=** Book Ride Screen
- ***** Live Driver Tracking Issue
- **=** Splash Screen
- **=** App Performance
- **=** Home Screen Go to Active Ride Navigation
- **=** Home Screen Slider
- ***** Demo User Option Not Hide Solve
- **+** Location Permission
- ***** Delete Account issue Solve
- ***** Demo User Disable Issue Solve
- **=** Input Field's Update

#### Driver APP
- **=** Dark Mode
- **=** RTL
- **=** UI
- **+** Login Using Mail Id
- **=** Multi-Language update
- **+** Shimmer Add
- **=** Splash Screen
- **=** OnBoarding Flow
- **=** App Performance
- ***** Demo User Option Not Hide Solve
- ***** Demo Driver Disable Issue Solve

### Version - v1.0.0 (18-02-2025)

#### Admin Panel
- ***** Blog filtering by tag/category issue on landing page.
- **=** Modal design.
- ***** Selected option and data display for current year in dashboard.
- **=** Ticket table data and design.
- **+** Redirect links clickable.
- ***** Minor bugs in the admin panel.

#### User App
- **=** Dark Mode
- **=** RTL
- **=** UI
- **+** Auth Flow For Demo User
- ***** Save Address Delete Issue
- ***** Location Permission Issue
- ***** Ticket Replay Issue
- **=** Book Ride Screen
- ***** Live Driver Tracking Issue
- **=** Onboarding Flow
- ***** Category Screen Crash Issue

#### Driver App
- **=** Dark Mode
- **=** RTL
- **=** UI
- **+** Auth Flow For Demo User
- ***** Create Ticket Issue
- ***** Ticket Replay Issue
- **=** Withdraw Flow Update
- **=** Onboarding Flow

## Support and Documentation

If you're having problems while using our theme, please make sure to read the documentation carefully. It will help you quickly resolve your issues.

If you can't find the answers you need in the documentation, don't worry! You can request help by submitting a support ticket at [support.pyfoundation.com](https://support.pyfoundation.com).

This guide will help you understand everything about the theme and hopefully provide answers to all your questions.

---

*Copyright 2025 © EnviosYa theme by pyfoundation*
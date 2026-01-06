1-

Create a modern, dark, futuristic gaming e-commerce website for selling our products using Next.js 14, Tailwind CSS, and TypeScript. So we will list the products on the platform and the customer can create a new account on our website and then purchase them. As for payment, we want to accept cryptocurrencies. We will use Cryptomus to implement crypto payment functionalities on our website. First, let's start with the landing page for the website.

I have already installed Nex.js and you can take it up from here.

Core structure:

-Header

- Hero: for the hero section make sure that its height takes 90% of the view port with texts and CTA button on the left and an spline 3D model on the left use the following example to see how embed the 3D model into the website use the following scene:

import Spline from '@splinetool/react-spline/next';

export default function Home() {

  return (

    <main>

      <Spline

        scene="https://prod.spline.design/K9a36qv3N1FN6bdy/scene.splinecode"

      />

    </main>

  );

}

- About section

- Products / Store section

- Cart and Checkout sections

- Footer section

Design language:

- Use #FFFFFF for text, icons, and highlights for strong contrast.

- use black for the background color

- add spotlight effects and use these colors for that spot lights and also use them as gradient colors for the different elements of our website (#F5A45B → #5E3BFF → #2B67F6).

Each ProductCard should display:

- Product image and title

- Platform icon (Steam, PlayStation, etc.)

- Price in USD

- “Buy Now” button

- Optional crypto price indicator (for future Cryptomus integration)

2-

In the hero section, make the container holding the 3D model fully transparent so it’s not visible. Then, add a large, soft spotlight effect behind the 3D model to enhance depth and visual focus. Use the existing theme gradient colors to keep the effect consistent with the overall design.

3-

Create a dedicated Store page for all products. Remove the current Featured Drops section and its cards from the main page. When a user clicks on the Store label in the header, they should be redirected to this new Store page, where they can browse and purchase products. Set the product prices to 1, 2, or 3 USDT.

4-

Next, we need to add full user authentication to our app using Supabase. Please follow the guide linked below to implement Supabase SSR (Server-Side Rendering) authentication in our project, and set it up the same way.

5-

Please update the authentication flow using Supabase SSR (Server-Side Rendering):

Users can freely browse the main page without logging in.

When a user clicks on the “Join Now” button in the header or tries to access the Store page (or any other route that requires authentication), a Sign In / Sign Up modal or page should automatically appear.

The user must sign in or create an account through Supabase Authentication to continue.

Ensure this logic is fully supported and properly configured with Supabase SSR, including session handling, route protection, and redirection.

Only authenticated users should be able to access protected routes like the Store page.

6-

Enhance the authentication flow with the following features:

After a user signs up or logs in successfully, display a congratulatory or success message.

Automatically redirect the user back to the Home page after successful authentication.

Update the “Join Now” button in the header to change to “Log Out” once the user is authenticated.

Implement proper log out functionality so that clicking “Log Out” signs the user out and reverts the button back to “Join Now”.

Ensure all of this is fully integrated with Supabase SSR authentication, including session handling, redirection, and UI state updates.

7-

Please remove the Checkout page and all related components from the project

8-i can still see the checkout section as you can see in the attached image please replace that page with a nice modern contact section and remove the checkout page completely

9-

Update the Store page so that all product cards are dynamic and fully powered by Supabase:

Remove all static/dummy product cards.

Fetch product data from Supabase, including id, title, image, description, price, and status/availability.

Dynamically render a card for each product retrieved from Supabase.

Only render products where status is active or available.

Ensure each card’s price matches the value stored in Supabase (1, 2, or 3 USDT).

Keep the Cryptomus payment integration functional for every product card.

Ensure proper error handling: if Supabase returns no products, display a “No products available” message.

Maintain responsiveness and styling consistent with the current design.

Optional: If convenient, provide a SQL query script that can be run in the Supabase SQL editor to create the products table and insert example product data.

10-

Next up, we need to add full-fledged payments using Cryptomus. Basically, we want users to be able to pay for products on our website using cryptocurrencies, and for that, we’re going to use the Cryptomus payment gateway.

Below are the implementation details for adding Cryptomus payments to our app. You can follow the provided guide and documentation to implement it properly.

Once a user is logged in and navigates to the Store page, they’ll see the product cards with a “Buy with USDT” button. When the user clicks that button, it should open the Cryptomus payment link page, where they can complete their payment securely.

That’s basically what we want to achieve — enable smooth, functional crypto payments for our products using Cryptomus.

11-

We’ve already integrated the Cryptomus payment gateway. Now, connect it to our Supabase database so each completed payment is automatically recorded.

Please:

    Create a payments table in Supabase with these fields:

    id (primary key)
    user_id (UUID referencing auth.users)
    email (text)
    product_name (text)
    amount (numeric)
    status (text: pending, paid, failed)
    created_at (timestamp default now())

    Give me the SQL query to create this table.
    Set up a /api/cryptomus-webhook endpoint that updates the payment status when Cryptomus confirms success.
    Insert a pending record when a user starts a payment, then mark it paid once the webhook fires.

12-

Run a comprehensive TestSprite scan to detect and report any potential bugs, performance issues, or security vulnerabilities within the application. Provide a detailed summary of the findings along with recommendations or automatic fixes where applicable.

13-

Hey Cursor, TestSprite has completed a full scan of my project and found several issues related to performance, security, and best practices.

I’m going to paste the report below. Please:

1. Analyze the report carefully.

2. Identify which files or parts of the code are affected.

3. Suggest or automatically apply fixes to resolve each issue — including improvements for performance, code structure, and security.

4. For every fix, briefly explain what was changed and why.

After making the fixes, make sure the code remains compatible with Supabase (for backend/data), Cryptomus (for payments), and the overall project logic.

I have attached the TestSprite report:


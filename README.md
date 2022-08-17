# Solfront
This project was built as part of Solana's Summer Hackathon 2022[0].

Presentation: https://docs.google.com/presentation/d/13k1g7IsxYn0iBoLFwF22iavdKdr35Ox-XQQmxpP1gww/edit#slide=id.p

## Motivation

Today, it’s not easy for merchants to accept crypto payments. Although there are existing solutions, they involve coding and/or complex integrations many smaller businesses do not have the time or resources for. Solfront aims to help small business connect with the next wave of crypto customers.

Trend: businesses are rapidly adopting no-code solutions since traditional API/code-based solutions are either too high-level for larger enterprise businesses or low-level for smaller businesses with less resources to integrate.

- API integrations are expensive to build and serve
- No-code solutions are much cheaper for merchants to use and us to support
- Players like Stripe, Adyen, Checkout.com, and more are already distributing via payment links with much success

With Solfront, as a merchant, you don’t have to be an expert at crypto. Now, you can create easily-shareable links with Solfront to increase distribution to customers who would prefer to pay with Solana-based tokens.

Together, you and other merchants will build the foundation for new incentive programs with Solana-based NFT as receipts that can be sent straight to their customer’s wallet upon a single transaction.

Solfront will expand Solana’s ecosystem by bringing Solana Pay to a ubiquitous payment surface that is as easy as sending a lightweight payment link. By doing this, Solfront will close the gap between ecommerce as we know it today and the future of commerce powered by Solana.

# Integrations
- Pyth network for real time SOL-USD quotes (and soon more pairs once we support more pay-in tokens)
- Circle API for payouts
- Probably jup.ag and/or FTX once we're moving money on mainnet

# Ongoing issues
- Magic link auth does not work on prod yet
- Fulfillment flow and details are not fully coded out yet in the UI for the merchant
- Need to allow product image upload

---
[0] https://solana.com/summercamp

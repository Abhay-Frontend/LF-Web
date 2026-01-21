"use client";
import React from "react";

const CancellationReturnExchangeRefundPolicyPage = () => {
  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: [
        {
          text: `This Cancellation, Return, Exchange & Refund Policy (“Policy”) governs the terms under which cancellations, returns, exchanges, and refunds are facilitated on the Lafetch e-commerce platform (“Platform”), owned and operated by AS10 Techretail Pvt Ltd (“Company”, “we”, “us”, or “our”).`,
        },
        {
          text: `This Policy forms an integral part of the User Agreement and shall be legally binding on all users (“User”, “Customer”, “you”, or “your”) of the Platform.`,
        },
        {
          text: `Lafetch acts as a facilitator between customers and brands listed on the Platform. All cancellations, returns, exchanges, and refunds shall be subject to prior approval by the brand. Lafetch shall not be liable for processing any return, exchange, or refund unless explicitly authorized by the brand.`,
        },
        {
          text: `By transacting on the Platform, you acknowledge that you have read, understood, and agreed to this Policy. If you do not agree, you must immediately cease using the Platform.`,
        },
      ],
    },

    {
      id: "order-cancellation",
      title: "2. Order Cancellation Policy",
      content: [
        {
          subtitle: "Cancellation by the Customer",
          subpoints: [
            "2.1.1 Customers may request to cancel an order only before it has been accepted and processed by the brand. Once an order is accepted, cancellation requests shall not be entertained.",
            "2.1.2 If cancellation is permitted, the Customer must initiate the request via:",
          ],
        },
        {
          subpoints: [
            "a) The order customer dashboard on the Platform; or",
            "b) Lafetch Customer Support at customersupport@la-fetch.com",
          ],
        },
        {
          subpoints: [
            "2.1.3 If an order is successfully cancelled before processing, a full refund will be issued within seven to ten (7–10) business days, subject to bank/payment provider policies.",
          ],
        },
        {
          subtitle: "2.2 Post-Processing Cancellations & Refusal of Delivery",
          subpoints: [
            "2.2.1 Once an order has been packed, shipped, or is out for delivery, it cannot be canceled.",
            "2.2.2 If the Customer refuses delivery, two (2) to three (3) additional delivery attempts will be made.",
            "2.2.3 Continued refusal will result in forcible return and a fine of 10%–20% of the total order value.",
            "2.2.4 Any refund shall be subject to brand approval.",
          ],
        },
        {
          subtitle: "2.3 Order Cancellation by Lafetch",
          subpoints: [
            "2.3.1 Lafetch may cancel orders due to stock issues, fraudulent details, pricing errors, technical issues, or excessive misuse.",
            "2.3.2 Full refund shall be issued within seven to ten (7–10) business days.",
          ],
        },
      ],
    },

    {
      id: "return-exchange",
      title: "3. Return & Exchange Policy",
      content: [
        {
          subtitle: "3.1 Eligibility for Returns & Exchanges",
          subpoints: [
            "3.1.1 Requests must be initiated within three (3) days or 72 hours of delivery.",
            "3.1.2 Returns allowed only for incorrect item, damaged/defective product, product not as described, or missing items.",
          ],
        },
        {
          subtitle: "3.2 Mandatory Brand Approval",
          subpoints: [
            "3.2.1 All return/exchange requests require brand approval.",
            "3.2.2 Customers must submit product images, packaging images, and issue description.",
            "3.2.3 Lafetch retains discretion to approve or reject requests.",
          ],
        },
        {
          subtitle: "3.3 Conditions for Accepting Returns",
          subpoints: [
            "3.3.1 Product must be unused, unwashed, unworn, with original tags and packaging.",
            "3.3.2 Products failing quality verification shall be returned without refund.",
          ],
        },
        {
          subtitle: "3.4 Exchange Process & Refund Methodology",
          subpoints: [
            "3.4.1 Refunds processed only after inspection and approval.",
            "3.4.2 Refunds may be original payment or Store Credit/Store Coupon.",
            "3.4.3 Processing time depends on bank/payment provider.",
          ],
        },
        {
          subtitle: "3.4.3 Store Credit & Platform Credit",
          subpoints: [
            "Store Credit/Store Coupon is brand-specific, non-transferable, single-use, non-cashable.",
            "Platform Credit/Platform Coupon is issued by Lafetch, usable across brands, multi-use until exhausted.",
          ],
        },
        {
          subtitle: "3.5 Return Pickup & Self Shipping",
          subpoints: [
            "3.5.1 Pickup subject to serviceability.",
            "3.5.2 Self-shipping risk lies with Customer.",
          ],
        },
      ],
    },

    {
      id: "non-returnable",
      title: "4. Non-Returnable & Non-Exchangeable Products",
      content: [
        {
          subpoints: [
            "4.1 Apparel & Accessories: innerwear, lingerie, swimwear, socks, shapewear, scarves.",
            "4.2 Jewellery & Accessories: earrings, nose pins, body jewellery, hair accessories.",
            "4.3 Customized & Made-to-Order products.",
            "4.4 Clearance & Final Sale items, store credits, gift cards.",
            "4.5 Check product page return eligibility before purchase.",
          ],
        },
      ],
    },

    {
      id: "refund-policy",
      title: "5. Refund Policy",
      content: [
        {
          subtitle: "5.1 Refund Process & Timelines",
          subpoints: [
            "5.1.1 Refunds processed after brand approval.",
            "5.1.2 Refund initiated within 7–10 business days.",
            "5.1.3 Timeline depends on bank/payment provider.",
          ],
        },
        {
          subtitle: "5.2 Modes of Refund",
          subpoints: [
            "5.2.1 Original payment method.",
            "5.2.2 COD refunds via NEFT.",
            "5.2.3 Store Credit may be issued.",
          ],
        },
        {
          subtitle: "5.3 Deductions",
          subpoints: [
            "5.3.1 Shipping & handling charges are non-refundable.",
            "5.3.2 Failed QC voids refund.",
            "5.3.3 Return logistics may be deducted.",
          ],
        },
      ],
    },

    {
      id: "dispute",
      title: "6. Dispute Resolution & Escalations",
      content: [
        {
          subtitle: "6.1 Contacting Customer Support",
          subpoints: [
            "6.1.1 Customers may contact Lafetch Support for any queries related to cancellations, returns, refunds, or exchanges:",
            "📧 Email: customersupport@la-fetch.com",
            "6.1.2 Customers should provide all necessary details, including order ID, product images, and payment details, for faster resolution.",
          ],
        },
        {
          subtitle: "6.2 Brand Decision Shall Be Final",
          subpoints: [
            "6.2.1 All return, refund, and exchange approvals shall be at the discretion of the brand. Lafetch shall facilitate communication between the Customer and the brand but shall not be liable for any claims denied by the brand.",
            "6.2.2 If a Customer disputes a brand's decision, Lafetch may, at its discretion, review supporting evidence and provide a final resolution.",
          ],
        },
        {
          subtitle: "6.3 Resolution Timeframe",
          subpoints: [
            "6.3.1 Lafetch aims to resolve all disputes within fifteen to thirty (15-30) business days, subject to the responsiveness of the Customer and the brand.",
            "6.3.2 If further investigation is required, Lafetch shall notify the Customer of the expected resolution timeline.",
          ],
        },
      ],
    },

    {
      id: "misuse",
      title: "7. Misuse & Fraudulent Returns",
      content: [
        {
          subtitle: "7.1 Misuse & Fraudulent Returns",
          subpoints: [
            "7.1.1 Lafetch monitors all return requests to prevent misuse of the return policy. The following activities shall be considered policy abuse:",
            "(a) Frequent returns without valid reasons;",
            "(b) Returning used, altered, or damaged products;",
            "(c) Placing multiple orders with the intent to return most of them;",
            "(d) False claims regarding defective products.",
            "7.1.2 Customers found engaging in policy abuse may face the following consequences:",
            "(a) Permanent restriction from placing future orders;",
            "(b) Disabling of cash-on-delivery (COD) option for future purchases;",
            "(c) Legal action, if fraud is detected.",
          ],
        },
        {
          subtitle: "7.2 High Return Ratio Customers",
          subpoints: [
            "7.2.1 If a Customer has a high return ratio (determined at Lafetch's discretion), Lafetch may:",
            "(a) Charge a return convenience fee on future orders;",
            "(b) Require mandatory prepaid payments for all future transactions.",
          ],
        },
      ],
    },

    {
      id: "modification",
      title: "8. Modification of This Policy",
      content: [
        {
          subtitle: "8.1 Lafetch's Right to Modify Policy",
          subpoints: [
            "8.1.1 Lafetch reserves the right to amend, modify, or update this Policy at any time. Changes shall be effective upon publication on the Platform.",
            "8.1.2 Customers are encouraged to review this Policy periodically to stay informed of any changes.",
          ],
        },
        {
          subtitle: "8.2 Governing Law & Jurisdiction",
          subpoints: [
            "8.2.1 This Policy shall be governed by and construed in accordance with the laws of India. Any disputes arising from this Policy shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.",
          ],
        },
        {
          subtitle: "8.3 Arbitration",
          subpoints: [
            '8.3.1 Any dispute, claim, controversy, or difference arising out of or in connection with this Policy, including any question regarding its existence, interpretation, validity, breach, or termination ("Dispute"), shall be settled by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 and any amendments thereto.',
            "8.3.2 The arbitration proceedings shall be conducted by a sole arbitrator, mutually appointed by the parties. If the parties fail to agree on the appointment of the arbitrator within thirty (30) days from the date a written notice of Dispute is issued, the arbitrator shall be appointed in accordance with the rules of the Delhi International Arbitration Centre (DIAC).",
            "8.3.3 The seat and venue of arbitration shall be New Delhi, India. The arbitration shall be conducted in the English language.",
            "8.3.4 The arbitral award shall be final and binding on the parties and shall not be subject to appeal, except as provided under the Arbitration and Conciliation Act, 1996. The costs of arbitration shall be borne by the party against whom the award is passed unless otherwise determined by the arbitrator.",
            "8.3.5 The parties expressly agree that no arbitration proceedings shall be initiated as a class action or consolidated with the claims of any third party.",
            "8.3.6 Notwithstanding the foregoing, nothing in this clause shall prevent Lafetch from seeking injunctive or equitable relief before any competent court to protect its intellectual property, proprietary information, or to prevent any misuse of the Platform.",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#27272a] text-white">
      <div className="bg-[#0f1110] text-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Cancellation, Return, Exchange & Refund Policy
          </h1>
          <p className="text-gray-300 mt-4 max-w-3xl">
            Complete policy governing cancellations, returns, exchanges,
            refunds, dispute resolution, and arbitration.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 text-white">
        {sections.map((section) => (
          <section key={section.id} className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.content.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  {item.subtitle && (
                    <h3 className="text-lg text-white font-semibold">{item.subtitle}</h3>
                  )}
                  {item.text && <p className="text-gray-300">{item.text}</p>}
                  {item.subpoints && (
                    <ul className="list-disc ml-6 text-gray-300 space-y-2">
                      {item.subpoints.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default CancellationReturnExchangeRefundPolicyPage;

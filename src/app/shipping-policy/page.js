"use client";
import React from "react";

const ShippingDeliveryPolicyPage = () => {
  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: [
        {
          text: `This Shipping & Delivery Policy (“Policy”) governs the shipping, handling, and delivery of orders placed on the Lafetch e-commerce platform (“Platform”), owned and operated by AS10 Techretail Pvt Ltd (“Company”, “we”, “us”, or “our”).`,
        },
        {
          text: `Lafetch does not purchase, own, or store inventory. It acts as a facilitator, enabling seamless delivery of products by coordinating logistics between brands, their stores/warehouses, and customers.`,
        },
        {
          text: `This Policy forms an integral part of the Terms & Conditions and is legally binding on all users (“User”, “Customer”, “you”, or “your”) of the Platform. By placing an order on Lafetch, you agree to this Policy.`,
        },
      ],
    },

    {
      id: "shipping-services",
      title: "2. Shipping Services",
      content: [
        {
          text: `Lafetch facilitates the shipping of all orders through its designated logistics partners. All deliveries, including standard and express shipments, are handled exclusively by Lafetch.`,
        },
        {
          subtitle: "2.1 Standard Shipping",
          subpoints: [
            "(a) Nationwide shipping across India to serviceable pin codes.",
            "(b) Estimated delivery: 10–15 business days from order confirmation.",
            "(c) Orders dispatched within one week excluding Sundays and public holidays.",
            "(d) Delivery timelines may vary due to logistics, weather, or location.",
          ],
        },
        {
          subtitle: "2.2 Express Delivery – LAFETCH QUICK",
          subpoints: [
            "(a) Express Delivery available for select products and locations within 1–4 hours.",
            "(b) Eligibility displayed at checkout based on serviceable zones.",
            "(c) Orders must be placed between 10 AM – 6 PM.",
            "(d) One reattempt will be made if delivery fails due to Customer unavailability.",
          ],
        },
        {
          subtitle: "2.3 Shipping Charges",
          subpoints: [
            "(a) Standard shipping charges vary by location, weight, and courier fees.",
            "(b) Express Delivery charges are additional and non-refundable once dispatched.",
          ],
        },
        {
          subtitle: "2.4 Refusal of Delivery & Reattempts",
          subpoints: [
            "(a) Two (2) reattempts will be made if the Customer refuses delivery.",
            "(b) Continued refusal results in forcible return and a fine of 10%–20% of order value.",
          ],
        },
      ],
    },

    {
      id: "order-tracking",
      title: "3. Order Tracking & Delivery Timelines",
      content: [
        {
          subtitle: "3.1 Order Tracking",
          subpoints: [
            "(a) Tracking link shared via email/SMS upon dispatch.",
            "(b) Real-time tracking available in the “My Orders” section.",
            "(c) Support available at customersupport@la-fetch.com.",
          ],
        },
        {
          subtitle: "3.2 Delivery Delays & Exceptional Circumstances",
          subpoints: [
            "(a) Natural disasters or force majeure events.",
            "(b) Incorrect address provided by the Customer.",
            "(c) Courier operational or regulatory issues.",
            "(d) High order volumes during sales or festive periods.",
            "(e) Delays from the brand’s side.",
          ],
        },
      ],
    },

    {
      id: "undeliverable",
      title: "4. Undeliverable Orders",
      content: [
        {
          subtitle: "4.1 Reasons for Undeliverable Orders",
          subpoints: [
            "(a) Incorrect, incomplete, or unserviceable address.",
            "(b) Customer unavailable or refusal despite attempts.",
            "(c) Invalid contact details.",
          ],
        },
        {
          subtitle: "4.2 Handling of Undelivered Orders",
          subpoints: [
            "(a) Order returned to brand warehouse or Lafetch holding unit.",
            "(b) Customer notified via email/SMS.",
            "(c) Refunds may deduct shipping and return logistics costs.",
          ],
        },
      ],
    },

    {
      id: "restrictions",
      title: "5. Shipping Restrictions",
      content: [
        {
          subpoints: [
            "(a) Lafetch ships only within India to serviceable pin codes.",
            "(b) Certain products may have shipping restrictions due to regulations or product nature.",
          ],
        },
      ],
    },

    {
      id: "modification-cancellation",
      title: "6. Modifications & Cancellations",
      content: [
        {
          subpoints: [
            "(a) Shipping details cannot be modified once pickup is completed.",
            "(b) Orders can be canceled only before pickup as per Cancellation Policy.",
          ],
        },
      ],
    },

    {
      id: "support",
      title: "7. Customer Support & Escalations",
      content: [
        {
          text: `For shipping-related queries, contact Lafetch Support at customersupport@la-fetch.com.`,
        },
      ],
    },

    {
      id: "amendments",
      title: "8. Amendments to the Shipping Policy",
      content: [
        {
          text: `Lafetch reserves the right to modify this Policy at any time. Changes are effective immediately upon posting.`,
        },
      ],
    },

    {
      id: "law",
      title: "9. Governing Law & Dispute Resolution",
      content: [
        {
          text: `This Policy shall be governed by Indian law. Disputes shall be subject to the jurisdiction of courts in New Delhi and/or Haryana.`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#27272a] text-white">
      {/* Hero */}
      <div className="bg-[#0f1110] text-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-gray-300 mt-4 max-w-3xl">
            Learn how Lafetch handles shipping, delivery timelines, tracking,
            and logistics.
          </p>
        </div>
      </div>

      {/* Content */}
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
                    <h3 className="text-lg font-semibold text-white">
                      {item.subtitle}
                    </h3>
                  )}
                  {item.text && (
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {item.text}
                    </p>
                  )}
                  {item.subpoints && (
                    <ul className="list-disc ml-6 space-y-2 text-gray-300">
                      {item.subpoints.map((point, i) => (
                        <li key={i}>{point}</li>
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

export default ShippingDeliveryPolicyPage;

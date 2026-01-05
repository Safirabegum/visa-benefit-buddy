import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BenefitRequest {
  query: string;
  location: string;
  language: string;
  pdfContent?: string;
  cardNumber: string;
}

interface BenefitResponse {
  benefit: string;
  details: string;
  condition: string;
  source: string;
}

function generateContextualBenefit(
  query: string,
  location: string,
  language: string,
  pdfContent?: string
): BenefitResponse {
  const queryLower = query.toLowerCase();
  
  const locationBenefits: Record<string, any> = {
    "IIT Madras Main Gate": {
      keywords: ["food", "dining", "restaurant", "cafe", "meal", "eat"],
      benefit: "Campus Dining Cashback",
      details: "Get 15% cashback on all dining transactions within IIT Madras campus including canteens, food courts, and campus restaurants.",
      condition: "Minimum spend of ₹200 per transaction. Valid at all campus dining locations.",
    },
    "Chennai Airport": {
      keywords: ["lounge", "airport", "travel", "flight", "baggage"],
      benefit: "Airport Lounge Access",
      details: "Complimentary access to Chennai Airport Premium Lounges with your Visa Platinum card. Enjoy comfortable seating, refreshments, and Wi-Fi while you wait for your flight.",
      condition: "Valid for cardholder + 1 guest. Present your Visa card at lounge entrance.",
    },
    "Phoenix Mall": {
      keywords: ["shopping", "retail", "purchase", "buy", "store"],
      benefit: "Phoenix Mall Exclusive Discount",
      details: "Receive 10% instant discount on purchases above ₹5,000 at any retail outlet in Phoenix Mall, Chennai. Additional 5% cashback on fashion and lifestyle brands.",
      condition: "Discount applied at point of sale. Cannot be combined with other offers.",
    },
  };

  let matchedBenefit: BenefitResponse | null = null;

  if (pdfContent && pdfContent.length > 100) {
    const pdfLower = pdfContent.toLowerCase();
    
    if (queryLower.includes("lounge") && pdfLower.includes("lounge")) {
      matchedBenefit = {
        benefit: "Airport Lounge Access",
        details: "Complimentary access to over 1,000 airport lounges worldwide with your Visa card. Enjoy premium amenities including refreshments, Wi-Fi, and comfortable seating.",
        condition: "Valid for primary cardholder. Guest access subject to lounge policy.",
        source: "Uploaded Visa Terms & Conditions PDF",
      };
    } else if (
      (queryLower.includes("travel") || queryLower.includes("insurance")) &&
      pdfLower.includes("travel")
    ) {
      matchedBenefit = {
        benefit: "Travel Insurance Coverage",
        details: "Automatic travel insurance coverage up to $500,000 for accidents during trips booked with your Visa card. Includes medical expenses, trip cancellation, and lost baggage protection.",
        condition: "Trip must be booked using the Visa card. Coverage applies for trips up to 90 days.",
        source: "Uploaded Visa Terms & Conditions PDF",
      };
    } else if (
      (queryLower.includes("cashback") || queryLower.includes("reward")) &&
      pdfLower.includes("cashback")
    ) {
      matchedBenefit = {
        benefit: "Cashback Rewards Program",
        details: "Earn 5% cashback on dining transactions, 2% on grocery shopping, and 1% on all other purchases. Cashback is credited to your account monthly.",
        condition: "Cashback capped at ₹5,000 per month. Minimum transaction of ₹500 applies.",
        source: "Uploaded Visa Terms & Conditions PDF",
      };
    } else if (
      (queryLower.includes("protect") || queryLower.includes("fraud")) &&
      pdfLower.includes("protection")
    ) {
      matchedBenefit = {
        benefit: "Zero Liability Protection",
        details: "You are not responsible for unauthorized transactions on your Visa card. Report suspicious activity immediately for full protection.",
        condition: "Must report unauthorized charges within 60 days of statement date.",
        source: "Uploaded Visa Terms & Conditions PDF",
      };
    }
  }

  if (!matchedBenefit) {
    const locationData = locationBenefits[location];
    if (locationData) {
      const hasKeyword = locationData.keywords.some((keyword: string) =>
        queryLower.includes(keyword)
      );

      if (hasKeyword) {
        matchedBenefit = {
          benefit: locationData.benefit,
          details: locationData.details,
          condition: locationData.condition,
          source: pdfContent
            ? "Based on location context and uploaded documents"
            : "Demo / Sample Benefit (Location-based)",
        };
      }
    }
  }

  if (!matchedBenefit) {
    matchedBenefit = {
      benefit: `${location} - Special Visa Benefit`,
      details: `As a Visa cardholder at ${location}, you may be eligible for exclusive benefits. Common benefits include cashback on transactions, purchase protection, and special merchant offers in this area.`,
      condition: "As per Visa Terms & Conditions. Contact customer service for specific details.",
      source: "Demo / Sample Benefit",
    };
  }

  if (language === "Tamil") {
    const tamilTranslations: Record<string, string> = {
      "Campus Dining Cashback": "வளாக உணவக பணத்திரும்பல்",
      "Airport Lounge Access": "விமான நிலைய ஓய்வறை அணுகல்",
      "Phoenix Mall Exclusive Discount": "பீனிக்ஸ் மால் பிரத்யேக தள்ளுபடி",
      "Travel Insurance Coverage": "பயண காப்பீடு கவரேஜ்",
      "Cashback Rewards Program": "பணத்திரும்பல் வெகுமதி திட்டம்",
      "Zero Liability Protection": "பூஜ்யம் பொறுப்பு பாதுகாப்பு",
    };

    matchedBenefit.benefit =
      tamilTranslations[matchedBenefit.benefit] || matchedBenefit.benefit;
  }

  return matchedBenefit;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { query, location, language, pdfContent }: BenefitRequest =
      await req.json();

    if (!query || !location || !language) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const benefit = generateContextualBenefit(
      query,
      location,
      language,
      pdfContent
    );

    return new Response(JSON.stringify({ benefit }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing benefit request:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process benefit verification",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

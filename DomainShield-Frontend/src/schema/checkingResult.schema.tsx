import { z } from "zod";

export const CheckingResultSchema = z.object({
  compromised_percentage: z.number(),
  compromised_urls: z.number(),
  data: z.array(
    z.object({
      Original_url: z.string(),
      Redirect_url: z.string(),
      compromised: z.string(),
      external_links: z.array(z.string()),
      screenshot: z.string(),
    }),
  ),
  domain_scan: z.object({
    dkim_level: z.string(),
    dmarc_level: z.string(),
    domain: z.string(),
    spf_level: z.string()
  }),
  total_urls: z.number(),
});



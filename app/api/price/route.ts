// import { google } from '@ai-sdk/google';
// import { GoogleGenerativeAIProviderMetadata } from '@ai-sdk/google';
// import { generateText } from 'ai';

// const { text, experimental_providerMetadata } = await generateText({
//   model: google('gemini-1.5-pro', {
//     useSearchGrounding: true,
//   }),
//   prompt:
//     'List all plan for gemini api key',
// });

// // access the grounding metadata. Casting to the provider metadata type
// // is optional but provides autocomplete and type safety.
// const metadata = experimental_providerMetadata?.google as
//   | GoogleGenerativeAIProviderMetadata
//   | undefined;
// const groundingMetadata = metadata?.groundingMetadata;
// const safetyRatings = metadata?.safetyRatings;


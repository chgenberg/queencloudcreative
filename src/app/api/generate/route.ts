import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn(
    "OPENAI_API_KEY is not set. Set it in Railway Variables (or .env.local for local dev)."
  );
}

const openai = new OpenAI({
  apiKey: apiKey || "missing",
});

type BrandData = {
  brandName: string;
  colors: string[];
  mood: string;
};

// Mood descriptions for prompts
const MOOD_DESCRIPTIONS: Record<string, string> = {
  luxury: "sophisticated, premium, exclusive, refined elegance",
  energetic: "dynamic, powerful, vibrant, full of energy and movement",
  minimal: "clean, simple, elegant, uncluttered with focus on essentials",
  warm: "cozy, welcoming, inviting, comfortable and approachable",
  bold: "strong, distinctive, daring, makes a powerful statement",
  natural: "organic, earthy, authentic, connected to nature",
};

// Analyze the uploaded image with GPT Vision
async function analyzeImage(imageBase64: string, brandData: BrandData): Promise<string> {
  const moodDesc = MOOD_DESCRIPTIONS[brandData.mood] || "sophisticated and premium";
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert in marketing and visual analysis. Analyze the image and describe in English:
1. Main subject and composition
2. Key visual elements and objects
3. Colors and contrasts
4. What makes this image compelling
5. Core essence that should be preserved in a creative transformation

Be concise but capture the essential visual elements. Focus on what can be transformed into advertising imagery.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image for the brand "${brandData.brandName}". 
The brand mood is: ${moodDesc}
Brand colors: ${brandData.colors.join(", ")}

Describe the visual essence that should be captured when transforming this into advertising material.`,
          },
          {
            type: "image_url",
            image_url: {
              url: imageBase64,
            },
          },
        ],
      },
    ],
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content || "";
}

function isSupportedImageMime(mime: string) {
  return ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(mime);
}

// Creative style definitions - GPT Image 1.5 optimized prompts
const CREATIVE_STYLES = {
  iceCube: {
    name: "Frozen in Ice",
    prompt: (analysis: string, colors: string, aspectRatio: string) => `
Transform this into a subject perfectly suspended inside a massive, crystal-clear ice block. The ice is flawlessly transparent like museum-grade acrylic, with tiny air bubbles trapped inside creating constellations of light. The surface feels perfectly smooth and impossibly cold, with fine frost patterns blooming at the edges where condensation meets frozen surface.

CONCEPT TO TRANSFORM: ${analysis}

The ice block has real weight and presence—corners are sharp and geometric, catching light and throwing rainbow refractions across nearby surfaces. Small cracks run through the ice like lightning frozen in time, each one a perfect prism splitting light into colors that echo ${colors}. Water droplets bead on the outside surface, each one a tiny magnifying lens.

The subject inside appears ghosted through the ice—partially obscured by refraction, its edges softened by the dense cold medium. Shadows pool beneath the ice block, deep blue-grey and diffused. The lighting is clinical but beautiful, like a high-end museum display case, with soft highlights dancing across every frozen surface.

The background matches the mood of the input but simplified—neutral tones that let the ice sculpture command attention. ${aspectRatio === "portrait" ? "Shot in 9:16 vertical format" : "Shot in 16:9 horizontal format"}, perfect for premium digital displays.

Make this feel like tangible sculpture—something you could reach out and touch, that would make your fingertips ache with cold. NO text, NO logos, NO frames. This is the final photograph.
    `.trim(),
  },
  liquidMetal: {
    name: "Liquid Metal",
    prompt: (analysis: string, colors: string, aspectRatio: string) => `
Reimagine this as a living sculpture made of liquid chrome, caught in a single frozen moment. The metal is impossibly smooth and reflective—like mercury pooled on black glass, but defying gravity and frozen mid-splash. Its surface is a perfect mirror, catching distorted reflections of studio lights and the surrounding space.

CONCEPT TO TRANSFORM: ${analysis}

The liquid metal has real physical weight—you can see the tension in how it pulls and forms, thick droplets stretching into strings before breaking. Some drops hover in mid-air, spherical and perfect. The surface tension is visible, that slight curve where liquid meets nothing. Colors shift across the chrome surface in iridescent waves: ${colors} bleeding into each other like oil on water.

The metal appears wet and alive, catching light in sharp specular highlights that bloom white-hot against the dark reflective surface. Small ripples frozen across its surface suggest recent movement. Tiny satellite droplets scatter around the main form, each one a perfect chrome sphere reflecting the entire scene in miniature.

Background is pure matte black or deep charcoal grey—the kind of darkness that makes the chrome absolutely pop. Lighting is dramatic and directional, like high-end automotive photography, with rim lights tracing every edge and curve.

${aspectRatio === "portrait" ? "Composed in 9:16 vertical format" : "Composed in 16:9 horizontal format"}. The feel is tactile and visceral—you can almost feel the cold metallic weight, smell the sharp metallic scent. NO text, NO logos, NO frames. This is the final image.
    `.trim(),
  },
  floatingFragments: {
    name: "Floating Fragments",
    prompt: (analysis: string, colors: string, aspectRatio: string) => `
Break this into hundreds of floating pieces, suspended in a single moment of elegant explosion. Each fragment is geometrically precise—clean edges, sharp angles, like shattered glass caught in zero gravity. They range from large primary chunks down to dust-fine particles, all hanging perfectly still in space.

CONCEPT TO BREAK APART: ${analysis}

The pieces have real dimension and weight. You can see the thickness of each fragment, the way light catches on beveled edges and throws tiny shadows. Some pieces are fully illuminated, others in deep shadow, creating dramatic contrast. Certain fragments glow softly from within, lit with colors that reference ${colors}—like stained glass in a dark cathedral.

The explosion pattern is beautiful and intentional—pieces disperse outward in a perfect gradient, dense at the center and diffusing to fine mist at the edges. You can trace the path of each major fragment, see how they relate to their neighbors. Some pieces still connect by thin threads or energy wisps, showing where they just pulled apart.

Background is atmospheric smoke or fog in deep charcoal or navy—just enough to give depth and make the suspended particles visible. Dramatic backlighting creates rim light around fragment edges, making them glow. Front lighting is softer, revealing surface detail and creating that three-dimensional depth.

${aspectRatio === "portrait" ? "Framed in 9:16 vertical format" : "Framed in 16:9 horizontal format"}. This feels physical and real—you could reach into the scene and touch the floating pieces, feel their cool smooth surfaces. NO text, NO logos, NO frames. This is the final shot.
    `.trim(),
  },
  underwaterDream: {
    name: "Underwater Dream",
    prompt: (analysis: string, colors: string, aspectRatio: string) => `
Submerge this in crystal-clear water, floating weightless in a dreamlike underwater space. The water is pristine—the kind of clarity you only find in deep pools or tropical reefs. Sunlight penetrates from above in defined shafts, each beam visible through suspended particles and micro-bubbles.

CONCEPT TO SUBMERGE: ${analysis}

Everything moves in slow motion. Fabric or loose elements drift and billow with underwater physics—that graceful, flowing movement unique to submerged objects. Hair or flowing materials create beautiful fluid shapes, backlit and glowing. Small bubbles rise upward in lazy spirals, each one catching and refracting light into tiny prisms.

The water itself has weight and presence. You can see subtle distortion from refraction, that slight blue-green color shift that happens underwater. Caustic light patterns dance across surfaces—those bright, wavy shadows created by sunlight filtering through water's surface. The colors ${colors} bleed and diffuse softly through the water medium.

The subject floats in that perfect underwater stillness, suspended in liquid space. Lighting is soft and diffused by the water itself, creating that ethereal glow. Shadows are gentle and blue-tinted. You can almost feel the pressure of the water, the coolness on your skin, the way sound is muffled.

Background matches the input image's mood but filtered through water—hazier, softer, tinged blue-green. ${aspectRatio === "portrait" ? "Shot in 9:16 vertical format" : "Shot in 16:9 horizontal format"}. This feels serene and meditative—tangible but dreamlike. NO text, NO logos, NO frames. This is the final photograph.
    `.trim(),
  },
  neonGlow: {
    name: "Neon Glow",
    prompt: (analysis: string, colors: string, aspectRatio: string) => `
Illuminate this with vibrant neon light—the real electric glow of noble gases in glass tubes. The light has that particular quality of neon: intense, almost humming with energy, bleeding and blooming in the atmosphere. Colors are super-saturated and electric: ${colors} rendered as pure glowing neon.

CONCEPT TO ILLUMINATE: ${analysis}

The neon creates real physical glow—not just colored light, but that hazy bloom you get in night photography, where bright lights bleed into the surrounding air. Light beams are visible through atmospheric haze, each ray defined and glowing. The glow is strong enough to create colored reflections on nearby surfaces—wet pavement, glossy materials, glass.

The environment feels like a night scene—dark enough that the neon absolutely pops, but with enough ambient light to see forms and shapes. There's atmosphere in the air: light fog or mist that makes the neon beams visible, maybe a slight rain that adds reflections and intensifies colors. You can see the individual neon tubes sometimes—their characteristic linear forms.

Color contrast is extreme: deep blacks and shadows against vibrant, glowing highlights. The light is moody and dramatic, with harsh edges where glow meets shadow. Some areas over-expose into pure white-hot brightness, others drop to complete black—that characteristic high-contrast night look.

Background echoes the input image but pushed into darkness, lit only by neon spill. ${aspectRatio === "portrait" ? "Composed in 9:16 vertical format" : "Composed in 16:9 horizontal format"}. The feeling is electric and alive—you can almost hear the buzz of the transformers, feel the humid night air, smell the ozone. NO text, NO logos, NO frames. This is the final capture.
    `.trim(),
  },
};

type CreativeStyleKey = keyof typeof CREATIVE_STYLES;

// Generate creative image prompts
function generateDOOHPrompts(
  brandData: BrandData,
  imageAnalysis: string,
  outputType: "image" | "video",
  aspectRatio: string = "landscape",
  selectedStyles: CreativeStyleKey[] = ["iceCube", "liquidMetal"]
): { prompt: string; styleName: string }[] {
  const colorPalette = brandData.colors.slice(0, 5).join(", ");
  const analysisShort = imageAnalysis.slice(0, 400);
  const moodDesc = MOOD_DESCRIPTIONS[brandData.mood] || "sophisticated and premium";
  
  return selectedStyles.map((styleKey) => {
    const style = CREATIVE_STYLES[styleKey];
    let prompt = style.prompt(analysisShort, colorPalette, aspectRatio);
    
    // Add mood/feeling instruction
    prompt += `\n\nThe overall feeling should be ${moodDesc}. This is for ${brandData.brandName}.`;
    
    if (outputType === "video") {
      prompt += "\n\nThis will be animated - design with subtle motion potential (floating particles, flowing liquid, etc).";
    }
    
    return {
      prompt,
      styleName: style.name,
    };
  });
}

export async function POST(request: NextRequest) {
  console.log("=== GENERATE API CALLED ===");
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not configured. Add it in Railway Variables (or .env.local) and redeploy.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const email = formData.get("email") as string;
    const outputType = formData.get("outputType") as "image" | "video";
    const brandDataStr = formData.get("brandData") as string;
    const aspectRatio = (formData.get("aspectRatio") as string) || "landscape";
    const stylesStr = formData.get("styles") as string;
    const selectedStyles: CreativeStyleKey[] = stylesStr 
      ? JSON.parse(stylesStr) 
      : ["iceCube", "liquidMetal"];

    console.log("File:", file?.name, file?.size);
    console.log("Email:", email);
    console.log("Output type:", outputType);
    console.log("Aspect ratio:", aspectRatio);
    console.log("Selected styles:", selectedStyles);

    if (!file || !email || !brandDataStr) {
      return NextResponse.json(
        { error: "Fil, e-post och varumärkesdata krävs" },
        { status: 400 }
      );
    }

    // Validate file type (we analyze an image, even for video mode)
    const mime = file.type || "";
    if (!mime.startsWith("image/") || !isSupportedImageMime(mime)) {
      return NextResponse.json(
        {
          error:
            `Unsupported upload format (${mime || "unknown"}). ` +
            `Please upload a PNG, JPEG, GIF, or WEBP image. ` +
            `If you're generating a video, upload a video and we'll extract a frame (client-side) — if this persists, re-upload.` ,
        },
        { status: 400 }
      );
    }

    const brandData: BrandData = JSON.parse(brandDataStr);
    console.log("Brand:", brandData.brandName);

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    console.log("Base64 length:", base64.length);

    // Analyze the uploaded image
    console.log("Analyzing image with GPT Vision...");
    const dataUrl = `data:${mime};base64,${base64}`;
    const imageAnalysis = await analyzeImage(dataUrl, brandData);
    console.log("Image analysis complete:", imageAnalysis.slice(0, 100));

    // Generate prompts for content
    const promptData = generateDOOHPrompts(brandData, imageAnalysis, outputType, aspectRatio, selectedStyles);
    console.log("Generated prompts for styles:", promptData.map(p => p.styleName));

    // Determine image size based on aspect ratio
    const imageSize: "1792x1024" | "1024x1792" | "1024x1024" = 
      aspectRatio === "portrait" ? "1024x1792" : "1792x1024";

    // Generate images using DALL-E 3
    console.log("Generating images with DALL-E 3...");
    const results = await Promise.all(
      promptData.map(async ({ prompt, styleName }, index) => {
        try {
          // Truncate prompt if too long (DALL-E 3 limit is ~4000 chars)
          const truncatedPrompt = prompt.slice(0, 3800);
          
          console.log(`Generating image ${index + 1} (${styleName})...`);
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: truncatedPrompt,
            n: 1,
            size: imageSize,
            quality: "hd",
            style: "natural", // Changed from "vivid" to "natural" for more photorealistic results
          });

          const imageUrl = response.data?.[0]?.url;
          if (!imageUrl) {
            throw new Error("OpenAI did not return an image URL.");
          }

          console.log(`Image ${index + 1} (${styleName}) generated successfully`);
          return {
            id: `variant-${index + 1}`,
            imageUrl,
            prompt: truncatedPrompt,
            style: styleName,
          };
        } catch (error) {
          console.error(`Error generating image ${index + 1}:`, error);
          throw error;
        }
      })
    );

    console.log("All images generated!");
    console.log(`Results would be sent to: ${email}`);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Generate error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Kunde inte generera material: ${errorMessage}` },
      { status: 500 }
    );
  }
}


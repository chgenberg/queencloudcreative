export type Language = "sv" | "en";

export const translations = {
  sv: {
    // Header
    tagline: "Queencloudcreative",
    
    // Hero
    heroTitle1: "Din varumärkesberättelse,",
    heroTitle2: "överallt.",
    heroDescription: "Förvandla ditt varumärke till kraftfull DOOH-reklam på sekunder med vår smarta agent.",
    
    // CTA
    getStarted: "Kom igång",
    
    // Features
    features: ["Smart agent", "5-sek DOOH-klipp", "Varumärkeskonsistent", "2 varianter"],
    
    // Brand Setup
    brandName: "Varumärkesnamn",
    brandNamePlaceholder: "Ditt varumärke",
    brandNameDescription: "Namnet på ditt varumärke eller kampanj",
    
    // Color Palette
    colorPalette: "Färgpalett",
    colorPaletteDescription: "Välj en färgpalett som matchar ditt varumärke",
    customColors: "Egna färger",
    
    // Mood/Style
    moodStyle: "Känsla & stil",
    moodStyleDescription: "Vilken känsla vill du förmedla?",
    moodLuxury: "Lyxig & Exklusiv",
    moodLuxuryDesc: "Sofistikerad, premium",
    moodEnergetic: "Energisk & Livfull",
    moodEnergeticDesc: "Dynamisk, kraftfull",
    moodMinimal: "Minimalistisk & Ren",
    moodMinimalDesc: "Enkel, elegant",
    moodWarm: "Varm & Inbjudande",
    moodWarmDesc: "Mysig, välkomnande",
    moodBold: "Djärv & Modig",
    moodBoldDesc: "Stark, utmärkande",
    moodNatural: "Naturlig & Organisk",
    moodNaturalDesc: "Jordnära, autentisk",
    
    // Modal
    yourEmail: "Din e-postadress",
    emailDescription: "Vi skickar dina skapade material hit",
    emailPlaceholder: "namn@foretag.se",
    
    uploadTitle: "Ladda upp material",
    uploadDescription: "Bild eller video som vår smarta agent ska analysera och utgå från",
    dropzoneText: "Dra och släpp eller klicka för att välja",
    dropzoneHint: "PNG, JPG, WEBP, MP4 upp till 10MB",
    
    outputTitle: "Vad vill du skapa?",
    outputDescription: "Välj format för ditt DOOH-material",
    stillImage: "Stillbild",
    staticDooh: "Statisk DOOH",
    video: "Video",
    videoDooh: "5-sek DOOH-klipp",
    
    brandColors: "Varumärkesfärger",
    extractedColors: "Extraherade varumärkesfärger",
    editColors: "Redigera färger",
    addColor: "Lägg till",
    
    aspectRatio: "Format",
    landscape: "Liggande",
    portrait: "Stående",
    
    creativeStyle: "Kreativ stil",
    styleIceCube: "Fryst i is",
    styleIceCubeDesc: "Dramatisk isblocks-effekt",
    styleLiquidMetal: "Flytande metall",
    styleLiquidMetalDesc: "Rinnande krom och kvicksilver",
    styleFloatingFragments: "Svävande fragment",
    styleFloatingFragmentsDesc: "Exploderar i bitar",
    styleUnderwaterDream: "Undervattendröm",
    styleUnderwaterDreamDesc: "Nedsänkt i kristallklart vatten",
    styleNeonGlow: "Neonsken",
    styleNeonGlowDesc: "Vibrerande ljusspår",
    
    back: "Tillbaka",
    continue: "Fortsätt",
    generateVariants: "Generera 2 varianter",
    
    // Loading
    loadingStep1: "Analyserar ditt material...",
    loadingStep2: "Extraherar varumärkeskänsla...",
    loadingStep3: "Skapar första varianten...",
    loadingStep4: "Skapar andra varianten...",
    stepOf: "Steg",
    of: "av",
    
    // Results
    resultsTitle: "Ditt material är klart",
    resultsSubtitle: "2 unika varianter genererade baserat på ditt varumärke",
    variant: "Variant",
    download: "Ladda ner",
    open: "Öppna",
    style: "Stil",
    promptUsed: "Använt prompt",
    copy: "Kopiera",
    copied: "Kopierat",
    allVariants: "Alla varianter",
    downloadAll: "Ladda ner alla varianter",
    newAnalysis: "Ny analys",
    format: "16:9 Format",
    
    // Errors
    errorAnalyze: "Kunde inte analysera webbplatsen",
    errorGenerate: "Kunde inte generera material. Försök igen.",
  },
  en: {
    // Header
    tagline: "Queencloudcreative",
    
    // Hero
    heroTitle1: "Your brand story,",
    heroTitle2: "everywhere.",
    heroDescription: "Transform your brand into powerful DOOH advertising in seconds with our smart agent.",
    
    // CTA
    getStarted: "Get Started",
    
    // Features
    features: ["Smart agent", "5-sec DOOH clips", "Brand consistent", "2 variants"],
    
    // Brand Setup
    brandName: "Brand name",
    brandNamePlaceholder: "Your brand",
    brandNameDescription: "The name of your brand or campaign",
    
    // Color Palette
    colorPalette: "Color palette",
    colorPaletteDescription: "Choose a color palette that matches your brand",
    customColors: "Custom colors",
    
    // Mood/Style
    moodStyle: "Mood & style",
    moodStyleDescription: "What feeling do you want to convey?",
    moodLuxury: "Luxurious & Exclusive",
    moodLuxuryDesc: "Sophisticated, premium",
    moodEnergetic: "Energetic & Vibrant",
    moodEnergeticDesc: "Dynamic, powerful",
    moodMinimal: "Minimalist & Clean",
    moodMinimalDesc: "Simple, elegant",
    moodWarm: "Warm & Inviting",
    moodWarmDesc: "Cozy, welcoming",
    moodBold: "Bold & Daring",
    moodBoldDesc: "Strong, distinctive",
    moodNatural: "Natural & Organic",
    moodNaturalDesc: "Earthy, authentic",
    
    // Modal
    yourEmail: "Your email address",
    emailDescription: "We'll send your created materials here",
    emailPlaceholder: "name@company.com",
    
    uploadTitle: "Upload material",
    uploadDescription: "Image or video for our smart agent to analyze and build from",
    dropzoneText: "Drag and drop or click to select",
    dropzoneHint: "PNG, JPG, WEBP, MP4 up to 10MB",
    
    outputTitle: "What do you want to create?",
    outputDescription: "Choose format for your DOOH material",
    stillImage: "Still image",
    staticDooh: "Static DOOH",
    video: "Video",
    videoDooh: "5-sec DOOH clip",
    
    brandColors: "Brand colors",
    extractedColors: "Extracted brand colors",
    editColors: "Edit colors",
    addColor: "Add",
    
    aspectRatio: "Aspect ratio",
    landscape: "Landscape",
    portrait: "Portrait",
    
    creativeStyle: "Creative style",
    styleIceCube: "Frozen in Ice",
    styleIceCubeDesc: "Dramatic ice cube encapsulation",
    styleLiquidMetal: "Liquid Metal",
    styleLiquidMetalDesc: "Flowing chrome and mercury",
    styleFloatingFragments: "Floating Fragments",
    styleFloatingFragmentsDesc: "Exploding into pieces",
    styleUnderwaterDream: "Underwater Dream",
    styleUnderwaterDreamDesc: "Submerged in crystal water",
    styleNeonGlow: "Neon Glow",
    styleNeonGlowDesc: "Vibrant light trails",
    
    back: "Back",
    continue: "Continue",
    generateVariants: "Generate 2 variants",
    
    // Loading
    loadingStep1: "Analyzing your material...",
    loadingStep2: "Extracting brand essence...",
    loadingStep3: "Creating first variant...",
    loadingStep4: "Creating second variant...",
    stepOf: "Step",
    of: "of",
    
    // Results
    resultsTitle: "Your material is ready",
    resultsSubtitle: "2 unique variants generated based on your brand",
    variant: "Variant",
    download: "Download",
    open: "Open",
    style: "Style",
    promptUsed: "Prompt used",
    copy: "Copy",
    copied: "Copied",
    allVariants: "All variants",
    downloadAll: "Download all variants",
    newAnalysis: "New analysis",
    format: "16:9 Format",
    
    // Errors
    errorAnalyze: "Could not analyze the website",
    errorGenerate: "Could not generate material. Please try again.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;


const { GoogleGenerativeAI } = require('@google/generative-ai');
const Item = require('../models/Item');
const Bid = require('../models/Bid');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const toolsDefinition = [
    {
        functionDeclarations: [
            {
                name: "search_items",
                description: "Search for items based on keywords, category, price, etc.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        query: { type: "STRING" },
                        category: { type: "STRING" },
                        max_price: { type: "NUMBER" },
                        status: { type: "STRING", enum: ["active", "upcoming", "sold"] }
                    }
                }
            },
            {
                name: "get_item_details",
                description: "Get detailed info about a specific item",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        item_id: { type: "STRING" }
                    },
                    required: ["item_id"]
                }
            },
            {
                name: "place_bid",
                description: "Place a bid on an item",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        item_id: { type: "STRING" },
                        amount: { type: "NUMBER" }
                    },
                    required: ["item_id", "amount"]
                }
            },
            {
                name: "compare_items",
                description: "Compare two items side by side",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        item_id_1: { type: "STRING" },
                        item_id_2: { type: "STRING" }
                    },
                    required: ["item_id_1", "item_id_2"]
                }
            },
            {
                name: "set_sniper_alert",
                description: "Set an alert for when an item exceeds a price",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        item_id: { type: "STRING" },
                        threshold_amount: { type: "NUMBER" }
                    },
                    required: ["item_id", "threshold_amount"]
                }
            },
            {
                name: "get_market_estimate",
                description: "Get price estimate for an item description",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        item_description: { type: "STRING" }
                    },
                    required: ["item_description"]
                }
            }
        ]
    }
];

// Map Tools to Implementation
const toolFunctions = {
    search_items: async ({ query, category, max_price, status = 'active' }) => {
        const filter = { status };
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }
        if (category) filter.category = category;
        if (max_price) filter.currentBid = { $lte: max_price };

        const items = await Item.find(filter).limit(5).select('title currentBid basePrice status endTime');
        return items;
    },
    get_item_details: async ({ item_id }) => {
        try {
            const item = await Item.findById(item_id).populate('seller', 'name');
            return item ? item : "Item not found.";
        } catch (e) { return "Invalid Item ID."; }
    },
    place_bid: async ({ item_id, amount }, userId) => {
        try {
            const item = await Item.findById(item_id);
            if (!item) return "Item not found.";

            if (item.status !== 'active' || new Date(item.endTime) < new Date()) return "Auction ended.";
            if (item.seller.toString() === userId.toString()) return "You cannot bid on your own item.";

            const currentPrice = item.currentBid || item.basePrice;
            if (amount <= currentPrice) return `Bid must be higher than ${currentPrice}`;

            const highestBid = await Bid.findOne({ item: item_id }).sort({ amount: -1 });
            if (highestBid && highestBid.bidder.toString() === userId.toString()) return "You already have the highest bid.";

            await Bid.create({ item: item_id, bidder: userId, amount });
            item.currentBid = amount;
            await item.save();

            return `Bid placed successfully! New Price: ${amount}`;
        } catch (e) { return "Error placing bid."; }
    },
    compare_items: async ({ item_id_1, item_id_2 }) => {
        try {
            const item1 = await Item.findById(item_id_1);
            const item2 = await Item.findById(item_id_2);
            return { item1, item2 };
        } catch (e) { return "One or both specific items not found."; }
    },
    set_sniper_alert: async ({ item_id, threshold_amount }) => {
        // Mock implementation
        return `Sniper alert set for Item ${item_id} at ${threshold_amount}`;
    },
    get_market_estimate: async ({ item_description }) => {
        return "Market estimate: Fair market value based on similar items.";
    }
};


// Retry helper: retries fn up to maxRetries times on 429 quota errors
const withRetry = async (fn, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            const isQuota = err.status === 429;
            if (!isQuota || attempt === maxRetries) throw err;

            // Extract retryDelay from API response (e.g., "2s" -> 2000ms), fallback to exponential
            let delayMs = Math.pow(2, attempt) * 1000;
            try {
                const retryInfo = err.errorDetails?.find(d => d['@type']?.includes('RetryInfo'));
                if (retryInfo?.retryDelay) {
                    const seconds = parseFloat(retryInfo.retryDelay);
                    if (!isNaN(seconds)) delayMs = seconds * 1000 + 500; // +500ms buffer
                }
            } catch (_) { /* use fallback */ }

            console.warn(`Gemini 429 quota hit. Retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries - 1})...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
};

exports.chat = async (req, res) => {
    try {
        const { message, history } = req.body;
        const userId = req.user._id;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            tools: toolsDefinition,
            systemInstruction: `You are the "BidCycle AI Assistant," an intelligent auction expert.
Your goal is to help users find items, compare products, place bids, and strategize.
Tone: Professional, encouraging, and strategic. Be concise.
If user asks for "cheap cycles", infer max_price.
If user wants to bid but details missing, ASK them.
`
        });

        // Map history to Gemini format
        const chatHistory = (history || []).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await withRetry(() => chat.sendMessage(message));
        const response = await result.response;
        const functionCalls = response.functionCalls();

        if (functionCalls && functionCalls.length > 0) {
            // Execute tools
            const functionResponses = [];

            for (const call of functionCalls) {
                const functionName = call.name;
                const args = call.args;
                console.log("Calling tool:", functionName, args);

                let output;
                if (functionName === 'place_bid') {
                    output = await toolFunctions[functionName](args, userId); // Pass userId for context
                } else if (toolFunctions[functionName]) {
                    output = await toolFunctions[functionName](args);
                } else {
                    output = "Tool not supported.";
                }

                functionResponses.push({
                    functionResponse: {
                        name: functionName,
                        response: { name: functionName, content: output }
                    }
                });
            }

            // Send tool outputs back to model
            const finalResult = await withRetry(() => chat.sendMessage(functionResponses));
            return res.json({ response: finalResult.response.text() });
        }

        // Normal text response
        res.json({ response: response.text() });

    } catch (error) {
        console.error("Gemini Chat Error:", error);
        if (error.status === 429) {
            return res.status(429).json({
                message: "AI quota exceeded. Please wait a moment and try again."
            });
        }
        res.status(500).json({ message: "AI services unavailable." });
    }
};

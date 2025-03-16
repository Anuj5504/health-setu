const Distribution = require('../models/DistributionModel');
const Inventory = require('../models/InventoryModels');
const Healthpro = require('../models/HealthproModel');
const Groq = require('groq-sdk');
const PredictedNeed = require('../models/PredictedNeedModel');
const AIPriority = require('../models/AIPriorityModel');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Get admins with their low stock items and AI-based priority
const getAdminsWithLowStock = async (req, res) => {
    try {
        const { adminId } = req.params;
        const admins = await Healthpro.find({ _id: { $ne: adminId } });

        const adminsData = await Promise.all(admins.map(async (admin) => {
            const inventory = await Inventory.find({ adminId: admin._id });
            const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel);

            let aiPriority = await getOrCreateAIPriority(admin, lowStockItems);

            // Update priority scoring
            const itemsWithPriority = lowStockItems.map(item => {
                const stockRatio = item.quantity / item.reorderLevel;
                let priorityScore;

                // Update scoring - higher score for lower priority
                if (stockRatio === 0) {
                    priorityScore = 1; // High priority gets lowest score
                } else if (stockRatio <= 0.5) {
                    priorityScore = 2; // Medium priority gets middle score
                } else {
                    priorityScore = 3; // Low priority gets highest score
                }

                return {
                    itemName: item.itemName,
                    quantity: item.quantity,
                    reorderLevel: item.reorderLevel,
                    priority: calculatePriority(item),
                    priorityScore,
                    criticalityScore: aiPriority.itemScores.get(item.itemName) || 0
                };
            });

            // Sort items by priority score (descending) and then by criticalityScore
            const sortedItems = itemsWithPriority.sort((a, b) => {
                if (a.priorityScore !== b.priorityScore) {
                    return b.priorityScore - a.priorityScore; // Higher priority score (low priority) comes first
                }
                return b.criticalityScore - a.criticalityScore;
            });

            return {
                _id: admin._id,
                name: admin.name,
                city: admin.city,
                email: admin.email,
                lowStockItems: sortedItems,
                overallPriority: aiPriority.overallScore,
                aiRecommendation: aiPriority.recommendation
            };
        }));

        // Sort admins by their highest priority item (lowest priority score)
        const sortedAdmins = adminsData.sort((a, b) => {
            const aLowPriorityCount = a.lowStockItems.filter(item => item.priority === 'low').length;
            const bLowPriorityCount = b.lowStockItems.filter(item => item.priority === 'low').length;

            if (aLowPriorityCount !== bLowPriorityCount) {
                return bLowPriorityCount - aLowPriorityCount; // More low priority items come first
            }

            // If same number of low priority items, sort by highest priority score
            const aMaxPriority = Math.max(...(a.lowStockItems.map(item => item.priorityScore) || [1]));
            const bMaxPriority = Math.max(...(b.lowStockItems.map(item => item.priorityScore) || [1]));
            return bMaxPriority - aMaxPriority;
        });

        res.json(sortedAdmins);
    } catch (error) {
        console.error('Error in getAdminsWithLowStock:', error);
        res.status(500).json({ message: error.message });
    }
};

// AI-based priority calculation
const getAIPriority = async (admin, items) => {
    try {
        const prompt = `You are a medical inventory AI expert. Analyze this inventory and return ONLY a JSON response:

Hospital: ${admin.name} in ${admin.city}

Low Stock Items:
${items.map(item => `- ${item.itemName}: Current stock ${item.quantity}/${item.reorderLevel} units`).join('\n')}

Return ONLY this JSON format without any other text:
{
    "itemScores": {
        "${items[0]?.itemName}": 8,
        "${items[1]?.itemName}": 7
    },
    "overallScore": 7,
    "recommendation": "Prioritize restocking critical items"
}`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a JSON-only response medical inventory AI. Only respond with valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.1 // Lower temperature for more consistent JSON
        });

        try {
            return JSON.parse(completion.choices[0].message.content.trim());
        } catch (parseError) {
            console.error('AI Response Parse Error:', completion.choices[0].message.content);
            // Return default scores if parsing fails
            return {
                itemScores: items.reduce((acc, item) => {
                    acc[item.itemName] = item.quantity === 0 ? 10 :
                        item.quantity < item.reorderLevel ? 7 : 5;
                    return acc;
                }, {}),
                overallScore: 5,
                recommendation: "Based on current stock levels"
            };
        }
    } catch (error) {
        console.error('AI Priority Error:', error);
        // Return default values
        return {
            itemScores: {},
            overallScore: 5,
            recommendation: "Priority calculation failed"
        };
    }
};

// New function to get or create AI priority
const getOrCreateAIPriority = async (admin, items) => {
    try {
        // Check for existing priority less than 1 hour old
        const existingPriority = await AIPriority.findOne({
            adminId: admin._id,
            lastUpdated: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
        });

        if (existingPriority) {
            return existingPriority;
        }

        // Calculate new priority if none exists or too old
        const aiPriority = await getAIPriority(admin, items);

        // Store the new priority
        const newPriority = new AIPriority({
            adminId: admin._id,
            itemScores: new Map(Object.entries(aiPriority.itemScores)),
            overallScore: aiPriority.overallScore,
            recommendation: aiPriority.recommendation
        });

        await newPriority.save();
        return newPriority;
    } catch (error) {
        console.error('Error getting/creating AI priority:', error);
        // Return default values if AI fails
        return {
            itemScores: new Map(items.map(item => [
                item.itemName,
                item.quantity === 0 ? 10 :
                    item.quantity < item.reorderLevel ? 7 : 5
            ])),
            overallScore: 5,
            recommendation: "Based on current stock levels"
        };
    }
};

// Get all requests for an admin
const getMyRequests = async (req, res) => {
    try {
        const { adminId } = req.params;

        // Find all requests where the admin is either the requester or source
        const requests = await Distribution.find({
            $or: [
                { requestingAdminId: adminId },
                { sourceAdminId: adminId }
            ]
        })
            .populate({
                path: 'requestingAdminId',
                model: 'HealthproModel',
                select: 'name email city'
            })
            .populate({
                path: 'sourceAdminId',
                model: 'HealthproModel',
                select: 'name email city'
            })
            .sort({ createdAt: -1 });

        console.log('Found requests:', requests);
        res.json(requests);
    } catch (error) {
        console.error('Error in getMyRequests:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new distribution request
const createDistributionRequest = async (req, res) => {
    try {
        const { requestingAdminId, sourceAdminId, items } = req.body;

        if (!requestingAdminId || !sourceAdminId || !items || items.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const distribution = new Distribution({
            requestingAdminId,
            sourceAdminId,
            items
        });

        await distribution.save();

        // Populate the admin details before sending response
        const populatedDistribution = await Distribution.findById(distribution._id)
            .populate({
                path: 'requestingAdminId',
                model: 'HealthproModel',
                select: 'name email city'
            })
            .populate({
                path: 'sourceAdminId',
                model: 'HealthproModel',
                select: 'name email city'
            });

        res.status(201).json(populatedDistribution);
    } catch (error) {
        console.error('Error creating distribution request:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update request status
const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        const distribution = await Distribution.findById(requestId);
        if (!distribution) {
            return res.status(404).json({ message: 'Distribution request not found' });
        }

        if (status === 'approved') {
            // Update inventories
            for (const item of distribution.items) {
                // Decrease source inventory
                await Inventory.findOneAndUpdate(
                    {
                        adminId: distribution.sourceAdminId,
                        itemName: item.itemName
                    },
                    { $inc: { quantity: -item.quantity } }
                );

                // Increase destination inventory
                await Inventory.findOneAndUpdate(
                    {
                        adminId: distribution.requestingAdminId,
                        itemName: item.itemName
                    },
                    { $inc: { quantity: item.quantity } },
                    { upsert: true }
                );
            }
        }

        distribution.status = status;
        await distribution.save();

        res.json(distribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to calculate priority
const calculatePriority = (item) => {
    const stockRatio = item.quantity / item.reorderLevel;
    if (stockRatio === 0) return 'high';
    if (stockRatio <= 0.5) return 'medium';
    return 'low'; // This will now appear at the top
};

// Save predicted need
const savePredictedNeed = async (req, res) => {
    try {
        const { adminId, itemName, predictedQuantity, predictedDate, priority } = req.body;

        console.log('Received prediction data:', req.body);

        // Validate the data
        if (!adminId || !itemName || !predictedQuantity || !predictedDate) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }

        // Create new prediction
        const predictedNeed = new PredictedNeed({
            adminId,
            itemName,
            predictedQuantity: parseInt(predictedQuantity),
            predictedDate: new Date(predictedDate),
            priority: priority || 'medium'
        });

        await predictedNeed.save();

        res.status(201).json({
            success: true,
            data: predictedNeed
        });
    } catch (error) {
        console.error('Error saving prediction:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get admins with predicted needs
const getAdminsWithPredictedNeeds = async (req, res) => {
    try {
        const { adminId } = req.params;
        console.log('Fetching predicted needs for adminId:', adminId);

        // Get all admins except current one
        const admins = await Healthpro.find({ _id: { $ne: adminId } });

        // Get predicted needs for each admin with proper population
        const adminsData = await Promise.all(admins.map(async (admin) => {
            const predictedNeeds = await PredictedNeed.find({
                adminId: admin._id,
                status: { $ne: 'completed' } // Get all needs that aren't completed
            }).sort({ predictedDate: 1 }); // Sort by predicted date

            // Debug log
            console.log(`Found ${predictedNeeds.length} predicted needs for admin ${admin.name}`);

            // Only return admins with predicted needs
            if (predictedNeeds.length === 0) return null;

            return {
                _id: admin._id,
                name: admin.name,
                city: admin.city,
                email: admin.email,
                predictedNeeds: predictedNeeds.map(need => ({
                    _id: need._id,
                    itemName: need.itemName,
                    quantity: need.predictedQuantity,
                    priority: need.priority || 'medium',
                    predictedDate: need.predictedDate,
                    status: need.status || 'pending'
                }))
            };
        }));

        // Filter out null values (admins with no needs)
        const filteredAdmins = adminsData.filter(admin => admin !== null);
        console.log('Sending predicted needs data:', filteredAdmins);

        res.json(filteredAdmins);
    } catch (error) {
        console.error('Error fetching predicted needs:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminsWithLowStock,
    createDistributionRequest,
    getMyRequests,
    updateRequestStatus,
    savePredictedNeed,
    getAdminsWithPredictedNeeds
};

const Transaction = require("../models/Transaction");
const axios = require("axios");
require(".env").configure();

const processCopilotQuery = async(req,res)=>{
    try{
        const {query} = req.body;

        // Validate Query
        if(typeof(query)!=="string" || !query.trim() || query.length>5000){
            return res.status(400).json({
                success: false,
                message: "Please provide a valid query (maximum 5000 characters)."
            });
        }

        // Get authenticated user's ID from JWT
        const userId = req.user.userId;

        // Fetch only this user's transactions
        const [transactions, totalCount] = await Promise.all([
            Transaction.find({userId}).sort({transactionDateTime:-1}).limit(100),
            Transaction.countDocuments({userId})
        ]);

        // Prepare transaction context for the AI service
        const transactionContext = {
            totalTransactionCount: totalCount,
            includedTransactionCount: transactions.length,
            note: (totalCount>transactions.length) ? "Only the 100 most recent transactions are included." : "All transactions are included.",
            transactions: transactions.map(t=>({
                amount: t.amount,
                type: t.type,
                category: t.category,
                merchant: t.merchant || null,
                receiver: t.receiver || null,
                paymentMethod: t.paymentMethod,
                transactionDateTime: t.transactionDateTime,
                transactionStatus: t.transactionStatus,
                description: t.description || null
            }))
        };

        // Generate AI Response
        const url = process.env.AI_SERVICE_URL;//write the url that ai-service exposes in .env file of backend folder
        const response = await axios.post(
            url,
            {
                query: query.trim(),
                transactionContext
            },
            {
                timeout: 35000
            }
        );
        const answer = response.data.answer;

        return res.status(200).json({
            success: true,
            message: "AI response generated successfully",
            data: {
                query: query.trim(),
                answer,
                transactionsConsidered: transactions.length,
                totalTransactions: totalCount
            }
        });
    }catch(error){
        console.error("AI Controller Error:", error);

        if(error.code==="ETIMEDOUT" || error.code==="ECONNABORTED"){
            return res.status(504).json({
                success: false,
                message: "AI service request timed out."
            });
        }

        if(error.response){
            return res.status((error.response.status === 504) ? 504 : 502).json({
                success: false,
                message: "AI service returned an error."
            });
        }

        return res.status(502).json({
            success: false,
            message: "Unable to connect to AI service."
        });
    }

};

module.exports = {processCopilotQuery};
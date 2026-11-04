
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const fs = require("fs");

const routesDir = path.resolve(__dirname, "../routes");

// Automatically find all JavaScript route files
const routeFiles = fs.readdirSync(routesDir)
    .filter(file => file.endsWith(".js"))
    .map(file => path.resolve(routesDir, file));

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "PayGuard AI API Documentation",
            version: "1.0.0",
            description: `
                Official API documentation for PayGuard AI.

                This documentation contains authentication,
                transaction management, analytics, fraud detection
                and AI Copilot APIs.
            `
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Development Server"
            }
        ],

        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

        tags: [
            {
                name: "Authentication",
                description: "User registration and login APIs"
            },
            {
                name: "Transactions",
                description: "Transaction management APIs"
            },
            {
                name: "Analytics",
                description: "Financial analytics APIs"
            },
            {
                name: "Fraud Detection",
                description: "Fraud detection and risk APIs"
            },
            {
                name: "AI Copilot",
                description: "AI-powered financial assistance APIs"
            }
        ]
    },

    // Scan all route files automatically
    apis: routeFiles
};

const swaggerSpec = swaggerJsdoc(options);

// Debug logs
console.log("Swagger scanning:", routeFiles);
console.log("Swagger detected:", Object.keys(swaggerSpec.paths || {}));
console.log(
    JSON.stringify(swaggerSpec.paths, null, 2)
);
module.exports = swaggerSpec;

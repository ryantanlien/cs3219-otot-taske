import * as redis from "redis";

const redisClient = await redis.createClient();
redisClient.on("error", (error) => {
    console.error(`ErrorL ${error}`);
});

export var isCacheConnected = false;
try {
    redisClient.connect();
} catch (error) {
    console.log(error);
}

export async function getCreditCardsFromCache() {
    const cacheCreditCards = await redisClient.get("creditcards");
    return cacheCreditCards;
}

export async function cacheCreditCards(creditCardsJson) {
    console.log("Caching...");
    await redisClient.set("creditcards", creditCardsJson, (err, reply) => {
        console.log(err);
        console.log(reply);
    });
    console.log("... DONE");
    return true;
}

export async function clearCreditCardsCache() {
    try {
        await redisClient.del("creditcards");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
} 
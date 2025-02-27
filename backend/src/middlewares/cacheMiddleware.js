import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

export const cacheMiddleware = (req, res, next) => {
  try {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    } else {
      res.sendResponse = res.json;
      res.json = (body) => {
        cache.set(key, body);
        res.sendResponse(body);
      };
      next();
    }
  } catch (error) {
    console.error("Cache middleware error:", error);
    next(); // Continue to the next middleware even if cache fails
  }
};
const createRateLimiter = (refillRate: number, capacity: number) => {
    let tokens = capacity;
    let lastRefill = Date.now();

    const refill = () => {
        const now = Date.now();
        const elapsed = now - lastRefill;
        const tokensToAdd = Math.floor(elapsed / refillRate);
        if (tokensToAdd > 0) {
            tokens = Math.min(capacity, tokens + tokensToAdd);
            lastRefill = now;
        }
    };

    return () => {
        refill();
        if (tokens > 0) {
            tokens--;
            return true;
        }
        return false;
    };
};

export default createRateLimiter;
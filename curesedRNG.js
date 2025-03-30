class PRNG {

    recurseSeed;
    constructor() {
        this.recurseSeed = "a";
    }

    /**
     * Converts a number to abase 65536 / base Unicode string;
    */
    static toUnicode = function (inp = 0) {
        var total = "";
        var val = Math.floor(inp);
        const len = 65536;
        do {
            total = String.fromCharCode(val % len) + total;
            val = Math.floor(val / len);
        }
        while (val > 0)
        return total
    }

    /**
     * Converts a base 65536 / base Unicode string to a number;
    */
    static toNumber = function (inp = "a") {
        var total = 0;
        for (let i = 0; i < inp.length; i++) {
            var x = inp.charCodeAt(i);
            total += x * (65536 ** ((inp.length - 1) - i));
        }
        return total
    }
    
    static UInt8arraytoBigint = function (inp = Uint8Array.from([1])){
        let total = 0n;
        for(let i = 0; i < inp.length; i++){
            total += BigInt(inp[i])* (256n ** BigInt((inp.length - 1) - i));
        }
        return total;
    }

    static StringtoBigint = function (inp = "aaa"){
        let total = 0n;
        for(let i = 0; i < inp.length; i++){
            total += BigInt(inp.charCodeAt(i))* (65536n ** BigInt((inp.length - 1) - i));
        }
        return total;
    }

    static BItoUnicode = function (inp = 0n) {
        var total = "";
        var val = inp;
        const len = 65536n;
        do {
            total = String.fromCharCode(Number(val % len)) + total;
            val = val / len;
        }
        while (val > 0n)
        return total
    }

    stringRandom(seed = "a", singleChar = false) {
        const maxVal = PRNG.toUnicode(65535);
        let max = "" + maxVal;
        let out = "";
        let q = 1;
        for (let i = seed.length - 1; i >= 0; i--) {
            var x = seed.charCodeAt(i);
            var y = x + "";

            for (let o = 0; o < y.length; o++) {
                var z = y.charCodeAt(o);
                x *= z;
            }
            x = x % 65536;
            x += q;
            x = x % 65536;
            q = singleChar ? 1 : x;
            max += (singleChar || i == 0) ? "" : maxVal;
            out += String.fromCharCode(x);
        }
        return [out, max]
    }

    /**
     * Returns a random string normally the same length as the input seed, or fitted between the numbrical input values specified
     * @param seed The input seed string, which defualts to a recursive input seed of the previous output.
     * @param overwriteRecursion Overwrites the defualt recursive seed with the output of the current seed.
     * @param min Minimum numbrical value, not used without a maximum value defined.
     * @param max Maximum numbrical value.
     * @param noAdd Processes each character invidually, if there's a maximum value set each invidual character is scaled bewteen the min and max;
     * @param boundType Either "loop" or "scale": if set to loop all charicater's numberbrical value wrap around the maximum value, if set to scale the numbrical values scale between the minumum and maximum as intergers
     */
    strRNG(seed = this.recurseSeed, noAdd = false, overwriteRecursion = false, min = 0, max = undefined, boundType = "loop") {
        var call = this.stringRandom(seed, noAdd);
        if (seed == this.recurseSeed || overwriteRecursion) {
            this.recurseSeed = call[0];
        }
        if (max != undefined) {
            if (noAdd) {
                if (boundType == "loop") {
                    var out = ""
                    for (let i = 0; i < call[0].length; i++) {
                        out += PRNG.toUnicode((PRNG.toNumber(call[0][i]) % (max - min + 1)) + min);
                    }
                    return out
                } else if (boundType == "scale") {
                    var out = ""
                    for (let i = 0; i < call[0].length; i++) {
                        out += PRNG.toUnicode(Math.round(((PRNG.toNumber(call[0][i].charCodeAt(i)) / PRNG.toNumber(call[1])) * (max - min)) + min));
                    }
                    return out
                }
            } else {
                if (boundType == "loop") {
                    return PRNG.toUnicode((PRNG.toNumber(call[0]) % (max - min + 1)) + min);
                } else if (boundType == "scale") {
                    return PRNG.toUnicode(Math.round(((PRNG.toNumber(call[0]) / PRNG.toNumber(call[1])) * (max - min)) + min));
                }
            }
        }

        return call[0];
    }

    /**
     * Returns a random array of float(s) from a seed string, defualts to a one entry 0-1 float
     * @param seed The input seed string, which defualts to a recursive input seed of the previous output.
     * @param overwriteRecursion Overwrites the defualt recursive seed with the output of the current seed.
     * @param min Minimum output value(s).
     * @param max Maximum output value(s).
     * @param noTotal Processes each seed character invidually, and returns a new entry for each.
     */
    strRNGflt(seed = this.recurseSeed, noTotal = false, overwriteRecursion = false, min = 0, max = undefined) {
        var call = this.stringRandom(seed, noTotal);
        if (seed == this.recurseSeed || overwriteRecursion) {
            this.recurseSeed = call[0];
        }

        if (max != undefined) {
            if (noTotal) {
                var out = [];
                for (let i = 0; i < call[0].length; i++) {
                    out[i] = ((PRNG.toNumber(call[0][i]) / PRNG.toNumber(call[1])) * (max - min)) + min;
                }
                return out
            }
            return [((PRNG.toNumber(call[0]) / PRNG.toNumber(call[1])) * (max - min)) + min];
        }

        if (noTotal) {
            var out = [];
            for (let i = 0; i < call[0].length; i++) {
                out[i] = PRNG.toNumber(call[0][i]) / PRNG.toNumber(call[1]) + min;
            }
            return out
        }

        return PRNG.toNumber(call[0]) / PRNG.toNumber(call[1])+min;
    }
}
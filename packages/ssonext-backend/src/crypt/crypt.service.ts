import {Injectable} from '@nestjs/common';

const sha512 = require("js-sha512");

/**
 * Provide hashing of passwords using SHA 512
 * 
 * You can pass a secret to be used in the constructor or directly on the method 
 * 
 * 
 * @example
 * 
 * // returns the hashed password
 * const hash = cryptService.hash("my-pwd") 
 * 
 * cryptService.check("my-pwd", hash) //true
 * 
 */
@Injectable()
export class CryptService {
    
    constructor(private secret = "") {
    }

    /**
     * 
     * @param rawPassword
     * @param secret (optional)
     * 
     * @example
     *
     * // returns the hashed password
     * const hash = cryptService.hash("my-pwd")
     */
    hash(rawPassword: string, secret:string = ""): string {
        const s = secret || this.secret
        return sha512(rawPassword + s)
    }

    /**
     * 
     * @param rawPassword
     * @param hash
     * @param secret (optional)
     * 
     * @example
     * cryptService.check("my-pwd", hash) //returns true if hashes match
     */
    check(rawPassword: string, hash, secret:string = ""): boolean {
        const s = secret || this.secret
        return sha512(rawPassword + s) == hash
    }

}

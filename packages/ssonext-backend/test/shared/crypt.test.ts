import {CryptService} from "../../src/crypt/crypt.service";


test("test encode/decode of userids", async () => {
    
    const service = new CryptService()
    expect(1).toBe(service.decode(service.encode(1)))
    expect(1000).toBe(service.decode(service.encode(1000)))
    expect(15).not.toBe(service.decode(service.encode(2324234)))
    expect(2324234).toBe(service.decode(service.encode(2324234)))
    
})

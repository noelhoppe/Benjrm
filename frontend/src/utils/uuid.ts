export default function generateUuid(): string {
    const cryptoApi = globalThis.crypto

    if (cryptoApi?.randomUUID) {
        return cryptoApi.randomUUID()
    }

    const bytes = new Uint8Array(16)

    if (cryptoApi?.getRandomValues) {
        cryptoApi.getRandomValues(bytes)
    } else {
        for (let index = 0; index < bytes.length; index += 1) {
            bytes[index] = Math.floor(Math.random() * 256)
        }
    }

    // Avoid bitwise operators to satisfy lint rules. Set UUID version (4)
    // by keeping the low nibble and adding 0x40, and set the variant by
    // keeping the low 6 bits and adding 0x80.
    bytes[6] = (bytes[6] % 16) + 0x40
    bytes[8] = (bytes[8] % 64) + 0x80

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))

    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`
}

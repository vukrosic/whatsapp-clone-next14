export function removePlusSign(phoneNumber: string) {
    if (phoneNumber && phoneNumber.startsWith('+')) {
        return phoneNumber.substring(1);
    }
    return phoneNumber;
}
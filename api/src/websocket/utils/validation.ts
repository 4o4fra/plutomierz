function validateAndFormatMessage(message: string): { valid: boolean, formattedMessage?: string, error?: string } {
    const cleanedMessage = message.replace(/[\u0020\u00A0\u200B\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u200E\u200F]/g, ' ');
    const trimmedMessage = cleanedMessage.trim().replace(/\s+/g, ' ');

    if (trimmedMessage.length === 0) {
        return {valid: false, error: 'Message cannot be empty'};
    }

    if (trimmedMessage.length > 200) {
        return {valid: false, error: 'Message too long'};
    }

    return {valid: true, formattedMessage: trimmedMessage};
}

function validateAndFormatNickname(nickname: string): { valid: boolean, formattedNickname?: string, error?: string } {
    const cleanedNickname = nickname.replace(/[\u0020\u00A0\u200B\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u200E\u200F]/g, ' ');
    const trimmedNickname = cleanedNickname.trim().replace(/\s+/g, ' ');

    if (trimmedNickname.length === 0) {
        return {valid: false, error: 'Nickname cannot be empty'};
    }

    if (trimmedNickname.length > 16) {
        return {valid: false, error: 'Nickname too long'};
    }

    if (/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/.test(trimmedNickname)) {
        return {valid: false, error: 'Nickname contains special characters'};
    }

    return {valid: true, formattedNickname: trimmedNickname};
}

export {validateAndFormatMessage, validateAndFormatNickname};
import {validateAndFormatMessage, validateAndFormatNickname} from '../../../src/websocket/utils/validation';
import 'jest';

describe('validateAndFormatMessage', () => {
    test('returns valid and formatted message for a valid input', () => {
        const result = validateAndFormatMessage('Hello World');
        expect(result).toEqual({valid: true, formattedMessage: 'Hello World'});
    });

    test('returns error for an empty message', () => {
        const result = validateAndFormatMessage('   ');
        expect(result).toEqual({valid: false, error: 'Message cannot be empty'});
    });

    test('returns error for a message that is too long', () => {
        const longMessage = 'a'.repeat(201);
        const result = validateAndFormatMessage(longMessage);
        expect(result).toEqual({valid: false, error: 'Message too long'});
    });

    test('removes redundant spaces from the message', () => {
        const result = validateAndFormatMessage('  Hello   World  ');
        expect(result).toEqual({valid: true, formattedMessage: 'Hello World'});
    });

    test('returns error for a message with only special characters', () => {
        const result = validateAndFormatMessage('!!!@@@###');
        expect(result).toEqual({valid: false, error: 'Message contains special characters'});
    });

    test('returns valid and formatted message for a message with mixed characters', () => {
        const result = validateAndFormatMessage('Hello123');
        expect(result).toEqual({valid: true, formattedMessage: 'Hello123'});
    });
});

describe('validateAndFormatNickname', () => {
    test('returns valid and formatted nickname for a valid input', () => {
        const result = validateAndFormatNickname('JohnDoe');
        expect(result).toEqual({valid: true, formattedNickname: 'JohnDoe'});
    });

    test('returns error for an empty nickname', () => {
        const result = validateAndFormatNickname('   ');
        expect(result).toEqual({valid: false, error: 'Nickname cannot be empty'});
    });

    test('returns error for a nickname that is too long', () => {
        const longNickname = 'a'.repeat(17);
        const result = validateAndFormatNickname(longNickname);
        expect(result).toEqual({valid: false, error: 'Nickname too long'});
    });

    test('removes redundant spaces from the nickname', () => {
        const result = validateAndFormatNickname('  John   Doe  ');
        expect(result).toEqual({valid: true, formattedNickname: 'John Doe'});
    });

    test('returns error for a nickname with special characters', () => {
        const result = validateAndFormatNickname('John@Doe');
        expect(result).toEqual({valid: false, error: 'Nickname contains special characters'});
    });

    test('returns valid and formatted nickname for a nickname with mixed characters', () => {
        const result = validateAndFormatNickname('John123');
        expect(result).toEqual({valid: true, formattedNickname: 'John123'});
    });
});
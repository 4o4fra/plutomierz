import {expect} from 'chai';
import {validateAndFormatMessage, validateAndFormatNickname} from '../../src/utils/validation';

describe('validateAndFormatMessage', () => {
    it('returns valid and formatted message for a valid input', () => {
        const result = validateAndFormatMessage('Hello World');
        expect(result).to.deep.equal({valid: true, formattedMessage: 'Hello World'});
    });

    it('returns error for an empty message', () => {
        const result = validateAndFormatMessage('   ');
        expect(result).to.deep.equal({valid: false, error: 'Message cannot be empty'});
    });

    it('returns error for a message that is too long', () => {
        const longMessage = 'a'.repeat(201);
        const result = validateAndFormatMessage(longMessage);
        expect(result).to.deep.equal({valid: false, error: 'Message too long'});
    });

    it('removes redundant spaces from the message', () => {
        const result = validateAndFormatMessage('  Hello   World  ');
        expect(result).to.deep.equal({valid: true, formattedMessage: 'Hello World'});
    });
});

describe('validateAndFormatNickname', () => {
    it('returns valid and formatted nickname for a valid input', () => {
        const result = validateAndFormatNickname('JohnDoe');
        expect(result).to.deep.equal({valid: true, formattedNickname: 'JohnDoe'});
    });

    it('returns error for an empty nickname', () => {
        const result = validateAndFormatNickname('   ');
        expect(result).to.deep.equal({valid: false, error: 'Nickname cannot be empty'});
    });

    it('returns error for a nickname that is too long', () => {
        const longNickname = 'a'.repeat(17);
        const result = validateAndFormatNickname(longNickname);
        expect(result).to.deep.equal({valid: false, error: 'Nickname too long'});
    });

    it('removes redundant spaces from the nickname', () => {
        const result = validateAndFormatNickname('  John   Doe  ');
        expect(result).to.deep.equal({valid: true, formattedNickname: 'John Doe'});
    });
});
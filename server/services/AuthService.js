import crypto from 'crypto';
const secret = '444hsvgs7612fywdvhasv762yw';

export default {
    encrypt(user){
        let cipher = crypto.createCipher('aes192', secret);
        let token = cipher.update(JSON.stringify(user), 'utf8', 'hex');
        token += cipher.final('hex');
        return token;
    },

    decrypt(token){
        let user;
        let decipher = crypto.createDecipher('aes192', secret);
        let decrypted = decipher.update(token, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        try {
            user = JSON.parse(decrypted);
        } catch (e) {
            return new Error("Invalid token");
        }
        return user;
    }
}
/**
 * Created by SooMinKim on 2023-01-18
 */
'use strict';

module.exports = {
    port: (process.env.INV_PORT || 8001),
    db: {
        rds: {
            host: (process.env.INV_RDS_HOST || '127.0.0.1'),
            whost: (process.env.INV_RDS_WHOST || '127.0.0.1'),
            port: (process.env.INV_RDS_PORT || '3306'),
            user: (process.env.INV_RDS_USER || 'devinventory'),
            password: (process.env.INV_RDS_PASSWORD || ''),
            database: (process.env.INV_RDS_DATABASE || 'devinventory'),
        },
    },
    crypto: {
        password_secret_key: (process.env.INV_PASSWORD_SECRET_KEY || '$C&F)J@NcRfUjXn2r5u8x/A%D*G-KaPd'),
        password_iv: (process.env.INV_PASSWORD_IV || '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0'),
    },
    jwt: {
        secret_key: (process.env.JWT_SECRET_KEY || 'jwt_secret_key'),
    },
};

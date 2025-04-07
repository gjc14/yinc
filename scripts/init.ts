/**
 * Init check required environment variables
 */
import 'dotenv/config'

function checkDatabaseUrl(): boolean {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
        console.warn(
            '\n⚠️ PostgreSQL DATABASE_URL 未設定。請設定以啟用 Papa。路徑: ./.env (PostgreSQL DATABASE_URL is not set. Please set this to enable Papa. Path: ./.env)'
        )
        console.warn(
            '設定方法: 在專案根目錄的 .env 檔案中加入 DATABASE_URL=您的URL (How to set: Add DATABASE_URL=your-url to the .env file in the root directory of the project.)'
        )
        return false
    }

    console.log('✅ DATABASE_URL 已設定 (DATABASE_URL is set)')
    return true
}

import { emailInstance } from '~/lib/utils/email'

function checkResendApiKey(): boolean {
    if (!emailInstance) {
        console.warn(
            '\n⚠️ Email 設定尚未完成，您必須提供 AUTH_EMAIL 以及 RESEND_API_KEY 環境變數以啟用 Email 功能 (Email setup is not complete, you must provide AUTH_EMAIL and RESEND_API_KEY environment variables to enable email functionality)'
        )
        console.warn(
            '\n您可以從 https://resend.com 獲取 API 金鑰。(You can get the API key from https://resend.com.)'
        )
    }

    console.log('✅ Email 設定正確 (Email is set correctly)')
    return true
}

async function init() {
    console.log('🚀 初始化 Papa 應用程式... (Initializing Papa app...)')

    if (!checkDatabaseUrl()) {
        process.exit(1)
    }
    if (!checkResendApiKey()) {
        process.exit(1)
    }
}

init()

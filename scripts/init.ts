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

function checkResendApiKey(): boolean {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
        console.warn(
            '\n⚠️ RESEND_API_KEY 未設定。請設定此項以啟用管理員帳戶。(RESEND_API_KEY is not set. Please set this to enable admin account.)'
        )
        console.warn(
            '您可以從 https://resend.com 獲取 API 金鑰。(You can get the API key from https://resend.com.)'
        )
        console.warn(
            '設定方法: 在專案根目錄的 .env 檔案中加入 RESEND_API_KEY=您的API金鑰 (How to set: Add RESEND_API_KEY=your-api-key to the .env file in the root directory of the project.)'
        )
        return false
    }

    console.log('✅ RESEND_API_KEY 已設定 (RESEND_API_KEY is set)')
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

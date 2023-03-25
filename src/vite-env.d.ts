/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_ADMIN_KEY: string
    readonly VITE_ADMIN_PATH: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
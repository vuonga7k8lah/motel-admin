declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_API_URL: string;
        REACT_APP_API_KEY: string;
        REACT_APP_ENV: "development" | "production" | "test";
        // Thêm các biến môi trường khác tại đây nếu cần
    }
}

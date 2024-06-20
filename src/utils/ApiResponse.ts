class ApiResponse {
    data?: any;
    message: string;
    success: boolean;

    constructor(success: boolean,  message: string = "success" , data?: any) {
        this.success = success;
        
        this.message = message;
        this.data = data;
    }
}

export { ApiResponse };

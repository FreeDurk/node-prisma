export class AppError extends Error { 
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype)
    }
}

export class NotFoundError extends AppError { 
    constructor(message: string = 'Resource not found.') { 
        super(404,message)
    }
}

export class ValidationError extends AppError { 
    constructor(message: string = 'Validation Failed.') { 
        super(400, message);
    }
}

export class UnathorizedError extends AppError { 
    constructor(message: string = 'Unauthorized.') { 
        super(401, message);
    }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}
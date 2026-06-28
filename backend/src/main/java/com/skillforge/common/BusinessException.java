package com.skillforge.common;

public class BusinessException extends RuntimeException {

    private final int code;
    private final String message;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    public BusinessException(ErrorCode errorCode, String customMessage) {
        super(customMessage);
        this.code = errorCode.getCode();
        this.message = customMessage;
    }

    public int getCode() { return code; }

    @Override
    public String getMessage() { return message; }
}

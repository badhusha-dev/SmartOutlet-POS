package com.smartoutlet.auth.enums;

public enum Role {
    ADMIN("ADMIN"),
    STAFF("STAFF");

    private final String value;

    Role(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}
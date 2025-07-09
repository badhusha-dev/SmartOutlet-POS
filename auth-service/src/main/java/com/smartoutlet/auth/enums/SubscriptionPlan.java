package com.smartoutlet.auth.enums;

public enum SubscriptionPlan {
    BASIC("BASIC"),
    STANDARD("STANDARD"),
    PREMIUM("PREMIUM");

    private final String value;

    SubscriptionPlan(String value) {
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
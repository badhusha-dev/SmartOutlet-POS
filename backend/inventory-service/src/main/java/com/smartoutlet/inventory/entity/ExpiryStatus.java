package com.smartoutlet.inventory.entity;

public enum ExpiryStatus {
    FRESH,      // 🟢 Green - Fresh products
    WARNING,    // 🟡 Yellow - Near expiry
    CRITICAL,   // 🔴 Red - Critical/Expired
    EXPIRED     // ⚫ Black - Expired
}
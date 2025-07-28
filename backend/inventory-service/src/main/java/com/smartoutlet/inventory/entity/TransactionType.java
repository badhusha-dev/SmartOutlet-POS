package com.smartoutlet.inventory.entity;

public enum TransactionType {
    RECEIVE,        // Stock received from supplier
    SALE,           // Stock sold to customer
    RETURN,         // Customer return
    ADJUSTMENT,     // Manual stock adjustment
    TRANSFER_IN,    // Stock transferred from another outlet
    TRANSFER_OUT,   // Stock transferred to another outlet
    ISSUE,          // Stock issued for internal use
    DAMAGE,         // Stock marked as damaged
    EXPIRE,         // Stock expired
    WASTE          // Stock wasted/disposed
}
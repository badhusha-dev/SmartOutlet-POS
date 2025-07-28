package com.smartoutlet.recipe.entity;

public enum UnitOfMeasure {
    // Weight units
    KILOGRAM("kg", "Kilogram", "Weight"),
    GRAM("g", "Gram", "Weight"),
    POUND("lb", "Pound", "Weight"),
    OUNCE("oz", "Ounce", "Weight"),
    
    // Volume units
    LITER("L", "Liter", "Volume"),
    MILLILITER("mL", "Milliliter", "Volume"),
    GALLON("gal", "Gallon", "Volume"),
    QUART("qt", "Quart", "Volume"),
    PINT("pt", "Pint", "Volume"),
    CUP("cup", "Cup", "Volume"),
    TABLESPOON("tbsp", "Tablespoon", "Volume"),
    TEASPOON("tsp", "Teaspoon", "Volume"),
    
    // Count units
    PIECE("pcs", "Piece", "Count"),
    DOZEN("doz", "Dozen", "Count"),
    PACK("pack", "Pack", "Count"),
    BOTTLE("bottle", "Bottle", "Count"),
    CAN("can", "Can", "Count"),
    BOX("box", "Box", "Count"),
    BAG("bag", "Bag", "Count"),
    
    // Length units
    METER("m", "Meter", "Length"),
    CENTIMETER("cm", "Centimeter", "Length"),
    INCH("in", "Inch", "Length"),
    FOOT("ft", "Foot", "Length");
    
    private final String symbol;
    private final String displayName;
    private final String category;
    
    UnitOfMeasure(String symbol, String displayName, String category) {
        this.symbol = symbol;
        this.displayName = displayName;
        this.category = category;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getCategory() {
        return category;
    }
    
    public static UnitOfMeasure fromSymbol(String symbol) {
        for (UnitOfMeasure uom : values()) {
            if (uom.symbol.equalsIgnoreCase(symbol)) {
                return uom;
            }
        }
        throw new IllegalArgumentException("Unknown unit of measure symbol: " + symbol);
    }
}